import React, { useEffect, useContext } from "react";
import { Animated, Easing } from "react-native";
import HackGTIcon from "../../assets/images/Logo";
import { ThemeContext } from "../contexts/ThemeContext";

export default function SplashScreen(props) {
  const { dynamicStyles } = useContext(ThemeContext);
  const opacity = new Animated.Value(0);

  const growAnimation = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start(() => props.onGrowDone());
    props.onGrowDone();
  };

  useEffect(() => {
    if (props.grow) {
      growAnimation();
    } else {
      if (props.onGrowDone) {
        props.onGrowDone();
      }
    }
  }, []);

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          opacity: props.grow
            ? opacity.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              })
            : 1,
        },
        dynamicStyles.backgroundColor,
      ]}
    >
      <HackGTIcon width={256} height={256} />
    </Animated.View>
  );
}
