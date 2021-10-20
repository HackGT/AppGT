import React, { Component } from "react";

import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { HackathonContext, ThemeContext } from "../context";
import { Card } from "../components/Card";
import { Linking } from "react-native";
import FontMarkdown from "../components/FontMarkdown";

export class ScavengerHuntTab extends Component {

  render() {
    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <HackathonContext.Consumer>
            {({ hackathon }) => {
              const scavHuntButtons = scavHuntData.items.map(item => {
                return (
                      <TouchableOpacity
                        style={[
                          styles.joinEvent,
                          {
                            borderColor: dynamicStyles.tintColor.color,
                          },
                        ]}
                        onPress={() => {
                          
                        }}
                      >
                        <Text style={[dynamicStyles.text, styles.buttonText]}>
                          {item.title}
                        </Text>
                      </TouchableOpacity>
                    );
              })

              return (
                <ScrollView style={[dynamicStyles.backgroundColor]}>
                  <Text style={[dynamicStyles.text, styles.welcomeHeader]}>
                    {"Scavenger Hunt"}
                  </Text>
                  <Text style={[dynamicStyles.text, styles.infoText]}>
                    {"10 points per correct answer. Go to help desk to redeem your points."}
                  </Text>

                  <View style={styles.headerButtons}>{scavHuntButtons}</View>
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
  headerButtons: {
    flexDirection: "column",
    alignContent: "center",
    marginLeft: 15,
    marginRight: 15,
    flex: 1,
  },

  infoText: {
    padding: 10,
    textAlign: "center",
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.005
  },

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

  welcomeHeader: {
    fontFamily: "SpaceMono-Bold",
    fontSize: 18,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
  },
});

const scavHuntData = {
    items: [
      { 
        title: "Hint 1 Title",
        hint: "Hint 1 description",
        answer: "answer1",
      },
      { 
        title: "Hint 2 Title",
        hint: "Hint 2 description",
        answer: "answer2"
      },
      { 
        title: "Hint 3 Title",
        hint: "Hint 3 description",
        answer: "answer3"
      }
    ]
  }