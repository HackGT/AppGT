import React, { useState, useEffect, useContext } from "react";

import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-community/async-storage";
import { HackathonContext } from "../../state/hackathon";
import { ScavHuntContext } from "../../state/scavHunt";
import moment from "moment-timezone";
import QRCode from "react-native-qrcode-svg";
import { ThemeContext } from "../../contexts/ThemeContext";

export function ScavengerHuntTab(props) {
  const { state, completeHint } = useContext(ScavHuntContext);
  const { dynamicStyles } = useContext(ThemeContext);
  const hackathonContext = useContext(HackathonContext);
  const hackathon = hackathonContext.state.hackathon;
  const [currentDate, setCurrentDate] = useState(
    Date.parse("2000-01-01T20:30:00.000000-04:00")
  );
  console.log('sdf', hackathon)
  useEffect(() => {
    AsyncStorage.getItem("completedHints", (error, result) => {
      if (result) {
        const r = JSON.parse(result);
        r.forEach((id) => {
          if (!state.completedHints.includes(id)) {
            completeHint(id);
          }
        });
      }
    });
  }, []);

  var scavHunts = hackathon.scavengerHunts.filter(challenge => challenge.isQR );
  scavHunts.sort((item1, item2) => {
    return item1.index - item2.index;
  });
  const crosswordPuzzleChallenges = hackathon.scavengerHunts.filter(challenge => !challenge.isQR );
  const crosswordPuzzleButton = () => {
    return crosswordPuzzleChallenges.length === 0 ? null :
      <TouchableOpacity
        style={[
          styles.joinEvent,
          {
            borderColor: dynamicStyles.tintColor.color,
            backgroundColor: isComplete
              ? "#A4D496"
              : "white"
          },
        ]}
        onPress={() => {
          props.navigation.navigate("ScavHuntCrossword", {
            challenges: crosswordPuzzleChallenges,
            hackathonName: hackathon.name,
          });
        }}
      >
        <Text
          style={[
            dynamicStyles.text,
            styles.buttonHeaderText,
            { color: "black" },
          ]}
        >
          {"Crossword Puzzle"}
        </Text>
      </TouchableOpacity>
  }
  const scavHuntButtons = scavHunts.map((challenge) => {
    if (!challenge.isQR) {
      return null;
    }
    const item = {
      ...challenge,
      releaseDate: Date.parse(challenge.releaseDate),
    };
    const available = true
    const isComplete = state.completedHints.includes(item.id);
    return (
      <TouchableOpacity
        disabled={!available}
        style={[
          styles.joinEvent,
          {
            borderColor: available ? dynamicStyles.tintColor.color : "white",
            backgroundColor: isComplete
              ? "#A4D496"
              : available
              ? "white"
              : "#E0E0E0",
          },
        ]}
        onPress={() => {
          props.navigation.navigate("ScavHuntItem", {
            item: item,
            hackathonName: hackathon.name,
          });
        }}
      >
        {available ? null : (
          <FontAwesomeIcon
            color={"gray"}
            icon={faLock}
            size={12}
            style={{ position: "absolute", margin: 5 }}
          />
        )}
        <Text
          style={[
            dynamicStyles.text,
            styles.buttonHeaderText,
            { color: available ? "black" : "gray" },
          ]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  });

  const currPoints = state.completedHints.reduce((acc, curr) => {
    return acc + (curr.points ? curr.points : 0);
  }, 0);
  const totalPoints = scavHunts.reduce((acc, curr) => {
    return acc + (curr.points ? curr.points : 0);
  }, 0);

  return (
    <ScrollView style={[dynamicStyles.backgroundColor]}>
      <View style={[styles.scavHuntHeaderContainer]}>
        <Text style={[dynamicStyles.text, styles.welcomeHeader]}>
          {"Scavenger Hunt"}
        </Text>
        {totalPoints ? (
          <Text style={[dynamicStyles.text, styles.welcomeHeader]}>
            {currPoints + "/" + totalPoints + " pts"}
          </Text>
        ) : null}
      </View>
      <Text style={[dynamicStyles.text, styles.infoText]}>
        {
          "Scavenger Hunt is a fun way to earn points for completing challenges!"
        }
      </Text>

      <View style={styles.headerButtons}>
        {scavHuntButtons}
        {crosswordPuzzleButton()}
      </View>
    </ScrollView>
  );
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
    letterSpacing: 0.005,
  },

  dateText: {
    padding: 10,
    textAlign: "center",
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.005,
    color: "black",
  },

  joinEvent: {
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    flex: 0.5,
  },

  buttonHeaderText: {
    padding: 10,
    textAlign: "center",
    fontFamily: "SpaceMono-Bold",
    fontSize: 16,
    letterSpacing: 0.005,
  },

  welcomeHeader: {
    fontFamily: "SpaceMono-Bold",
    fontSize: 22,
    marginTop: 34,
    marginBottom: 10,
  },

  scavHuntHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 15,
    flex: 1,
  },
});
