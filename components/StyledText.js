import React, { Component } from "react";
import {
  StyleSheet,
  Text,
} from "react-native";

import { colors } from "../themes";

// TODO use bold font in markdown
export default StyledText = ({ style, ...other }) => {
  if (!style) return (<Text style={textStyles.themeText} {...other} />);
  const { fontWeight, ...otherStyle } = style;
  if (fontWeight === "bold") return <Text style={{ ...textStyles.boldThemeText, ...otherStyle }} {...other} />;
  return (<Text style={{ ...textStyles.themeText, ...otherStyle }} {...other} />);
}

export const textStyles = StyleSheet.create({
  themeText: {
    color: colors.darkGrayText,
    fontFamily: "SpaceMono-Regular"
  },
  boldThemeText: {
    color: colors.darkGrayText,
    fontFamily: "SpaceMono-Bold",
  }
});