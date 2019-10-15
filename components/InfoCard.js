import React from "react";
import { View } from "react-native";

import Markdown from 'react-native-markdown-renderer';

import { styleguide } from "../styles";

// TODO better markdown styling - how though?
export default InfoCard = ({ content }) => (
  <View style={styleguide.card}>
    <Markdown>{ content }</Markdown>
  </View>
);