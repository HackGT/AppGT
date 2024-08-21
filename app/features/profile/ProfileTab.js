import React, { useContext, useEffect, useState } from "react";

import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { InAppBrowser } from "react-native-inappbrowser-reborn";
import { HackathonContext } from "../../state/hackathon";
import { Card } from "../../components/Card";
import FontMarkdown from "../../components/FontMarkdown";
import { ThemeContext } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContext";
import { getAuth } from "firebase/auth";
import { app } from "../../../firebase";
import QRCode from "react-native-qrcode-svg";
import { CURRENT_HEXATHON, getHexathonUser, getRegistrationApplication } from "../../api/api";

export function ProfileTab() {
  const auth = getAuth(app);
  const { state } = useContext(HackathonContext);
  const { dynamicStyles } = useContext(ThemeContext);
  const { firebaseUser, user } = useContext(AuthContext);
  const [points, setPoints] = useState(0);
  const [showQRCode, setShowQRCode] = useState(false);

  const profilePage = async () => {
    try {
      const result = await InAppBrowser.open(
        "https://login.hexlabs.org/profile",
        {
          ephemeralWebSession: true,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getApplication = async () => {
      try {
        const token = await firebaseUser.getIdToken();
        const { json: data } = await getRegistrationApplication(
          token,
          CURRENT_HEXATHON.id,
          firebaseUser.uid
        );
        if (data?.applications[0].status === "CONFIRMED") {
          setShowQRCode(true);
        }
      } catch (e) {
        console.log(e);
      }
    };

    getApplication();
  }, [firebaseUser]);

  useEffect(() => {
    const getPoints = async () => {
      try {
        const token = await firebaseUser.getIdToken();
        const { json: data } = await getHexathonUser(
          token,
          CURRENT_HEXATHON.id,
          firebaseUser.uid
        );
        setPoints(data.points.currentTotal);
      } catch (e) {
        console.log(e);
      }
    };

    getPoints();
  }, [firebaseUser]);


  const hackathon = state.hackathon;

  const phoneNumber = user.phoneNumber.toString().replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");

  return (
    <ScrollView style={[dynamicStyles.backgroundColor]}>
      <Text style={[dynamicStyles.text, styles.headerText]}>
        {"Profile"}
      </Text>

      {showQRCode && (
        <>
          <Text style={[dynamicStyles.text, styles.checkInText]}>
            You can use this QR code or the one from HexLabs Registration to
            check-in!
          </Text>
          <View
            style={{
              display: "flex",
              alignItems: "center",
              marginVertical: 20,
            }}
          >
            <QRCode
              value={JSON.stringify({ uid: firebaseUser.uid })}
              color={dynamicStyles.text.color}
              size={200}
              backgroundColor="clear"
            />
          </View>
        </>
      )}

      <Text style={[dynamicStyles.text, styles.profileContent]}>Name: {`${user.name.first}${user.name.middle + " " || ""}${user.name.last}`}</Text>
      <Text style={[dynamicStyles.text, styles.profileContent]}>{`Email: ${user.email}`}</Text>
      <Text style={[dynamicStyles.text, styles.profileContent]}>{`Phone Number: ${phoneNumber}`}</Text>
      <Text style={[dynamicStyles.text, styles.profileContent]}>{`Swag Points: ${points}`}</Text>

      <View>
        <TouchableOpacity
          style={[
            styles.logOutButton,
            {
              backgroundColor: "lightred",
              borderColor: dynamicStyles.tintColor.color,
              marginVertical: 20,
            },
          ]}
          onPress={() => {
            auth.signOut();
          }}
        >
          <Text style={[dynamicStyles.text, styles.buttonText]}>
            {"Log Out"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.DangerButton,
            {
              borderColor: dynamicStyles.tintColor.color,
            },
          ]}
          onPress={() => profilePage()}
        >
          <Text style={[dynamicStyles.text, styles.buttonText]}>
            {"Delete Profile"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerButtonContainer: {
    flexDirection: "row",
    alignContent: "center",
    marginHorizontal: 10,
    marginBottom: 10,
    flex: 1,
    justifyContent: "center",
  },

  headerButton: {
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    flex: 0.5,
  },

  faqContainer: {
    marginHorizontal: 15,
  },

  profileContent: {
    fontFamily: "SpaceMono-Bold",
    fontSize: 18,
    marginVertical: 10,
    textAlign: "center",
  },

  faqAnswer: {},

  buttonText: {
    padding: 8,
    textAlign: "center",
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.005,
  },
  headerText: {
    fontFamily: "SpaceMono-Bold",
    fontSize: 22,
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  checkInText: {
    fontFamily: "SpaceMono-Bold",
    marginHorizontal: 15,
  },
  logOutButton: {
    margin: 15,
    borderRadius: 10,
    borderWidth: 1,
    flex: 0.5,
  },
  DangerButton: {
    backgroundColor: "#CB4848",
    margin: 15,
    borderRadius: 10,
    borderWidth: 1,
    flex: 0.5,
  },
});
