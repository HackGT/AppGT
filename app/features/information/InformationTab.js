import React, { useContext, useEffect, useState } from "react";

import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { InAppBrowser } from "react-native-inappbrowser-reborn";
import { HackathonContext } from "../../state/hackathon";
import { Card } from "../../components/Card";
import { Linking } from "react-native";
import FontMarkdown from "../../components/FontMarkdown";
import { ThemeContext } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContext";
import { getAuth } from "firebase/auth";
import { app } from "../../../firebase";
import QRCode from "react-native-qrcode-svg";
import { CURRENT_HEXATHON, getRegistrationApplication } from "../../api/api";

export function InformationTab() {
  const auth = getAuth(app);
  const { state } = useContext(HackathonContext);
  const { dynamicStyles } = useContext(ThemeContext);
  const { firebaseUser } = useContext(AuthContext);
  const [showQRCode, setShowQRCode] = useState(false);

  const profilePage = async () => {
    try {
      const result = await InAppBrowser.open("https://login.hexlabs.org/profile", {
        ephemeralWebSession: true,
      });
    } catch (error) {
      console.log(error)
    }
  }

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

  const hackathon = state.hackathon;

  // // create button blocks for "Join Slack", "View Event site", etc
  // const buttonBlock = hackathon.blocks.find(
  //   (e) => e.slug && e.slug === "info-button-links"
  // );

  let headerButtons = [];

  // if (buttonBlock && buttonBlock.content) {
  //   const buttonJSON = JSON.parse(buttonBlock.content);
  //   if (buttonJSON) {
  //     headerButtons = buttonJSON.map((button) => {
  //       return (
  //         <TouchableOpacity
  //           key={button.title}
  //           style={[
  //             styles.headerButton,
  //             {
  //               borderColor: dynamicStyles.tintColor.color,
  //             },
  //           ]}
  //           onPress={() => {
  //             Linking.openURL(button.url).catch((err) => {
  //               if (err) {
  //                 if (button.backupURL) {
  //                   Linking.openURL(button.backupURL).catch((err) =>
  //                     Alert.alert(
  //                       "Redirect Error",
  //                       "The link you selected cannot be opened."
  //                     )
  //                   );
  //                 } else {
  //                   Alert.alert(
  //                     "Redirect Error",
  //                     "The link you selected cannot be opened."
  //                   );
  //                 }
  //               }
  //             });
  //           }}
  //         >
  //           <Text style={[dynamicStyles.text, styles.buttonText]}>
  //             {button.title}
  //           </Text>
  //         </TouchableOpacity>
  //       );
  //     });
  //   }
  // }

  // let faqs = [...hackathon.faqs];
  let faqs = hackathon.blocks.find(
    (e) => e.slug && e.display == "mobile" && e.slug === "faq"
  );
  // // sort faq based on priority so important questions come first
  // faqs.sort(function (a, b) {
  //   return parseFloat(a.index) - parseFloat(b.index);
  // });

  // for (i in faqs) {
  //   faqList.push(
  //     <FontMarkdown fontFamily="SpaceMono">
  //       **{faqCopy[i].question}**
  //     </FontMarkdown>,
  //     <FontMarkdown fontFamily="SpaceMono">{faqCopy[i].answer}</FontMarkdown>
  //   );
  // }

  return (
    <ScrollView style={[dynamicStyles.backgroundColor]}>
      <Text style={[dynamicStyles.text, styles.headerText]}>
        {"Welcome to " + hackathon.name}
      </Text>
      <View style={styles.headerButtonContainer}>{headerButtons}</View>

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

      <Text style={[dynamicStyles.text, styles.headerText]}>FAQs</Text>
      <View style={styles.faqContainer}>
        {faqs && faqs.map((faq) => (
          <View key={faq.question}>
            <Text style={[dynamicStyles.text, styles.faqQuestion]}>
              {faq.question}
            </Text>

            <Card>
              <FontMarkdown fontFamily="SpaceMono">{faq.answer}</FontMarkdown>
            </Card>
          </View>
        ))}
      </View>

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
        <Text style={[dynamicStyles.text, styles.buttonText]}>{"Log Out"}</Text>
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
        <Text style={[dynamicStyles.text, styles.buttonText]}>{"Delete Profile"}</Text>
      </TouchableOpacity>
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

  faqQuestion: {
    fontFamily: "SpaceMono-Bold",
    fontSize: 18,
    marginVertical: 10,
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
    backgroundColor: "#FFCCCB",
    margin: 15,
    borderRadius: 10,
    borderWidth: 1,
    flex: 0.5,
  },
});
