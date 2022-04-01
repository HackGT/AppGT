import React, { useState } from "react";
import { Dimensions } from "react-native";
import {
  ScrollView,
  View,
  StyleSheet,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import Logo from "../assets/Logo";
import LogoText from "../assets/LogoText";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUsers, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { ContentInfo } from "./ContentInfo";
import { AuthContext, ThemeContext } from "../context";
import { GradientButton } from "../components/GradientButton";

export function LoginOnboarding(props) {

  const [pageIndex, setPageIndex] = useState(0)
  const [pageCount, setPageCount] = useState(3)

  const createScreens = (width) => {
    const hackgtLogo = (
      <View style={styles.firstScreenLogo}>
        <Logo />
        <LogoText style={styles.firstScreenLogoText} />
      </View>
    );

    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => {
          const screenBackground = {
            flex: 1,
            width: width,
            justifyContent: "center",
            alignItems: "center",
          };

          const personalizeSchedule = (
            <ContentInfo
              image={
                <FontAwesomeIcon
                  color={dynamicStyles.tintColor.color}
                  icon={faCalendarCheck}
                  size={60}
                />
              }
              title="Personalize your Event Schedule"
              subtitles={[
                "Favorite events that interest you to save them in your personal schedule so you never miss them.",
              ]}
            />
          );
          const joinVirtually = (
            <ContentInfo
              image={
                <FontAwesomeIcon
                  color={dynamicStyles.tintColor.color}
                  icon={faUsers}
                  size={60}
                />
              }
              title="Join Virtually"
              subtitles={[
                "Quickly access event join links, event information, and search for events that interest you. All in one place.",
              ]}
            />
          );

          const screens = [hackgtLogo, personalizeSchedule, joinVirtually];

          return screens.map((content, i) => (
            <View
              key={i}
              style={[dynamicStyles.backgroundColor, screenBackground]}
            >
              {content}
            </View>
          ));
        }}
      </ThemeContext.Consumer>
    );
  }

  // render the dots indicating which page user is on
  const indexIndicator = () => {
    const radius = 4;
    const size = radius * 2;
    const bubbles = Array.from(new Array(pageCount).keys()).map(
      (i) => {
        return (
          <ThemeContext.Consumer>
            {({ dynamicStyles }) => (
              <Svg key={i} height={size + 14} width={size + 14}>
                <Circle
                  cx={radius}
                  cy={radius}
                  r={radius}
                  fill={
                    i == pageIndex
                      ? dynamicStyles.tintColor.color
                      : dynamicStyles.secondaryBackgroundColor.backgroundColor
                  }
                />
              </Svg>
            )}
          </ThemeContext.Consumer>
        );
      }
    );

    return <View flexDirection="row">{bubbles}</View>;
  }

  const screenWidth = Dimensions.get("window").width;

  return (
    <ThemeContext.Consumer>
      {({ dynamicStyles }) => (
        <AuthContext.Consumer>
          {({ login, user, logout }) => {
            return (
              <View style={styles.rootView}>
                <ScrollView
                  flex={0.8}
                  style={dynamicStyles.backgroundColor}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  pagingEnabled={true}
                  onMomentumScrollEnd={(scrollData) => {
                    // update page indicator
                    setPageIndex(Math.round(
                      scrollData.nativeEvent.contentOffset.x / screenWidth
                    ))
                  }}
                >
                  {createScreens(screenWidth)}
                </ScrollView>

                <View
                  style={[dynamicStyles.backgroundColor, styles.footer]}
                  flex={0.2}
                >
                  {indexIndicator()}

                  <GradientButton
                    text="Get Started"
                    onPress={() => login()}
                  ></GradientButton>

                  {/* TODO: put back login stuff */}
                  {/* <TouchableOpacity onPress={() => login()}>
                    <Text style={[dynamicStyles.text, styles.makeAccount]}>
                      Don't have an account?
                    </Text>
                  </TouchableOpacity> */}

                  {/* TOOD: logout button */}
                  {/* <TouchableOpacity onPress={() => logout()}>
                    <Text style={[dynamicStyles.text, styles.toDelete]}>
                      Logout (for testing.)
                      {user != null ? user.email : "None."}
                    </Text>
                  </TouchableOpacity> */}
                </View>
              </View>
            );
          }}
        </AuthContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    flexDirection: "column",
  },

  footer: {
    alignItems: "center",
    alignContent: "center",
  },

  makeAccount: {
    padding: 10,
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.05,
  },

  toDelete: {
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