import React, { useState, useEffect, useContext, useRef } from "react";
import { Text, StyleSheet, View, Alert, Dimensions } from "react-native";
import Toggle from "react-native-toggle-element";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import { TouchableOpacity } from "react-native-gesture-handler";
import { request, PERMISSIONS } from "react-native-permissions";
import { logInteraction } from "../../yac";
import { HackathonContext } from "../../state/hackathon";
import { ThemeContext } from "../../contexts/ThemeContext";

function QRScan(props) {
  const { hackathon } = useContext(HackathonContext);
  const { dynamicStyles } = useContext(ThemeContext);
  const [toggleValue, setToggleValue] = useState(false);
  const [uid, setUid] = useState("");
  const [fName, setfName] = useState("");
  const [lName, setlName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(-1);
  const scanner = useRef(null);

  const styles = StyleSheet.create({
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
    },
    buttonTouchable: {
      padding: 16,
    },
  });
  useEffect(() => {
    console.log("235");
    console.log("ID: ", hackathon);
    request(PERMISSIONS.IOS.CAMERA).then((result) => {
      console.log("asdf");
      console.log(result);
    });
  }, []);
  const onSuccess = async (e) => {
    console.log("QR code scanned!", e);
    const json = JSON.parse(e.data);
    if (json.uid) {
      setEmail(json.email);
      setfName(json.name.first);
      setlName(json.name.last);
      setUid(json.uid);
      const res = await logInteraction(
        hackathon.name,
        "event",
        json.uid,
        props.eventID
      );
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
    <View>
      <View style={styles.buttonTouchable}>
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
      {!toggleValue ? (
        <QRCodeScanner
          ref={scanner}
          reactivate={false}
          fadeIn={false}
          showMarker
          markerStyle={{ borderColor: "white", borderWidth: 2 }}
          onRead={onSuccess}
          cameraStyle={{ width: Dimensions.get("window").width - 30 }}
        />
      ) : (
        <Text> test </Text>
      )}
    </View>
  );
}

export default QRScan;
