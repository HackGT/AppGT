import React, { useContext, useRef, useEffect } from "react";
import { View, Text, Alert, Dimensions } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { request, PERMISSIONS } from "react-native-permissions";
import { ThemeContext } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContext";
import { getApplication } from "../../api/registration";
import { useIsFocused } from "@react-navigation/native";

const HEXATHON = {
  id: "62d9ed68d0a69b88c06bdfb2",
  name: "HackGT 9",
};

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

  // Activate scanner whenever we navigate back to the screen
  useEffect(() => {
    if (scanner != null) {
      scanner.current.reactivate();
    }
  }, [scanner, isFocused]);

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

  const onSuccess = async (e) => {
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
      const { data, status } = await getApplication(
        token,
        HEXATHON.id,
        json.uid
      );

      if (status !== 200) {
        createAlert(`Error contacting server: Status ${status}`);
      } else if (data?.applications.length === 0) {
        createAlert(
          "This person never submitted an application to ",
          HEXATHON.name
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
      <View style={{ alignItems: "center", paddingTop: 40 }}>
        <Text
          style={{
            color: dynamicStyles.toggleText.color,
            fontFamily: "SpaceMono-Bold",
            fontSize: 18,
            marginBottom: 15,
          }}
        >
          {"Scan Participant QR Code"}
        </Text>
        <QRCodeScanner
          ref={scanner}
          reactivate={false}
          fadeIn={false}
          showMarker
          markerStyle={{ borderColor: "white", borderWidth: 2 }}
          onRead={onSuccess}
          cameraStyle={{
            width: Dimensions.get("window").width - 30,
            alignSelf: "center",
            overflow: "hidden",
          }}
        />
      </View>
    </View>
  );
}
