import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  Alert,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Linking,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useTheme } from "@/hooks/use-theme";
import { Card } from "@/components/card";
import { initNfc, cancelNFC, readNFC } from "@/lib/nfc";
import { CheckoutRadio, type CheckoutType } from "./checkout-radio";
import { Touchable } from "@/components/touchable";

// Debug flag: shows a uid field that bypasses NFC scanning when filled in.
const SHOW_DEBUG_UID_INPUT = false;

export function ScanScreen() {
  const theme = useTheme();
  const [mode, setMode] = useState<CheckoutType>("swag");
  const [isScanning, setIsScanning] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [debugUid, setDebugUid] = useState("");
  const [useQR, setUseQR] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    initNfc();
  }, []);

  const checkoutScanUrl = (uid: string, type: CheckoutType) =>
    `https://live.hexlabs.org/admin/scan?uid=${encodeURIComponent(uid)}&type=${type}`;

  const createAlert = (message: string) =>
    Alert.alert("Error", message, [{ text: "OK" }]);

  const openCheckout = async (uid: string) => {
    try {
      await Linking.openURL(checkoutScanUrl(uid, mode));
    } catch (e: any) {
      createAlert(e.message);
    }
  };

  const parseUid = (data: string): string | null => {
    let json: any = {};
    try {
      json = JSON.parse(data);
    } catch {}
    return json?.uid ?? null;
  };

  const onQRScanned = async ({ data }: { data: string }) => {
    if (qrScanned) return;
    setQrScanned(true);
    const uid = parseUid(data);
    if (!uid) {
      createAlert("Invalid QR Code");
    } else {
      await openCheckout(uid);
    }
    setTimeout(() => setQrScanned(false), 3000);
  };

  const scanNFC = async () => {
    const overrideUid = SHOW_DEBUG_UID_INPUT ? debugUid.trim() : "";
    if (overrideUid) {
      await openCheckout(overrideUid);
      return;
    }
    setIsScanning(true);
    if (Platform.OS === "android") setModalVisible(true);
    const { success, data } = await readNFC();
    if (Platform.OS === "android") setModalVisible(false);
    setIsScanning(false);

    if (!success) {
      createAlert(data);
      return;
    }
    const uid = parseUid(data);
    if (!uid) {
      createAlert(
        "Invalid badge. Please see help desk to register your badge.",
      );
      return;
    }
    await openCheckout(uid);
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={async () => {
          await cancelNFC();
          setModalVisible(false);
        }}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.background }]}
          >
            <ActivityIndicator
              size="large"
              color="#5dbb63"
              style={{ marginBottom: 20 }}
            />
            <Text style={{ color: theme.text, fontFamily: "SpaceMono-Bold" }}>
              Scanning for NFC Tag...
            </Text>
          </View>
        </View>
      </Modal>

      <Text style={[styles.title, { color: theme.text }]}>Checkout</Text>
      <CheckoutRadio value={mode} onChange={setMode} disabled={isScanning} />

      <View style={styles.toggleRow}>
        <Text style={{ color: theme.text, fontFamily: "SpaceMono-Bold" }}>NFC</Text>
        <Switch value={useQR} onValueChange={setUseQR} disabled={isScanning} />
        <Text style={{ color: theme.text, fontFamily: "SpaceMono-Bold" }}>QR Code</Text>
      </View>

      {SHOW_DEBUG_UID_INPUT && (
        <TextInput
          value={debugUid}
          onChangeText={setDebugUid}
          placeholder="Debug: enter uid to skip scanning"
          placeholderTextColor={theme.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
          style={[
            styles.debugInput,
            {
              color: theme.text,
              borderColor: theme.borderColor,
              backgroundColor: theme.backgroundElement,
            },
          ]}
        />
      )}

      {useQR ? (
        <View style={{ alignItems: "center", marginTop: 20 }}>
          <Text style={[styles.scanLabel, { color: theme.text }]}>
            Scan User QR Code
          </Text>
          {permission?.granted ? (
            <CameraView
              style={styles.camera}
              facing="back"
              onBarcodeScanned={qrScanned ? undefined : onQRScanned}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            />
          ) : (
            <Touchable
              style={styles.permissionBtn}
              onPress={requestPermission}
            >
              <Text style={{ color: theme.text, fontFamily: "SpaceMono-Bold" }}>
                Grant Camera Permission
              </Text>
            </Touchable>
          )}
        </View>
      ) : (
        <Touchable
          style={styles.scanButton}
          onPress={scanNFC}
          disabled={isScanning}
          accessibilityRole="button"
          accessibilityLabel={`Scan badge for ${mode} checkout`}
        >
          <Card>
            <Text style={[styles.scanButtonText, { color: theme.text }]}>
              Scan Badge
            </Text>
          </Card>
        </Touchable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 10 },
  title: {
    fontFamily: "SpaceMono-Bold",
    fontSize: 22,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 15,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },
  scanLabel: { fontFamily: "SpaceMono-Bold", fontSize: 18, marginBottom: 15 },
  camera: { width: "90%", height: 300, borderRadius: 12, overflow: "hidden" },
  permissionBtn: { alignSelf: "center", marginTop: 20, padding: 16 },
  debugInput: {
    marginHorizontal: 15,
    marginTop: 20,
    padding: 12,
    borderWidth: 1.3,
    borderRadius: 12,
    fontFamily: "SpaceMono-Regular",
  },
  scanButton: { alignSelf: "center", marginTop: 20 },
  scanButtonText: {
    fontFamily: "SpaceMono-Bold",
    fontSize: 20,
    alignSelf: "center",
    padding: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
});
