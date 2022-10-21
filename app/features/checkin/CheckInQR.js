import React, { useContext, useRef, useEffect } from "react";
import { View, Text, Alert, Dimensions, StyleSheet } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { request, PERMISSIONS } from "react-native-permissions";
import { ThemeContext } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContext";
import { getRegistrationApplication, CURRENT_HEXATHON } from "../../api/api";
import { useIsFocused } from "@react-navigation/native";

export function CheckInQR(props) {
  const { dynamicStyles } = useContext(ThemeContext);
  const { firebaseUser } = useContext(AuthContext);
  const scanner = useRef(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    const requestCameraPermission = async () => {
      await request(PERMISSIONS.IOS.CAMERA);
    };

    requestCameraPermission();
  }, []);

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

  const onQRScan = async (e) => {
    let json = {};

    try {
      json = JSON.parse(e.data);
    } finally {
      if (!json.uid) {
        createAlert("Invalid QR Code");
      }
    }

    try {
      const token = await firebaseUser.getIdToken();
      const { status, json: data } = await getRegistrationApplication(
        token,
        CURRENT_HEXATHON.id,
        json.uid
      );

      if (status !== 200) {
        createAlert(`Error contacting server: Status ${status}`);
      } else if (data?.applications.length === 0) {
        createAlert(
          "This person never submitted an application to ",
          CURRENT_HEXATHON.name
        );
      } else if (data?.applications[0].status !== "CONFIRMED") {
        createAlert(
          "This person's application is not confirmed yet. Current status: ",
          data?.applications[0].status
        );
      } else if (!data?.applications[0].confirmationBranch) {
        createAlert("This person does not have a valid confirmation branch");
      } else {
        props.navigation.navigate("CheckInNFC", {
          application: data.applications[0],
        });
      }
    } catch (e) {
      createAlert(e.message);
    }
  };

  return (
    <View style={[dynamicStyles.backgroundColor, { flex: 1 }]}>
      <Text style={[styles.headerHelpText, dynamicStyles.secondaryText]}>
        Use this page to check-in people to {CURRENT_HEXATHON.name}. You'll scan
        their QR code from registration/mobile app and then tap the matching
        event badge to write their data.
      </Text>
      <View style={{ alignItems: "center", marginTop: 50 }}>
        <Text
          style={{
            color: dynamicStyles.toggleText.color,
            fontFamily: "SpaceMono-Bold",
            fontSize: 18,
            marginBottom: 15,
          }}
        >
          Scan User QR Code
        </Text>
        {isFocused && (
          <QRCodeScanner
            ref={scanner}
            reactivate={false}
            fadeIn={false}
            showMarker
            markerStyle={{ borderColor: "white", borderWidth: 2 }}
            onRead={onQRScan}
            cameraStyle={{
              width: Dimensions.get("window").width - 30,
              alignSelf: "center",
              overflow: "hidden",
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerHelpText: {
    marginHorizontal: 15,
    fontFamily: "SpaceMono-Bold",
    marginTop: 10,
  },
});
