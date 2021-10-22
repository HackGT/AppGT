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
import { HackathonContext, ThemeContext, ScavHuntContext } from "../context";
import { fetchServerTime } from "../cms";
import moment from "moment-timezone";
import { scavHuntData } from "./scavenger-hunt-data";

export function ScavengerHuntTab(props) {
  const { state, completeHint } = useContext(ScavHuntContext)
  const [currentDate, setCurrentDate] = useState(Date.parse("2000-01-01T20:30:00.000000-04:00"))
  useEffect(() => {
    AsyncStorage.getItem(
      "completedHints",
      (error, result) => {
        if (result) {
          const r = JSON.parse(result)
          r.forEach(id => {
            if (!state.completedHints.includes(id)) {
              completeHint(id)
            }
          })
        }
      }
    );
  }, [])

  useEffect(() => {
    console.log(props.user)
    const unsubscribe = props.navigation.addListener('focus', () => {
      // The screen is focused
      fetchServerTime().then( timeData => {
        console.log('Got time: ', timeData)
        setCurrentDate(Date.parse(timeData.datetime))
      })
    }, [props.navigation]);
    return unsubscribe
  })

  return (
    <ThemeContext.Consumer>
      {({ dynamicStyles }) => (
        <HackathonContext.Consumer>
          {({ hackathon }) => {
            scavHuntData.items.sort((item1, item2) => {
              return item1.releaseDate - item2.releaseDate
            })
            const scavHuntButtons = scavHuntData.items.map(item => {
              const available = item.releaseDate < currentDate
              const isComplete = state.completedHints.includes(item.id)
              return (
                    <TouchableOpacity
                      disabled={!available}
                      style={[
                        styles.joinEvent,
                        {
                          borderColor: available ? dynamicStyles.tintColor.color : 'white',
                          backgroundColor: isComplete ? '#A4D496' : (available ? 'white' : '#E0E0E0'),
                          
                        },
                      ]}
                      onPress={() => {
                        props.navigation.navigate("ScavHuntItem", {'item': item, 'user': props.user})
                      }}
                    > 
                      {
                        available ? null :
                        <FontAwesomeIcon
                          color={'gray'}
                          icon={faLock}
                          size={12}
                          style={{position: 'absolute', margin: 5}}
                        />
                      }
                      <Text style={[dynamicStyles.text, styles.buttonHeaderText, {color: available ? 'black' : 'gray'}]}>
                        {item.title}
                      </Text>
                      <Text style={[dynamicStyles.text, styles.infoText]}>
                        {"Available " + moment(item.releaseDate).format("MMM D [at] h:mm A")}
                      </Text>
                    </TouchableOpacity>
                  );
            })

            return (
              <ScrollView style={[dynamicStyles.backgroundColor]}>
                <View style={[styles.scavHuntHeaderContainer]}>
                  <Text style={[dynamicStyles.text, styles.welcomeHeader]}>
                    {"Scavenger Hunt"}
                  </Text>
                  <Text style={[dynamicStyles.text, styles.welcomeHeader]}>
                    {(state.completedHints.length * scavHuntData.pointsPer) + "/" + (scavHuntData.pointsPer && scavHuntData.items ? scavHuntData.pointsPer * scavHuntData.items.length : 0) + " pts"}
                  </Text>
                </View>
                <Text style={[dynamicStyles.text, styles.infoText]}>
                  {(scavHuntData.pointsPer ? scavHuntData.pointsPer : 5) + " points per correct answer. Go to help desk to redeem your points."}
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
    justifyContent: 'space-between',
    marginHorizontal: 15,
    flex: 1
  }
});
