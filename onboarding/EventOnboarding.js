import React, { Component } from "react";
import { Dimensions } from "react-native";
import { ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import { ContentInfo } from "./ContentInfo";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../assets/Back";
import ContinueButton from "../assets/ContinueButton";

export class EventOnboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0,
      pageCount: 5,
    };
  }

  createScreens(width) {
    const firstScreen = (
      <ContentInfo
        title="Welcome to [Event Name]"
        subtitles={["We're glad you're here."]}
      />
    );

    const secondScreen = (
      <ContentInfo
        title="Let’s check you in"
        subtitles={[
          "An organizer will scan your QR code to check you into [Event Name].",
        ]}
      />
    );
    const thirdScreen = (
      <ContentInfo
        title="Questions? We're always available"
        subtitles={[
          "On Slack that is. Join our community in the [Event Name] Slack.",
        ]}
      />
    );
    const forthScreen = (
      <ContentInfo
        title="Some important information"
        subtitles={[
          "In case of emergencies, contact the Georgia Tech police department.",
          "GTPD: (999) 999-999.",
          "If you ever have any questions or conerns, please visit help desk anytime at [help desk location].",
        ]}
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
  scrollView = null;

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
});
