import React, { useContext, useEffect, useState } from "react";

import {
  View,
  StyleSheet,
  Linking,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { InAppBrowser } from "react-native-inappbrowser-reborn";
import { HackathonContext } from "../../state/hackathon";
import { Card } from "../../components/Card";
import FontMarkdown from "../../components/FontMarkdown";
import { ThemeContext } from "../../contexts/ThemeContext";
import { CURRENT_HEXATHON, getRegistrationApplication } from "../../api/api";

export function InformationTab() {
  const { state } = useContext(HackathonContext);
  const { dynamicStyles } = useContext(ThemeContext);

  const hackathon = state.hackathon;

  // // create button blocks for "Join Slack", "View Event site", etc
  const buttonBlock = hackathon.blocks.find(
    (e) => e.display == "mobile" && e.slug && e.slug === "info-button-links"
  );

  let headerButtons = [];

  if (buttonBlock && buttonBlock.content) {
    const buttonJSON = JSON.parse(buttonBlock.content);
    if (buttonJSON) {
      headerButtons = buttonJSON.map((button) => {
        return (
          <TouchableOpacity
            key={button.title}
            style={[
              styles.headerButton,
              {
                borderColor: dynamicStyles.tintColor.color,
              },
            ]}
            onPress={() => {
              Linking.openURL(button.url).catch((err) => {
                if (err) {
                  if (button.backupURL) {
                    Linking.openURL(button.backupURL).catch((err) =>
                      Alert.alert(
                        "Redirect Error",
                        "The link you selected cannot be opened."
                      )
                    );
                  } else {
                    Alert.alert(
                      "Redirect Error",
                      "The link you selected cannot be opened."
                    );
                  }
                }
              });
            }}
          >
            <Text style={[dynamicStyles.text, styles.buttonText]}>
              {button.title}
            </Text>
          </TouchableOpacity>
        );
      });
    }
  }

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
      <Text style={[dynamicStyles.text, styles.checkInText]}>
        {
          hackathon.blocks.find(
            (e) => e.slug && e.display == "mobile" && e.slug === "info-welcome"
          )?.content || ""
        }
      </Text>
      <View style={styles.headerButtonContainer}>{headerButtons}</View>

      <Text style={[dynamicStyles.text, styles.headerText]}>FAQs</Text>
      <View style={styles.faqContainer}>
        {faqs &&
          faqs.map((faq) => (
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
    backgroundColor: "#CB4848",
    margin: 15,
    borderRadius: 10,
    borderWidth: 1,
    flex: 0.5,
  },
});
