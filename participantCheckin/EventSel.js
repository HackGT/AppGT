import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { ThemeContext } from "../context";

export class EventSel extends Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <View style={styles.root} flexDirection="column">
            <Text style={[dynamicStyles.text, styles.textTitle]}>
              {this.props.name}
            </Text>
            <Text style={[dynamicStyles.text, styles.textSubtitle]}>
              {this.props.startTime} - {this.props.endTime}
            </Text>
          </View>
        )}
      </ThemeContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    alignContent: "center",
    borderColor: "black",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10
  },

  textTitle: {
    fontSize: 20,
    marginLeft: 20,
    marginRight: 20,
    textAlign: "center",
    fontFamily: "SpaceMono-Bold",
    letterSpacing: 0.05,
  },

  textSubtitle: {
    marginLeft: 14,
    marginRight: 20,
    fontSize: 18,
    textAlign: "center",
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.05,
  },
});