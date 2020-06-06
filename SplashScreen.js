import React, { Component } from "react";
import { View, Text } from "react-native";
import HackGTIcon from "./assets/Logo";

export default class SplashScreen extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <HackGTIcon width={256} height={256} />
      </View>
    );
  }
}
