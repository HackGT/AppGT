import React, { useContext, useState, useEffect, useRef } from "react";
import { Dimensions, Clipboard } from "react-native";
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { ContentInfo } from "./ContentInfo";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faLifeRing,
  faExclamation,
  faKeyboard,
} from "@fortawesome/free-solid-svg-icons";
import BackButton from "../../../assets/images/Back";
import ContinueButton from "../../../assets/images/ContinueButton";
import QRCode from "react-native-qrcode-svg";
import { Linking } from "react-native";
import { HackathonContext } from "../../state/hackathon";
import { ThemeContext } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContext";

export function EventOnboarding(props) {
  const { state } = useContext(HackathonContext);
  const hackathon = state.hackathon;

  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(3);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    const screenWidth = Dimensions.get("window").width;

    const newHorizontalPosition = pageIndex * screenWidth;
    if (scrollViewRef != null) {
      scrollViewRef.current.scrollTo({ x: newHorizontalPosition });
    }
  });

  const createScreens = (width) => {
    const hackathonName = hackathon.name;
    const slackUrl = hackathon.slackUrl;

    // TODO: test this
    const qrCode = (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <AuthContext.Consumer>
            {({ user }) => {
              const id = user ? user.userId : "Unknown UUID";
              return (
                <QRCode
                  value={`user:${id}`}
                  color={dynamicStyles.secondaryTintColor.color}
                  size={200}
                  backgroundColor="clear"
                />
              );
            }}
          </AuthContext.Consumer>
        )}
      </ThemeContext.Consumer>
    );

    const welcomeScreen = (
      <View>
        <ContentInfo
          title={`Welcome to ${hackathonName}`}
          subtitles={["We're glad you're here."]}
        />
      </View>
    );

    // TODO: add ability to customize onboarding in cms
    const qrCodeScreen = (
      <ContentInfo
        image={qrCode}
        title="Let’s check you in"
        subtitles={[
          `An organizer will scan your QR code to check you into ${hackathonName}.`,
        ]}
      />
    );

    const slackButton = (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <TouchableOpacity
            style={[dynamicStyles.primaryButtonBackground, styles.joinSlack]}
            onPress={() => Linking.openURL(`${slackUrl}`)}
          >
            <Text style={styles.buttonText}>Join</Text>
          </TouchableOpacity>
        )}
      </ThemeContext.Consumer>
    );

    const screenBackground = {
      flex: 1,
      width: width,
      justifyContent: "center",
      alignItems: "center",
    };

    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => {
          const joinCommunity = (
            <ContentInfo
              image={
                <FontAwesomeIcon
                  color={dynamicStyles.tintColor.color}
                  icon={faLifeRing}
                  size={60}
                />
              }
              title="Questions? We're always available"
              subtitles={[
                `Join our ${hackathonName} community with staff, mentors, and other participants.`,
              ]}
              button={slackButton}
            />
          );

          const addGTPDToContacts = (
            <ThemeContext.Consumer>
              {({ dynamicStyles }) => (
                <TouchableOpacity
                  style={[
                    dynamicStyles.primaryButtonBackground,
                    styles.contacts,
                  ]}
                  onPress={() => Clipboard.setString("(404) 894-2500")}
                >
                  {/* TODO: create new contact automatically: https://www.npmjs.com/package/react-native-contacts */}
                  <Text style={styles.buttonText}>Copy Contact</Text>
                </TouchableOpacity>
              )}
            </ThemeContext.Consumer>
          );
          const gtpdScreen = (
            <ContentInfo
              image={
                <FontAwesomeIcon
                  color={dynamicStyles.tintColor.color}
                  icon={faExclamation}
                  size={60}
                />
              }
              title="Some Important Information"
              subtitles={[
                // "In case of emergencies, contact the Georgia Tech police department.",
                // "GTPD: (404) 894-2500.",
                "If you ever have any questions or concerns, please visit the help channel on slack or email hello@hexlabs.org.",
              ]}
              // button={addGTPDToContacts}
            />
          );
          const happyHacking = (
            <ContentInfo
              image={
                <FontAwesomeIcon
                  color={dynamicStyles.tintColor.color}
                  icon={faKeyboard}
                  size={60}
                />
              }
              title="Happy Hacking"
              subtitles={[
                "We're looking forward to seeing the amazing things you'll build!",
              ]}
            />
          );

          const screens = [welcomeScreen, joinCommunity, happyHacking];

          return screens.map((content, i) => {
            return (
              <View
                key={i}
                style={[dynamicStyles.backgroundColor, screenBackground]}
              >
                {content}
              </View>
            );
          });
        }}
      </ThemeContext.Consumer>
    );
  };

  const statusHeader = () => {
    const portionComplete = (pageIndex + 1) / pageCount;

    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <View flexDirection="row" style={styles.headerParent}>
            <View flex={0.1}>
              <TouchableOpacity
                onPress={() => {
                  if (pageIndex - 1 >= 0) {
                    setPageIndex(pageIndex - 1);
                  }
                }}
              >
                <BackButton
                  style={styles.backButton}
                  fill={dynamicStyles.secondaryBackgroundColor.backgroundColor}
                />
              </TouchableOpacity>
            </View>

            <View
              flex={portionComplete}
              style={[
                dynamicStyles.tintBackgroundColor,
                styles.completedPortion,
              ]}
            />
            <View
              flex={1 - portionComplete}
              style={[
                dynamicStyles.secondaryBackgroundColor,
                styles.unfinishedPortion,
              ]}
            />
          </View>
        )}
      </ThemeContext.Consumer>
    );
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <ThemeContext.Consumer>
      {({ dynamicStyles }) => (
        <SafeAreaView style={[dynamicStyles.backgroundColor, styles.rootView]}>
          {statusHeader()}

          <ScrollView
            style={dynamicStyles.backgroundColor}
            ref={scrollViewRef}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            scrollEnabled={false}
          >
            {createScreens(screenWidth)}
          </ScrollView>

          <View style={[dynamicStyles.backgroundColor, styles.footer]}>
            <TouchableOpacity
              onPress={() => {
                if (pageIndex < pageCount - 1) {
                  setPageIndex(pageIndex + 1);
                } else {
                  // reached end, onboarding complete
                  props.onDone();
                }
              }}
            >
              <ContinueButton />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </ThemeContext.Consumer>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },

  footer: {
    alignItems: "center",
    alignContent: "center",
    bottom: 16,
  },

  headerParent: {
    marginRight: 20,
  },

  backButton: {
    left: 8,
  },

  completedPortion: {
    top: 12,
    left: 10,
    height: 6,
  },

  unfinishedPortion: {
    top: 12,
    left: 10,
    height: 6,
  },

  joinSlack: {
    top: 10,
    width: 100,
    borderRadius: 10,
  },

  contacts: {
    top: 10,
    width: 140,
    borderRadius: 10,
  },

  buttonText: {
    padding: 5,
    textAlign: "center",
    color: "white",
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.005,
  },
});
