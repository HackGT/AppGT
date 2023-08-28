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
import { AuthContext } from "../../contexts/AuthContext";
import { logInteraction } from "../../api/api";
import { writeNFC, cancelNFC, initNfc } from "../../NFCScanning/nfc";
import BadgeJudge from "../../../assets/images/BadgeJudge.png";
import BadgeMentor from "../../../assets/images/BadgeMentor.png";
import BadgeOrganizer from "../../../assets/images/BadgeOrganizer.png";
import BadgeParticipant from "../../../assets/images/BadgeParticipant.png";
import BadgeSponsor from "../../../assets/images/BadgeSponsor.png";
import BadgeVolunteer from "../../../assets/images/BadgeVolunteer.png";
import Modal from "react-native-modal";
import { Card } from "../../components/Card";

export function CheckInNFC(props) {
  const { application } = props.route.params;
  const { dynamicStyles } = useContext(ThemeContext);
  const { firebaseUser } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(async () => {
    await initNfc();
  }, []);

  const BadgeImage = (props) => {
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
          width: Dimensions.get("window").width - 160,
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
    } else {
      const token = await firebaseUser.getIdToken();
      const interactionResponse = await logInteraction(
        token,
        "check-in",
        application.userId
      );
      if (interactionResponse.status !== 200) {
        console.log(interactionResponse);
        createAlert(
          "There was an issue logging the checkin interaction. However, badge was successfully written to."
        );
      } else {
        props.navigation.goBack();
      }
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
        <TouchableOpacity
          onPress={onPressScan}
          style={styles.writeToBadgeButton}
        >
          <Card>
            <Text
              style={[
                {
                  color: dynamicStyles.toggleText.color,
                },
                styles.writeToBadgeButtonText,
              ]}
            >
              Write to Badge
            </Text>
          </Card>
        </TouchableOpacity>
        <View style={styles.badgeImageWrapper}>
          <BadgeImage
            branch={application.confirmationBranch.applicationGroup}
          />
        </View>
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
  writeToBadgeButton: {
    marginTop: 30,
    marginHorizontal: 15,
  },
  writeToBadgeButtonText: {
    fontFamily: "SpaceMono-Bold",
    fontSize: 20,
    alignSelf: "center",
    padding: 10,
  },
  badgeImageWrapper: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    zIndex: -10000,
  },
});
