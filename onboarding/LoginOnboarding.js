import React, { Component } from "react";
import { Dimensions } from "react-native";
import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import ButtonBackground from "../assets/ButtonBackground";
import Logo from "../assets/Logo";
import LogoText from "../assets/LogoText";

import { ContentInfo } from "./ContentInfo";
import { AuthContext } from "../context";

export class LoginOnboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0,
      pageCount: 4,
    };
  }

  createScreens(width) {
    const firstScreen = (
      <View style={styles.firstScreenLogo}>
        <Logo />
        <LogoText style={styles.firstScreenLogoText} />
      </View>
    );

    const secondScreen = (
      <ContentInfo
        title="Personalize your event schedule"
        subtitles={[
          "Favorite events that interest you to save them in your personal schedule so you never miss them.",
        ]}
      />
    );
    const thirdScreen = (
      <ContentInfo
        title="Checkout Hardware"
        subtitles={[
          "Order the hardware you need for your project, and then pick it up at the hardware desk.",
        ]}
      />
    );
    const forthScreen = (
      <ContentInfo
        title="Explore our event with Scavenger Hunt"
        subtitles={[
          "Need a break from hacking? Complete our scavenger hunt for some sweet, sweet, swag.",
        ]}
      />
    );

    const screens = [firstScreen, secondScreen, thirdScreen, forthScreen];

    return screens.map((content, i) => {
      return (
        <View
          key={i}
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

  // render the dots indicating which page user is on
  indexIndicator() {
    const radius = 4;
    const size = radius * 2;
    const bubbles = Array.from(new Array(this.state.pageCount).keys()).map(
      (i) => {
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
      }
    );

    return <View flexDirection="row">{bubbles}</View>;
  }

  render() {
    const screenWidth = Dimensions.get("window").width;

    return (
      <AuthContext.Consumer>
        {({ login, user, logout }) => {
          return (
            <View style={styles.rootView}>
              <ScrollView
                flex={0.8}
                style={styles.horizontalScroll}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                pagingEnabled={true}
                onMomentumScrollEnd={(scrollData) => {
                  // update page indicator
                  this.setState({
                    pageIndex: Math.round(
                      scrollData.nativeEvent.contentOffset.x / screenWidth
                    ),
                  });
                }}
              >
                {this.createScreens(screenWidth)}
              </ScrollView>

              <View style={styles.footer} flex={0.2}>
                {this.indexIndicator()}

                <TouchableOpacity onPress={() => login()}>
                  <ButtonBackground />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => login()}>
                  <Text style={styles.makeAccount}>Don't have an account?</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => logout()}>
                  <Text style={styles.makeAccount}>
                    Logout (for testing.) {user != null ? user.email : "None."}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      </AuthContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    flexDirection: "column",
  },

  horizontalScroll: {
    backgroundColor: "white",
  },

  footer: {
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "white",
  },

  makeAccount: {
    padding: 10,
    color: "#3F3F3F",
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.05,
  },

  firstScreenLogo: {
    alignItems: "center",
    alignContent: "center",
  },

  firstScreenLogoText: {
    top: 10,
  },

  titleImage: {
    backgroundColor: "tomato",
    width: 200,
    height: 200,
  },

  textTitle: {
    top: 42,
    fontSize: 24,
    fontFamily: "SpaceMono-Bold",
    letterSpacing: 0.05,
  },
});

LoginOnboarding.contextType = AuthContext;
