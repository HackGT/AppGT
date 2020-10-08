import React, { Component } from "react";

import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { HackathonContext, ThemeContext } from "../context";
import { Card } from "../components/Card";
import { Linking } from "react-native";
import FontMarkdown from "../components/FontMarkdown";

export class InformationTab extends Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <HackathonContext.Consumer>
            {({ faq, hackathon }) => {
              let faqList = [];
              for (i in faq) {
                faqList.push(
                  <FontMarkdown fontFamily="SpaceMono">
                    **{faq[i].question}**
                  </FontMarkdown>,
                  <FontMarkdown fontFamily="SpaceMono">
                    {faq[i].answer}
                  </FontMarkdown>
                );
              }

              return (
                <ScrollView style={[dynamicStyles.backgroundColor]}>
                  <Text style={[dynamicStyles.text, styles.trendingTopics]}>
                    {"Welcome to " + hackathon.name}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "center",
                      marginLeft: 15,
                      marginRight: 15,
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.joinEvent,
                        {
                          borderColor: dynamicStyles.tintColor.color,
                        },
                      ]}
                      onPress={() => Linking.openURL(`https://2020.hack.gt`)}
                    >
                      <Text style={[dynamicStyles.text, styles.buttonText]}>
                        Open Slack
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.joinEvent,
                        {
                          borderColor: dynamicStyles.tintColor.color,
                        },
                      ]}
                      onPress={() => Linking.openURL(`https://2020.hack.gt`)}
                    >
                      <Text style={[dynamicStyles.text, styles.buttonText]}>
                        View Event Site
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={[dynamicStyles.text, styles.trendingTopics]}>
                    Frequently Asked Questions
                  </Text>

                  <View style={{ marginLeft: 15, marginRight: 15 }}>
                    <Card>{faqList}</Card>
                  </View>
                </ScrollView>
              );
            }}
          </HackathonContext.Consumer>
        )}
      </ThemeContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  joinEvent: {
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    flex: 0.5,
  },

  buttonText: {
    padding: 5,
    textAlign: "center",
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.005,
  },

  trendingTopics: {
    fontFamily: "SpaceMono-Bold",
    fontSize: 18,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
  },
});
