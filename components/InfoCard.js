import React from "react";
import { View } from "react-native";

import Markdown from 'react-native-markdown-renderer';

import { styleguide } from "../styles";
import { textStyles } from "../components/StyledText";
// TODO better markdown styling - how though? (which element do I style)?
export default InfoCard = ({ content }) => (
  <View style={styleguide.card}>
    <Markdown>{ content }</Markdown>
  </View>
);