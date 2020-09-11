import React, { Component } from "react";
import { View, Animated, Easing } from "react-native";
import HackGTIcon from "../assets/Logo";
import { ThemeContext } from "../context";

export default class SplashScreen extends Component {
  state = {
    opacity: new Animated.Value(0),
  };

  growAnimation = () => {
    // Animated.timing(this.state.opacity, {
    //   toValue: 1,
    //   duration: 500,
    //   useNativeDriver: true,
    //   easing: Easing.ease,
    // }).start(() => this.props.onGrowDone());
    this.props.onGrowDone();
  };

  componentDidMount() {
    if (this.props.grow) {
      this.growAnimation();
    }
  }

  render() {
    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <Animated.View
            style={[
              {
                flex: 1,
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
              },
              dynamicStyles.backgroundColor,
            ]}
          >
            <HackGTIcon width={256} height={256} />
          </Animated.View>
        )}
      </ThemeContext.Consumer>
    );
  }
}
