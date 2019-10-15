import React from "react";
import { Text, View } from "react-native";
import { styleguide } from "../styles";

// TODO render markdown
export default InfoCard = ({ content }) => (
  <View style={styleguide.card}>
    <Text>Hello</Text>
    <Text>{ content }</Text>
  </View>
);