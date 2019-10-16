import React, { Component } from "react";
import {
  StyleSheet,
  Text,
} from "react-native";

import { colors } from "../themes";

// TODO use bold font as well
// TODO add support for the markdown component
export default StyledText = ({ style, ...other }) => {
  if (!style) return (<Text style={styles.themeText} {...other} />);
  const { fontWeight, ...otherStyle } = style;
  if (fontWeight === "bold") return <Text style={{ ...styles.boldThemeText, ...otherStyle }} {...other} />;
  return (<Text style={{ ...styles.themeText, ...otherStyle }} {...other} />);
}

const styles = StyleSheet.create({
  themeText: {
    color: colors.darkGrayText,
    fontFamily: "SpaceMono-Regular"
  },
  boldThemeText: {
    color: colors.darkGrayText,
    fontFamily: "SpaceMono-Bold",
  }
});