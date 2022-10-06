import React, { useContext, useRef, useEffect } from "react";
import { View, Text, Alert, Dimensions } from "react-native";
// import QRCodeScanner from "react-native-qrcode-scanner";
import { request, PERMISSIONS } from "react-native-permissions";
import { ThemeContext } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContext";
import { HackathonContext } from "../../state/hackathon";
import { getApplication } from "../../api/registration";
import QRCodeScanner from "../../components/QRCodeScanner";

export function CheckInQR(props) {
  const { dynamicStyles } = useContext(ThemeContext);
  const { firebaseUser } = useContext(AuthContext);
  const { state } = useContext(HackathonContext);
  const hackathon = state.hackathon;
  const scanner = useRef(null);

  useEffect(() => {
    request(PERMISSIONS.IOS.CAMERA).then((result) => {
      console.log(result);
    });
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

  const onSuccess = async (e) => {
    const json = JSON.parse(e.data);
    if (json.uid) {
      const token = await firebaseUser.getIdToken();
      const res = await getApplication(token, hackathon.id, json.uid);
      if (res.status !== 200) {
        createAlert(res.message);
      } else if (res.json.applications.length === 0) {
        createAlert(
          "This person never submitted an application to ",
          hackathon.name
        );
      } else if (res.json.applications[0].status !== "CONFIRMED") {
        createAlert(
          "This person's application is not confirmed yet. Current status: ",
          res.json.applications[0].status
        );
      } else {
        props.navigation.navigate("CheckInQR", { application: res.json });
      }
    } else {
      createAlert("Invalid QR Code");
    }
  };

  return (
    <View style={[dynamicStyles.backgroundColor, { flex: 1 }]}>
      <View style={{ alignItems: "center", paddingTop: 40 }}>
        <Text
          style={{
            color: dynamicStyles.toggleText.color,
            fontFamily: "SpaceMono-Bold",
            fontSize: 20,
          }}
        >
          {"Scan Participant QR Code"}
        </Text>
        <QRCodeScanner />
        {/* <QRCodeScanner
          ref={scanner}
          reactivate={false}
          fadeIn={false}
          showMarker
          markerStyle={{ borderColor: "white", borderWidth: 2 }}
          onRead={onSuccess}
          cameraStyle={{
            width: Dimensions.get("window").width - 30,
            alignSelf: "center",
          }}
        /> */}
      </View>
    </View>
  );
}
