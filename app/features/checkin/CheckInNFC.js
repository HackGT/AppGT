import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from "react-native";
import { ThemeContext } from "../../contexts/ThemeContext";
import { writeNFC, cancelNFC, initNfc } from "../../NFCScanning/nfc";
import BadgeJudge from "../../../assets/images/BadgeJudge.png";
import BadgeMentor from "../../../assets/images/BadgeMentor.png";
import BadgeOrganizer from "../../../assets/images/BadgeOrganizer.png";
import BadgeParticipant from "../../../assets/images/BadgeParticipant.png";
import BadgeSponsor from "../../../assets/images/BadgeSponsor.png";
import BadgeVolunteer from "../../../assets/images/BadgeVolunteer.png";
import Modal from "react-native-modal";

export function CheckInNFC(props) {
  const { application } = props.route.params;
  const { dynamicStyles } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(async () => {
    await initNfc();
  }, []);

  const TagImage = (props) => {
    let source = null;
    switch (props.branch) {
      case "PARTICIPANT":
        source = BadgeParticipant;
        break;
      case "MENTOR":
        source = BadgeMentor;
        break;
      case "JUDGE":
        source = BadgeJudge;
        break;
      case "ORGANIZER":
        source = BadgeOrganizer;
        break;
      case "SPONSOR":
        source = BadgeSponsor;
        break;
      case "VOLUNTEER":
        source = BadgeVolunteer;
        break;
      default:
        return null;
    }
    if (source === null) return null;
    return (
      <Image
        source={source}
        style={{
          alignSelf: "center",
          width: Dimensions.get("window").width - 80,
          resizeMode: "contain",
        }}
      />
    );
  };

  const createAlert = (message) =>
    Alert.alert("Error", message, [
      {
        text: "OK",
      },
    ]);

  const onPressScan = async () => {
    if (Platform.OS === "android") {
      setModalVisible(true);
    }
    const success = await writeNFC(JSON.stringify({ uid: application.userId }));
    if (Platform.OS === "android") {
      setModalVisible(false);
    }
    if (!success) {
      createAlert("There was an issue writing to the badge. Try again.");
    }
  };

  return (
    <>
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
          <Text>Waiting for NFC Tag...</Text>
        </View>
      </Modal>
      <View
        style={[
          dynamicStyles.backgroundColor,
          {
            flex: 1,
            paddingTop: 40,
            paddingHorizontal: 20,
          },
        ]}
      >
        <Text
          style={{
            color: dynamicStyles.toggleText.color,
            fontFamily: "SpaceMono-Bold",
            fontSize: 16,
          }}
        >
          {"Name: " + application.name}
        </Text>
        <Text
          style={{
            color: dynamicStyles.toggleText.color,
            fontFamily: "SpaceMono-Bold",
            fontSize: 16,
          }}
        >
          {"Email: " + application.email}
        </Text>
        <Text
          style={{
            color: dynamicStyles.toggleText.color,
            fontFamily: "SpaceMono-Bold",
            fontSize: 16,
          }}
        >
          {"User ID: " + application.userId}
        </Text>
        <Text
          style={{
            color: dynamicStyles.toggleText.color,
            fontFamily: "SpaceMono-Bold",
            fontSize: 16,
          }}
        >
          {"Application Group: " +
            application.confirmationBranch.applicationGroup}
        </Text>
        <TouchableOpacity onPress={onPressScan}>
          <Text
            style={{
              color: dynamicStyles.toggleText.color,
              fontFamily: "SpaceMono-Bold",
              fontSize: 20,
              marginTop: 30,
              alignSelf: "center",
            }}
          >
            {"Scan Badge"}
          </Text>
        </TouchableOpacity>
        <TagImage branch={application.confirmationBranch.applicationGroup} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
});
