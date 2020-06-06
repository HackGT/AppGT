import React, { Component } from "react";
import { View, Animated, Easing } from "react-native";
import HackGTIcon from "./assets/Logo";

export default class SplashScreen extends Component {
  state = {
    opacity: new Animated.Value(0),
  };

  componentDidMount() {
    if (this.props.grow) {
      Animated.timing(this.state.opacity, {
        toValue: 0.02,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.in(Easing.bounce),
      }).start(() => {
        Animated.timing(this.state.opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.ease,
        }).start(() => this.props.onGrowDone());
      });
    }
  }

  render() {
    return (
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
          opacity: this.props.grow
            ? this.state.opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              })
            : 1,
          transform: [
            {
              scale: this.props.grow
                ? this.state.opacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 20],
                  })
                : 1,
            },
          ],
        }}
      >
        <HackGTIcon width={256} height={256} />
      </Animated.View>
    );
  }
}
