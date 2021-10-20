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
import { fetchServerTime } from "../cms";
import moment from "moment-timezone";
import { scavHuntData } from "./scavenger-hunt-data";

export class ScavHuntItem extends Component {
  render() {
    const item = this.props.route.params.item
    console.log('item props: ', this.props)
    const completed = () => {
      if (this.props.isComplete) {
        return (
          <View style={{flexDirection:'row'}}>
            <Text>{'Completed!'}</Text>
          </View>
        )
      }
    }


    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{flexDirection: 'column', paddingTop: 34, paddingHorizontal: 32}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.titleText]}>{item.title}</Text>
            {
              completed()
            }
          </View>
          <Text style={[styles.hintText]}>{item.hint}</Text>
          <TouchableOpacity style={[styles.answerButton]}>
            <Text style={[styles.answerButtonText]}>{'Input Answer'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  answerButton: {
    marginTop: 32,
    backgroundColor: '#5DBCD2',
    alignItems: 'center',
    borderRadius: 10
  },

  answerButtonText: {
    padding: 17,
    fontFamily: 'SpaceMono-Bold',
    color: 'white'
  },

  hintText: {
    paddingTop: 4,
    textAlign: "left",
    fontFamily: "SpaceMono-Regular",
    fontSize: 16,
    letterSpacing: 0.005
  },

  joinEvent: {
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    flex: 0.5,
  },

  titleText: {
    paddingTop: 5,
    textAlign: "center",
    fontFamily: "SpaceMono-Bold",
    fontSize: 24,
    letterSpacing: 0.005,
  },

  welcomeHeader: {
    fontFamily: "SpaceMono-Bold",
    fontSize: 22,
    marginTop: 10,
    marginBottom: 10,    
  },

  scavHuntHeaderContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
    marginHorizontal: 15,
    flex: 1
  }
});