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
import { AuthContext } from "../context";

export class EventOnboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0,
      pageCount: 5,
    };
  }

  createScreens(width) {
    // TODO: test this
    const qrCode = (
      <AuthContext.Consumer>
        {({ user }) => {
          const id = user ? user.uuid : "Unknown UUID";
          return <QRCode value={`user:${id}`} color="#2C8DDB" size={200} />;
        }}
      </AuthContext.Consumer>
    );

    const firstScreen = (
      <View>
        <ContentInfo
          title="Welcome to [Event Name]"
          subtitles={["We're glad you're here."]}
        />
      </View>
    );

    const secondScreen = (
      <ContentInfo
        image={qrCode}
        title="Let’s check you in"
        subtitles={[
          "An organizer will scan your QR code to check you into [Event Name].",
        ]}
      />
    );

    // TODO: openURL should pull from this.context.cms.slackURL
    const slackButton = (
      <TouchableOpacity
        style={styles.joinSlack}
        onPress={() => Linking.openURL("https://hack.gt")}
      >
        <Text style={styles.buttonText}>Join Slack</Text>
      </TouchableOpacity>
    );
    const thirdScreen = (
      <ContentInfo
        title="Questions? We're always available"
        subtitles={["Join our community in the [Event Name] Slack."]}
        button={slackButton}
      />
    );

    const addGTPDToContacts = (
      <TouchableOpacity
        style={styles.contacts}
        onPress={() => Clipboard.setString("(404) 894-2500")}
      >
        {/* TODO: create new contact automatically: https://www.npmjs.com/package/react-native-contacts */}
        <Text style={styles.buttonText}>Copy Contact</Text>
      </TouchableOpacity>
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

  statusHeader() {
    const portionComplete = this.state.pageIndex / this.state.pageCount / 0.8;

    return (
      <View flexDirection="row" style={styles.headerParent}>
        <View flex={0.1}>
          <TouchableOpacity
            onPress={() => {
              if (this.state.pageIndex - 1 >= 0) {
                this.setState({ pageIndex: this.state.pageIndex - 1 });
              }
            }}
          >
            <BackButton style={styles.backButton} />
          </TouchableOpacity>
        </View>

        <View flex={portionComplete} style={styles.completedPortion} />
        <View flex={1 - portionComplete} style={styles.unfinishedPortion} />
      </View>
    );
  }

  render() {
    const screenWidth = Dimensions.get("window").width;
    const newHorizontalPosition = this.state.pageIndex * screenWidth;

    if (this.scrollView != null) {
      this.scrollView.scrollTo({ x: newHorizontalPosition });
    }

    return (
      <SafeAreaView style={styles.rootView}>
        {this.statusHeader()}

        <ScrollView
          style={styles.horizontalScroll}
          ref={(ref) => (this.scrollView = ref)}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          scrollEnabled={false}
        >
          {this.createScreens(screenWidth)}
        </ScrollView>

        <View style={styles.footer}>
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
    );
  }
}

const styles = StyleSheet.create({
  rootView: {
    backgroundColor: "white",
    flex: 1,
  },

  horizontalScroll: {
    backgroundColor: "white",
  },

  footer: {
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "white",
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
    backgroundColor: "#41D1FF",
  },

  unfinishedPortion: {
    top: 12,
    left: 10,
    height: 6,
    backgroundColor: "#F2F2F2",
  },

  joinSlack: {
    top: 10,
    backgroundColor: "#666666",
    width: 100,
    borderRadius: 10,
  },

  contacts: {
    top: 10,
    backgroundColor: "#666666",
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
