import React, { useContext } from "react";
import { TouchableOpacity, Text } from "react-native";
import ButtonBackground from "../../assets/images/ButtonBackground";

export function GradientButton(props) {
  return (
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
  );
}
