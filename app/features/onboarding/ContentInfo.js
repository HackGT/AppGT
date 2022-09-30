import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import Logo from "../../../assets/images/Logo";
import { ThemeContext } from "../../state/context";

export function ContentInfo(props) {
  return (
    <ThemeContext.Consumer>
      {({ dynamicStyles }) => (
        <View style={styles.root} flexDirection="column">
          {props.image ? props.image : <Logo />}
          <Text style={[dynamicStyles.text, styles.textTitle]}>
            {props.title}
          </Text>
          {props.subtitles.map((subtitle, i) => (
            <Text key={i} style={[dynamicStyles.text, styles.textSubtitle]}>
              {subtitle}
            </Text>
          ))}
          {props.button ? props.button : null}
        </View>
      )}
    </ThemeContext.Consumer>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    alignContent: "center",
  },

  titleImage: {
    width: 200,
    height: 200,
  },

  textTitle: {
    marginTop: 32,
    fontSize: 24,
    marginLeft: 20,
    marginRight: 20,
    textAlign: "center",
    fontFamily: "SpaceMono-Bold",
    letterSpacing: 0.05,
  },

  textSubtitle: {
    marginTop: 12,
    marginLeft: 20,
    marginRight: 20,
    fontSize: 18,
    textAlign: "center",
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.05,
  },
});
