import React, { useState, useEffect, useContext, useRef } from "react";
import { Text, StyleSheet, View, Alert, Dimensions } from "react-native";
import Toggle from "react-native-toggle-element";
import QRCodeScanner from "react-native-qrcode-scanner";
import { TouchableOpacity } from "react-native-gesture-handler";
import { request, PERMISSIONS } from "react-native-permissions";

import { logInteraction } from "../../yac";
import { HackathonContext } from "../../state/hackathon";
import { ThemeContext } from "../../contexts/ThemeContext";
import { initNfc, readNFC, writeNFC } from "../../NFCScanning/nfc";
import { AuthContext } from "../../contexts/AuthContext";

export function ScanScreen(props) {
  const { state } = useContext(HackathonContext);
  const hackathon = state.hackathon;
  const { dynamicStyles } = useContext(ThemeContext);
  const { fetchProfile, firebaseUser } = useContext(AuthContext);
  const [toggleValue, setToggleValue] = useState(false);
  const [uid, setUid] = useState("");
  const [fName, setfName] = useState("");
  const [lName, setlName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(-1);
  const scanner = useRef(null);

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
    buttonText: {
      fontSize: 21,
      color: dynamicStyles.toggleText.color,
      fontFamily: "SpaceMono-Bold",
    },
    infoContainer: {
      padding: 16,
    },
    button: {
      alignSelf: "center",
    },
  });
  useEffect(() => {
    request(PERMISSIONS.IOS.CAMERA).then((result) => {
      console.log(result);
    });
  }, []);

  useEffect(async () => {
    const cleanUp = await initNfc((scannedText) => {
      onScan(scannedText);
    });

    return () => cleanUp();
  }, []);

  // NFC
  const onScan = async (text) => {
    const json = JSON.parse(text);
    if (json.uid) {
      const res = await interact(json.uid);
      setStatus(res.status);
      if (res.status !== 200) {
        createAlert(res.json.message);
      } else {
        // reactivates reading on success to make the proccess of scanning many people faster
        scanNFC();
      }
    } else {
      createAlert("Invalid Badge");
    }
  };

  //QR
  const onSuccess = async (e) => {
    console.log("QR code scanned!", e);
    const json = JSON.parse(e.data);
    if (json.uid) {
      const res = await interact(json.uid);
      setStatus(res.status);
      console.log("RES: ", res);
      if (res.status !== 200) {
        createAlert(res.json.message);
      } else {
        setTimeout(() => {
          if (scanner && scanner.current) {
            scanner.current.reactivate();
          }
        }, 2000);
      }
    } else {
      createAlert("Invalid QR Code");
    }
  };

  const interact = async (uid) => {
    setUid(uid);
    const res = await logInteraction(
      hackathon.name,
      "event",
      uid,
      props.eventID
    );
    const { json, status } = await fetchProfile(uid, firebaseUser);
    if (status !== 200) console.log("fetchProfile: ", status);
    setfName(json.name.first);
    setlName(json.name.last);
    setEmail(json.email);
    return res;
  };

  const scanNFC = async () => {
    await readNFC();
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
                  ? "white"
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
                QR Code
              </Text>
            }
            rightComponent={
              <Text
                style={{
                  color: dynamicStyles.toggleText.color,
                  fontFamily: "SpaceMono-Bold",
                }}
              >
                NFC
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
          />
        </View>
      </View>
      {toggleValue ? (
        <>
          <TouchableOpacity style={styles.button} onPress={scanNFC}>
            <Text style={styles.buttonText}>{"Scan"}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <QRCodeScanner
          ref={scanner}
          reactivate={false}
          fadeIn={false}
          showMarker
          markerStyle={{ borderColor: "white", borderWidth: 2 }}
          onRead={onSuccess}
          cameraStyle={{ width: Dimensions.get("window").width - 30 }}
        />
      )}
    </View>
  );
}
