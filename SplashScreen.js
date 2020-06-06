import React, { Component } from "react";
import { View, Animated } from "react-native";
import HackGTIcon from "./assets/Logo";

export default class SplashScreen extends Component {
  render() {
    return (
      <Animated.View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          opacity: this.props.opacity.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
          transform: [
            {
              scale: this.props.opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 10],
              }),
            },
          ],
        }}
      >
        <HackGTIcon width={256} height={256} />
      </Animated.View>
    );
  }
}
