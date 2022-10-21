import { BackHandler, NativeModules, Platform } from "react-native";
import NfcManager, { NfcTech, Ndef } from "react-native-nfc-manager";

export async function initNfc() {
  const isSupported = await NfcManager.isSupported();
  if (isSupported) {
    await NfcManager.start();
  } else {
    console.warn("Device not supported for NFC");
  }
}

export async function cancelNFC() {
  console.log("Cancelling NFC");
  try {
    await NfcManager.unregisterTagEvent();
    await NfcManager.cancelTechnologyRequest();
  } catch (error) {
    console.warn(error);
  }
}

export async function readNFC() {
  let data = "";
  let success = true;

  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);
    const tag = await NfcManager.getTag();
    console.log("Tag found", tag);

    data = Ndef.text.decodePayload(tag.ndefMessage[0].payload);
  } catch (ex) {
    console.warn("NFC Reading Failed:", ex.message);
    success = false;
  } finally {
    NfcManager.cancelTechnologyRequest();
  }

  return { success, data };
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
