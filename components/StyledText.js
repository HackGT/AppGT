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
  let finalStyle = {
    color: colors.darkGrayText,
  };
  if (fontWeight === "bold" && fontStyle === "italic") {
    finalStyle = { ...textStyles.boldThemeText, ...finalStyle }
  } else {
    if (fontWeight === "bold")
      finalStyle = { ...textStyles.boldThemeText, ...finalStyle }
    if (fontStyle === "italic")
      finalStyle = { ...textStyles.italicThemeText, ...finalStyle }
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