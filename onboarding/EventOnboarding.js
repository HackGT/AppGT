import React, { Component } from "react";
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
import BackButton from "../assets/Back";
import ContinueButton from "../assets/ContinueButton";
import QRCode from "react-native-qrcode-svg";
import { Linking } from "react-native";
import { AuthContext, HackathonContext, ThemeContext } from "../context";

export class EventOnboarding extends Component {
  static contextType = HackathonContext;

  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0,
      pageCount: 5,
    };
  }

  createScreens(width) {
    const hackathonName = this.context.hackathon.name;
    const slackUrl = this.context.hackathon.slackUrl;

    // TODO: test this
    const qrCode = (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <AuthContext.Consumer>
            {({ user }) => {
              const id = user ? user.uuid : "Unknown UUID";
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

    const firstScreen = (
      <View>
        <ContentInfo
          title={`Welcome to ${hackathonName}`}
          subtitles={["We're glad you're here."]}
        />
      </View>
    );

    const secondScreen = (
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
            <Text style={styles.buttonText}>Join Slack</Text>
          </TouchableOpacity>
        )}
      </ThemeContext.Consumer>
    );

    const thirdScreen = (
      <ContentInfo
        title="Questions? We're always available"
        subtitles={[`Join our community in the ${hackathonName} Slack.`]}
        button={slackButton}
      />
    );

    const addGTPDToContacts = (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <TouchableOpacity
            style={[dynamicStyles.primaryButtonBackground, styles.contacts]}
            onPress={() => Clipboard.setString("(404) 894-2500")}
          >
            {/* TODO: create new contact automatically: https://www.npmjs.com/package/react-native-contacts */}
            <Text style={styles.buttonText}>Copy Contact</Text>
          </TouchableOpacity>
        )}
      </ThemeContext.Consumer>
    );
    const forthScreen = (
      <ContentInfo
        title="Some Important Information"
        subtitles={[
          "In case of emergencies, contact the Georgia Tech police department.",
          "GTPD: (404) 894-2500.",
          "If you ever have any questions or conerns, please visit help desk anytime at [help desk location].",
        ]}
        button={addGTPDToContacts}
      />
    );
    const fifthScreen = (
      <ContentInfo
        title="Happy Hacking"
        subtitles={[
          "We’re looking forward to seeing the amazing things you’ll build.",
        ]}
      />
    );

    const screens = [
      firstScreen,
      secondScreen,
      thirdScreen,
      forthScreen,
      fifthScreen,
    ];

    return screens.map((content, i) => {
      const screenBackground = {
        flex: 1,
        width: width,
        justifyContent: "center",
        alignItems: "center",
      };

      return (
        <ThemeContext.Consumer>
          {({ dynamicStyles }) => (
            <View
              key={i}
              style={[dynamicStyles.backgroundColor, screenBackground]}
            >
              {content}
            </View>
          )}
        </ThemeContext.Consumer>
      );
    });
  }

  statusHeader() {
    const portionComplete = this.state.pageIndex / this.state.pageCount / 0.8;

    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <View flexDirection="row" style={styles.headerParent}>
            <View flex={0.1}>
              <TouchableOpacity
                onPress={() => {
                  if (this.state.pageIndex - 1 >= 0) {
                    this.setState({ pageIndex: this.state.pageIndex - 1 });
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
  }

  componentDidUpdate() {
    const screenWidth = Dimensions.get("window").width;

    const newHorizontalPosition = this.state.pageIndex * screenWidth;
    if (this.scrollView != null) {
      this.scrollView.scrollTo({ x: newHorizontalPosition });
    }
  }

  render() {
    const screenWidth = Dimensions.get("window").width;

    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <SafeAreaView
            style={[dynamicStyles.backgroundColor, styles.rootView]}
          >
            {this.statusHeader()}

            <ScrollView
              style={dynamicStyles.backgroundColor}
              ref={(ref) => (this.scrollView = ref)}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              pagingEnabled={true}
              scrollEnabled={false}
            >
              {this.createScreens(screenWidth)}
            </ScrollView>

            <View style={[dynamicStyles.backgroundColor, styles.footer]}>
              <TouchableOpacity
                onPress={() => {
                  if (this.state.pageIndex + 1 < this.state.pageCount) {
                    this.setState({ pageIndex: this.state.pageIndex + 1 });
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
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },

  footer: {
    alignItems: "center",
    alignContent: "center",
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
