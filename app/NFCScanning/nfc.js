import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";

export async function initNfc() {
  const isSupported = await NfcManager.isSupported();
  if (isSupported) {
    await NfcManager.start();
  } else {
    console.warn("Device not supported for NFC");
  }
}

export async function readNFC() {
  let data = "";

  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);
    const tag = await NfcManager.getTag();
    console.log("Tag found", tag);

    data = Ndef.text.decodePayload(tag.ndefMessage[0].payload);
  } catch (ex) {
    console.warn("NFC Reading Failed:", ex.message);
  } finally {
    NfcManager.cancelTechnologyRequest();
  }

  return data;
}

export async function writeNFC(text) {
  let result = false;

  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);

    console.log("Writing data to NFC:", text);

    const bytes = Ndef.encodeMessage([Ndef.textRecord(text)]);

    if (bytes) {
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      result = true;
    }
  } catch (ex) {
    console.warn("NFC Writing Failed:", ex.message);
  } finally {
    NfcManager.cancelTechnologyRequest();
  }

  return result;
}
