import NfcManager, {NfcEvents, NfcTech} from 'react-native-nfc-manager';
// Pre-step, call this before any NFC operations
import ndef from 'ndef/lib/ndef';
export async function initNfc(onDiscover) {
  const isSupported = await NfcManager.isSupported();
  if (isSupported) {
    await NfcManager.start();
    NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
      if (!tag) {
        onDiscover(null);
        return;
      }
      console.log('tag: ', tag)
      // const text = tag.ndefMessage[0].payload.reduce(
      //   (acc, byte) => acc + String.fromCharCode(byte), ''
      // )

      const text = ndef.text.decodePayload(tag.ndefMessage[0].payload);
      onDiscover(text)
    });

    const cleanUp = () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.setEventListener(NfcEvents.SessionClosed, null);
    }

    return cleanUp
  } else {
    console.log('Device not supported')
    return null
  }
}

export async function readNFC() {
   await NfcManager.registerTagEvent();
}

export async function writeNFC(text) {
  let result = false;

  try {
    await NfcManager.requestTechnology(NfcTech.Ndef);

    console.log('encoding: ', text)
    // const encoder = new TextEncoder();
    // const bytes = encoder.encode(text);
    // const bytes = [ndef.encodeMessage(text)]
    const byteArray = [...text].map(t => t.charCodeAt())
    const message = [ndef.textRecord(text)]
    console.log('message: ',message)
    const bytes = ndef.encodeMessage(message)
    console.log('bytes: ', bytes)
    if (bytes) {
      await NfcManager.ndefHandler
        .writeNdefMessage(bytes);
      result = true;
    }
  } catch (ex) {
    console.warn(ex);
  } finally {
    NfcManager.cancelTechnologyRequest();
  }

  return result;
}