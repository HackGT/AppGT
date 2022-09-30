import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { ThemeContext } from "../contexts/ThemeContext";
import ButtonBackground from "../../assets/images/ButtonBackground";

export function GradientButton(props) {
  return (
    <ThemeContext.Consumer>
      {({ dynamicStyles }) => (
        <TouchableOpacity
          style={{
            justifyContent: "center",
          }}
          onPress={props.onPress}
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
              letterSpacing: 0.005,
            }}
          >
            {props.text}
          </Text>
        </TouchableOpacity>
      )}
    </ThemeContext.Consumer>
  );
}

const styles = StyleSheet.create({
  cardParent: {
    width: "100%",
    borderRadius: 8,
  },
});
