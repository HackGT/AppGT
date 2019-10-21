import React, { Component } from "react";
import {
  StyleSheet,
  Text,
} from "react-native";

import { colors } from "../themes";

// TODO use bold font in markdown
// TODO re-add basic styles in case not bold / italic (else cases)
export default StyledText = ({ style, ...other }) => {
  if (!style) return (<Text style={textStyles.themeText} {...other} />);
  const { fontWeight, fontStyle, ...otherStyle } = style;
  let finalStyle = textStyles.themeText;
  if (fontWeight === "bold" && fontStyle === "italic") {
    finalStyle = { ...finalStyle, ...textStyles.bothText }
  } else {
    if (fontWeight === "bold")
      finalStyle = { ...finalStyle, ...textStyles.boldThemeText }
    if (fontStyle === "italic")
      finalStyle = {  ...finalStyle, ...textStyles.italicThemeText }
  }
  return <Text style={{ ...finalStyle, ...otherStyle }} {...other} />;
}

export const textStyles = StyleSheet.create({
  themeText: {
    color: colors.darkGrayText,
    fontFamily: "SpaceMono-Regular"
  },
  boldThemeText: {
    fontFamily: "SpaceMono-Bold",
  },
  italicThemeText: {
    fontFamily: "SpaceMono-Italic",
  },
  bothText: {
    fontFamily: "SpaceMono-BoldItalic"
  }
});