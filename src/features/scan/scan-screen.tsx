import { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTheme } from "@/hooks/use-theme";
import { initNfc, cancelNFC, readNFC } from "@/lib/nfc";
import { CheckoutRadio, type CheckoutType } from "./checkout-radio";

export function ScanScreen() {
  const theme = useTheme();
  const [mode, setMode] = useState<CheckoutType>("swag");
  const [isScanning, setIsScanning] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    initNfc();
  }, []);

  const checkoutScanUrl = (uid: string, type: CheckoutType) =>
    `https://live.hexlabs.org/admin/scan?uid=${encodeURIComponent(uid)}&type=${type}`;

  const createAlert = (message: string) =>
    Alert.alert("Error", message, [{ text: "OK" }]);

  const scanNFC = async () => {
    setIsScanning(true);
    if (Platform.OS === "android") setModalVisible(true);
    const { success, data } = await readNFC();
    if (Platform.OS === "android") setModalVisible(false);
    setIsScanning(false);

    if (!success) {
      createAlert(data);
      return;
    }
    let json: any = {};
    try {
      json = JSON.parse(data);
    } catch {}
    if (!json.uid) {
      createAlert(
        "Invalid badge. Please see help desk to register your badge.",
      );
      return;
    }
    await WebBrowser.openBrowserAsync(checkoutScanUrl(json.uid, mode));
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

      <View style={styles.scanArea}>
        <Pressable
          onPress={scanNFC}
          disabled={isScanning}
          accessibilityRole="button"
          accessibilityLabel={`Scan badge for ${mode} checkout`}
          style={({ pressed }) => [
            styles.scanButton,
            {
              backgroundColor: theme.tintColor,
              opacity: isScanning || pressed ? 0.7 : 1,
            },
          ]}
        >
          <FontAwesome5
            name="wifi"
            size={56}
            color="#fff"
            style={styles.icon}
          />
          <Text style={styles.scanText}>
            {isScanning ? "Scanning..." : "Scan Badge"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 10 },
  title: {
    fontFamily: "SpaceMono-Bold",
    fontSize: 22,
    marginHorizontal: 15,
    marginVertical: 15,
  },
  scanArea: { flex: 1, alignItems: "center", justifyContent: "center" },
  scanButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { transform: [{ rotate: "90deg" }], marginBottom: 12 },
  scanText: { fontFamily: "SpaceMono-Bold", fontSize: 20, color: "#fff" },
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
