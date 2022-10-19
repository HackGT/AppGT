import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Text,
  StyleSheet,
  View,
  Alert,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import Toggle from "react-native-toggle-element";
import QRCodeScanner from "react-native-qrcode-scanner";
import { TouchableOpacity } from "react-native-gesture-handler";
import { request, PERMISSIONS } from "react-native-permissions";
import Modal from "react-native-modal";

import { logInteraction, getUserProfile } from "../../api/api";
import { ThemeContext } from "../../contexts/ThemeContext";
import { cancelNFC, initNfc, readNFC } from "../../NFCScanning/nfc";
import { AuthContext } from "../../contexts/AuthContext";

export function ScanScreen(props) {
  const { dynamicStyles } = useContext(ThemeContext);
  const { firebaseUser } = useContext(AuthContext);
  const [toggleValue, setToggleValue] = useState(false);
  const [uid, setUid] = useState("");
  const [fName, setfName] = useState("");
  const [lName, setlName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(-1);
  const [isScanning, setIsScanning] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const scanner = useRef(null);

  useEffect(() => {
    request(PERMISSIONS.IOS.CAMERA).then((result) => {
      console.log(result);
    });
  }, []);

  useEffect(async () => {
    await initNfc();
  }, []);

  // NFC
  const onNFCTagScanned = async (text) => {
    let json = {};
    try {
      json = JSON.parse(text);
    } finally {
      if (!json.uid) {
        createAlert("Invalid badge");
        return;
      }
    }

    setUid(json.uid);
    const success = await getProfileAndLogInteraction(json.uid);
    if (success) {
      // Reactivates reading on success to make the proccess of scanning many people faster
      setTimeout(() => {
        scanNFC();
      }, 1000);
    }
  };

  // QR
  const onQRCodeScanned = async (e) => {
    console.log("QR code scanned:", e.data);
    let json = {};
    try {
      json = JSON.parse(e.data);
    } finally {
      if (!json.uid) {
        createAlert("Invalid QR Code");
        return;
      }
    }

    setUid(json.uid);
    const success = await getProfileAndLogInteraction(json.uid);
    if (success) {
      // Reactivates reading on success to make the proccess of scanning many people faster
      setTimeout(() => {
        if (scanner && scanner.current) {
          scanner.current.reactivate();
        }
      }, 2000);
    }
  };

  const getProfileAndLogInteraction = async (uid) => {
    const token = await firebaseUser.getIdToken();
    const userProfileResponse = await getUserProfile(token, uid);
    if (userProfileResponse.status !== 200) {
      setStatus(userProfileResponse.status);
      createAlert(userProfileResponse.json.message);
      return false;
    }

    setfName(userProfileResponse.json.name.first);
    setlName(userProfileResponse.json.name.last);
    setEmail(userProfileResponse.json.email);

    const interactionResponse = await logInteraction(
      token,
      "event",
      uid,
      props.eventID
    );
    setStatus(interactionResponse.status);

    if (interactionResponse.status !== 200) {
      createAlert(interactionResponse.json.message);
      return false;
    }

    return true;
  };

  const scanNFC = async () => {
    setIsScanning(true);
    if (Platform.OS === "android") {
      setModalVisible(true);
    }
    const { success, data } = await readNFC();
    if (success) {
      await onNFCTagScanned(data);
    }

    if (Platform.OS === "android") {
      setModalVisible(false);
    }
    setIsScanning(false);
  };

  const createAlert = (message) =>
    Alert.alert("Error", message, [
      {
        text: "OK",
        onPress: () => {
          if (scanner && scanner.current) {
            scanner.current.reactivate();
          }
        },
      },
    ]);

  return (
    <View style={styles.container}>
      <Modal
        isVisible={modalVisible}
        onBackButtonPress={async () => {
          if (Platform.OS === "android") {
            await cancelNFC();
          }
        }}
      >
        <View style={styles.modalContent}>
          <ActivityIndicator
            size="large"
            color="#5dbb63"
            style={{ marginBottom: 20 }}
          />
          <Text>Scanning for NFC Tag...</Text>
        </View>
      </Modal>
      <View style={styles.infoContainer}>
        <Text
          style={[
            styles.centerText,
            {
              fontWeight: "bold",
              fontSize: 16,
              color:
                status === 200
                  ? "#5dbb63"
                  : status === -1
                  ? dynamicStyles.text.color
                  : "#d74040",
            },
          ]}
        >
          {status === 200
            ? "Success!"
            : status === -1
            ? "Scan to get started!"
            : "Try again!"}
        </Text>
        <Text style={styles.centerText}>{"Name: " + fName + " " + lName}</Text>
        <Text style={styles.centerText}>{"Email: " + email}</Text>
        <Text style={styles.centerText}>{"ID: " + uid}</Text>
        <View style={{ marginTop: 5, alignItems: "center" }}>
          <Toggle
            value={toggleValue}
            onPress={setToggleValue}
            leftComponent={
              <Text
                style={{
                  color: dynamicStyles.toggleText.color,
                  fontFamily: "SpaceMono-Bold",
                }}
              >
                NFC
              </Text>
            }
            rightComponent={
              <Text
                style={{
                  color: dynamicStyles.toggleText.color,
                  fontFamily: "SpaceMono-Bold",
                }}
              >
                QR Code
              </Text>
            }
            trackBar={{
              width: 200,
              activeBackgroundColor: dynamicStyles.trackBarBackground.color,
              inActiveBackgroundColor: dynamicStyles.trackBarBackground.color,
              borderActiveColor: dynamicStyles.trackBarBackground.color,
              borderInActiveColor: dynamicStyles.trackBarBackground.color,
              borderWidth: 3,
            }}
            thumbButton={{
              width: 100,
              activeBackgroundColor:
                dynamicStyles.toggleThumbBackgroundColor.color,
              inActiveBackgroundColor:
                dynamicStyles.toggleThumbBackgroundColor.color,
            }}
            animationDuration={200}
          />
        </View>
      </View>
      {toggleValue ? (
        <QRCodeScanner
          ref={scanner}
          reactivate={false}
          fadeIn={false}
          showMarker
          markerStyle={{ borderColor: "white", borderWidth: 2 }}
          onRead={onQRCodeScanned}
          cameraStyle={{
            width: Dimensions.get("window").width - 30,
            overflow: "hidden",
          }}
        />
      ) : (
        <TouchableOpacity
          style={styles.scanButton}
          onPress={scanNFC}
          disabled={isScanning}
        >
          <Text
            style={[
              styles.scanButtonText,
              { color: dynamicStyles.toggleText.color },
            ]}
          >
            Press to Scan Badge
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  centerText: {
    flex: 1,
    fontSize: 14,
    padding: 4,
    color: "#777",
    fontFamily: "SpaceMono-Bold",
  },
  textBold: {
    fontWeight: "500",
    color: "#000",
  },
  scanButtonText: {
    fontSize: 20,
    fontFamily: "SpaceMono-Bold",
  },
  infoContainer: {
    padding: 16,
    display: "flex",
  },
  scanButton: {
    alignSelf: "center",
    marginTop: 20,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
});
