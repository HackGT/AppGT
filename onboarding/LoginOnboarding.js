import React, { Component } from "react";
import { Dimensions } from "react-native";
import { Text, ScrollView, View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import ButtonBackground from "../assets/ButtonBackground";
import { TouchableOpacity } from "react-native-gesture-handler";

export class LoginOnboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0,
      pageCount: 4,
    };
  }

  createScreens(width, contents) {
    const screens = [
      this.firstScreen(),
      this.secondScreen(),
      this.thirdScreen(),
      this.fourthScreen(),
    ];

    return screens.map((content) => {
      return (
        <View
          style={{
            backgroundColor: "white",
            flex: 1,
            width: width,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {content}
        </View>
      );
    });
  }

  // to add a new screen, make a function return that screen's contents and add it to the array
  firstScreen() {
    return <Text>HackGT Logo</Text>;
  }

  secondScreen() {
    return <Text>Personalize your event schedule</Text>;
  }

  thirdScreen() {
    return <Text>Checkout Hardware</Text>;
  }

  fourthScreen() {
    return <Text>Explore our event with Scavenger Hunt</Text>;
  }

  // render the dots indicating which page user is on
  indexIndicator() {
    const radius = 4;
    const size = radius * 2;
    const bubbles = [0, 1, 2, 3].map((i) => {
      return (
        <Svg height={size + 14} width={size + 14}>
          <Circle
            cx={radius}
            cy={radius}
            r={radius}
            fill={i == this.state.pageIndex ? "#41D1FF" : "#F2F2F2"}
          />
        </Svg>
      );
    });

    return (
      <View style={{ backgroundColor: "white" }} flexDirection="row">
        {bubbles}
      </View>
    );
  }

  render() {
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;

    return (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          onMomentumScrollEnd={(scrollData) =>
            // update page indicator
            this.setState({
              pageIndex: scrollData.nativeEvent.contentOffset.x / screenWidth,
            })
          }
        >
          {this.createScreens(screenWidth)}
        </ScrollView>

        <View
          style={{
            alignItems: "center",
            alignContent: "center",
            backgroundColor: "white",
          }}
          flex={0.2}
        >
          {this.indexIndicator()}
          <TouchableOpacity onPress={() => alert("Login")}>
            <ButtonBackground />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => alert("Login")}>
            <Text style={{ padding: 10, color: "#3F3F3F" }}>
              Don't have an account?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  firstScreen: {},
});
