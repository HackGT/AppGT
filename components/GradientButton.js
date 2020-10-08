import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { ThemeContext } from "../context";
import ButtonBackground from "../assets/ButtonBackground";

export class GradientButton extends Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <TouchableOpacity
            style={{
              justifyContent: "center",
            }}
            onPress={this.props.onPress}
          >
            <ButtonBackground />
            <Text
              style={{
                position: "absolute",
                textAlign: "center",
                color: "white",
                left: 0,
                right: 0,
                fontSize: 18,
                fontFamily: "SpaceMono-Regular",
              }}
            >
              {this.props.text}
            </Text>
          </TouchableOpacity>
        )}
      </ThemeContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  cardParent: {
    width: "100%",
    borderRadius: 8,
  },
});
