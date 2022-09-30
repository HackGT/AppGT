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
import { HackathonContext, ScavHuntContext } from "../../state/context";
import { fetchServerTime } from "../../cms";
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

  useEffect(() => {
    console.log(props.user);
    const unsubscribe = props.navigation.addListener(
      "focus",
      () => {
        // The screen is focused
        fetchServerTime().then((timeData) => {
          console.log("Got time: ", timeData);
          setCurrentDate(Date.parse(timeData.datetime));
        });
      },
      [props.navigation]
    );
    return unsubscribe;
  });

  var scavHunts = hackathon.scavengerHunts;
  scavHunts.sort((item1, item2) => {
    const d1 = Date.parse(item1.releaseDate);
    const d2 = Date.parse(item2.releaseDate);
    return d1 - d2;
  });
  const crosswordPuzzleChallenges = scavHunts.filter((challenge) => {
    !challenge.isQR;
  });
  console.log(scavHunts);
  var crosswordPuzzleButton = null;

  if (crosswordPuzzleChallenges.length == 0) {
    const available = true;
    const isComplete = false;
    crosswordPuzzleButton = () => (
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
          props.navigation.navigate("ScavHuntCrossword", {
            challenges: crosswordPuzzleChallenges,
            user: props.user,
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
          {"Crossword Puzzle"}
        </Text>
      </TouchableOpacity>
    );
  }
  const scavHuntButtons = scavHunts.map((challenge) => {
    if (!challenge.isQR) {
      return null;
    }
    const item = {
      ...challenge,
      releaseDate: Date.parse(challenge.releaseDate),
    };
    const available = new Date(item.releaseDate) < currentDate;
    const isComplete = state.completedHints.includes(item.id);
    console.log(
      "Scav Hunt info: \nRelease date",
      new Date(item.releaseDate),
      "current date: ",
      currentDate,
      "available: ",
      available,
      "isComplete: ",
      isComplete
    );
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
            user: props.user,
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
        <Text style={[dynamicStyles.text, styles.dateText]}>
          {"Available " + moment(item.releaseDate).format("MMM D [at] h:mm A")}
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
    paddingTop: 5,
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
