import { Buffer } from "buffer";

enum ParserState {
    None,
    NDEFInitial,
    NDEFTypeLength,
    NDEFPayloadLength,
    NDEFRecordType,
    NDEFData
}
enum WellKnownType {
    Unknown,
    Text,
    URI
}

export default class NDEFParser {
    private state = ParserState.None;
    private ndefType = WellKnownType.Unknown;
    private recordTypeLength = 1;
    private initialDataByte = NaN;
    private content: Buffer = Buffer.alloc(0);
    private contentIndex = 0;
    constructor(public readonly buffer: Buffer) {
        for (let i = 0; i < buffer.length; i++) {
            const byte = buffer[i];
            console.log('buffer ', i, ': ', buffer[i])
            if (this.state === ParserState.None) {
                if (byte === 0x00) {
                    // NULL block, skip
                    i++;
                    continue;
                }
                if (byte === 0x03 && buffer.length > i + 2 && buffer[i + 2] === 0xD1) {
                    // NDEF message
                    // Skip length field for now
                    i++;
                    this.state = ParserState.NDEFInitial;
                    continue;
                }
            }
            else if (this.state === ParserState.NDEFInitial) {
                if ((byte & 1 << 0) !== 1) {
                    throw new Error("Only NFC Well Known Records are supported");
                }
                if ((byte & 1 << 4) === 0) {
                    throw new Error("Only short records supported currently");
                }
                if ((byte & 1 << 6) === 0) {
                    throw new Error("Message must be end message currently");
                }
                if ((byte & 1 << 7) === 0) {
                    throw new Error("Message must be beginning message currently");
                }
                this.state = ParserState.NDEFTypeLength;
            }
            else if (this.state === ParserState.NDEFTypeLength) {
                this.recordTypeLength = byte;
                this.state = ParserState.NDEFPayloadLength;
            }
            else if (this.state === ParserState.NDEFPayloadLength) {
                this.content = Buffer.alloc(byte);
                this.contentIndex = 0;
                this.state = ParserState.NDEFRecordType;
            }
            else if (this.state === ParserState.NDEFRecordType) {
                if (byte === 0x54) {
                    this.ndefType = WellKnownType.Text;
                }
                if (byte === 0x55) {
                    this.ndefType = WellKnownType.URI;
                }
                this.initialDataByte = NaN;
                this.state = ParserState.NDEFData;
            }
            else if (this.state === ParserState.NDEFData) {
                if (byte === 0xFE) {
                    this.state = ParserState.None;
                    continue;
                }
                this.content[this.contentIndex] = byte;
                this.contentIndex++;
            }
        }
    }
    public getURI(): string {
        if (this.content.length < 2 || this.ndefType !== WellKnownType.URI) {
            throw new Error("No URI found in parsed content");
        }
        return this.getProtocol(this.content[0]) + this.content.slice(1, this.content.length).toString("utf8");
    }
    public getText(): string {
        if (this.content.length < 4 || this.ndefType !== WellKnownType.Text) {
            throw new Error("No text content found on tag");
        }
        const languageCodeLength = this.content[0];
        return this.content.slice(1 + languageCodeLength, this.content.length).toString("utf8");
    }
    public getContent(): string {
        if (this.ndefType === WellKnownType.Text) {
            return this.getText();
        }
        else if (this.ndefType === WellKnownType.URI) {
            return this.getURI();
        }
        else {
            return "";
        }
    }
    private getProtocol(identifier: number): string {
        switch (identifier) {
            case 0x00: return ""
            case 0x01: return "http://www."
            case 0x02: return "https://www."
            case 0x03: return "http://"
            case 0x04: return "https://"
            case 0x05: return "tel:"
            case 0x06: return "mailto:"
            case 0x07: return "ftp://anonymous:anonymous@"
            case 0x08: return "ftp://ftp."
            case 0x09: return "ftps://"
            case 0x0A: return "sftp://"
            case 0x0B: return "smb://"
            case 0x0C: return "nfs://"
            case 0x0D: return "ftp://"
            case 0x0E: return "dav://"
            case 0x0F: return "news:"
            case 0x10: return "telnet://"
            case 0x11: return "imap:"
            case 0x12: return "rtsp://"
            case 0x13: return "urn:"
            case 0x14: return "pop:"
            case 0x15: return "sip:"
            case 0x16: return "sips:"
            case 0x17: return "tftp:"
            case 0x18: return "btspp://"
            case 0x19: return "btl2cap://"
            case 0x1A: return "btgoep://"
            case 0x1B: return "tcpobex://"
            case 0x1C: return "irdaobex://"
            case 0x1D: return "file://"
            case 0x1E: return "urn: epc: id:"
            case 0x1F: return "urn: epc: tag:"
            case 0x20: return "urn: epc: pat:"
            case 0x21: return "urn: epc: raw:"
            case 0x22: return "urn: epc:"
            case 0x23: return "urn: nfc:"
        }
        return "";
    }
}
