import React, { useContext } from "react";

import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { HackathonContext } from "../../state/hackathon";
import { Card } from "../../components/Card";
import { Linking } from "react-native";
import FontMarkdown from "../../components/FontMarkdown";
import { ThemeContext } from "../../contexts/ThemeContext";
import { getAuth } from "firebase/auth";
import { app } from "../../../firebase";

export function InformationTab(props) {
  const auth = getAuth(app);
  const { state } = useContext(HackathonContext);
  const { dynamicStyles } = useContext(ThemeContext);
  const hackathon = state.hackathon;

  // create button blocks for "Join Slack", "View Event site", etc
  const buttonBlock = hackathon.blocks.find(
    (e) => e.slug && e.slug === "info-button-links"
  );

  const faqBlock = hackathon.blocks.find(
    (e) => e.slug && e.slug === "info-faq"
  );

  const headerButtons = [];

  if (buttonBlock && buttonBlock.content) {
    const buttonJSON = JSON.parse(buttonBlock.content);
    if (buttonJSON) {
      headerButtons = buttonJSON.map((button) => {
        return (
          <TouchableOpacity
            style={[
              styles.button,
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

  let infoBlocks = hackathon.blocks.filter(
    (e) => e.slug && e.slug === "info-faq"
  );

  // let faqCopy = [...hackathon.faqs];
  // let faqList = [];
  // // sort faq based on priority so important questions come first
  // faqCopy.sort(function (a, b) {
  //   return parseFloat(a.index) - parseFloat(b.index);
  // });

  // for (i in faqCopy) {
  //   faqList.push(
  //     <FontMarkdown fontFamily="SpaceMono">
  //       **{faqCopy[i].question}**
  //     </FontMarkdown>,
  //     <FontMarkdown fontFamily="SpaceMono">
  //       {faqCopy[i].answer}
  //     </FontMarkdown>
  //   );
  // }

  return (
    <ScrollView style={[dynamicStyles.backgroundColor]}>
      <Text style={[dynamicStyles.text, styles.welcomeHeader]}>
        {"Welcome to " + hackathon.name}
      </Text>

      <View style={styles.headerButtons}>{headerButtons}</View>
      {infoBlocks.map((block, i) => (
        <View key={i}>
          <Text style={[dynamicStyles.text, styles.welcomeHeader]}>
            {block.name}
          </Text>

          <View style={styles.faqList}>
            <Card>
              <FontMarkdown fontFamily="SpaceMono">
                {block.content}
              </FontMarkdown>
            </Card>
          </View>
        </View>
      ))}
      <TouchableOpacity
        style={[
          styles.button,
          {
            borderColor: dynamicStyles.tintColor.color,
            marginVertical: 20,
          },
        ]}
        onPress={() => {
          AsyncStorage.clear()
          auth.signOut();
        }}
      >
        <Text style={[dynamicStyles.text, styles.buttonText]}>{"Log Out"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: "row",
    alignContent: "center",
    marginLeft: 15,
    marginRight: 15,
    flex: 1,
  },

  faqList: {
    marginLeft: 15,
    marginRight: 15,
  },

  button: {
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    flex: 0.5,
    marginHorizontal: 15,
  },
  buttonText: {
    padding: 8,
    textAlign: "center",
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.005,
  },
  welcomeHeader: {
    fontFamily: "SpaceMono-Bold",
    fontSize: 18,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
  },
});
