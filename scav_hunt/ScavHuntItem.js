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
    return (
      <View/>
    )
  }
}