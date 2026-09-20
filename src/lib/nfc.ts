let NfcManager: any = null;
let NfcTech: any = null;
let Ndef: any = null;

try {
  const nfcModule = require('react-native-nfc-manager');
  NfcManager = nfcModule.default;
  NfcTech = nfcModule.NfcTech;
  Ndef = nfcModule.Ndef;
} catch {}

let nfcSupported = false;

export async function initNfc() {
  if (!NfcManager) return;
  try {
    nfcSupported = await NfcManager.isSupported();
    if (nfcSupported) {
      await NfcManager.start();
    }
  } catch {
    nfcSupported = false;
  }
}

export async function cancelNFC() {
  if (!nfcSupported) return;
  try {
    await NfcManager.cancelTechnologyRequest();
  } catch {}
}

export async function readNFC(): Promise<{ success: boolean; data: string }> {
  if (!nfcSupported) {
    return { success: false, data: 'NFC is not supported on this device.' };
  }
  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);
    const tag = await NfcManager.getTag();
    if (!tag?.ndefMessage?.[0]?.payload) throw new Error('No NDEF payload');
    const data = Ndef.text.decodePayload(tag.ndefMessage[0].payload as unknown as Uint8Array);
    return { success: true, data };
  } catch (ex: any) {
    return { success: false, data: 'Invalid badge, please visit help desk.' };
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
}

export async function writeNFC(text: string): Promise<boolean> {
  if (!nfcSupported) return false;
  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);
    const bytes = Ndef.encodeMessage([Ndef.textRecord(text)]);
    if (bytes) {
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      return true;
    }
    return false;
  } catch {
    return false;
  } finally {
    NfcManager.cancelTechnologyRequest();
  }
}
