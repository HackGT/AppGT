import React, { Component } from "react";
import { Dimensions } from "react-native";
import { Text, ScrollView, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
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
  scrollView = null;

  statusHeader(width) {
    return (
      <View flexDirection="row">
        <View flex={0.1}>
          <TouchableOpacity
            onPress={() => {
              if (this.state.pageIndex - 1 >= 0) {
                this.setState({ pageIndex: this.state.pageIndex - 1 });
                this.updateScrollPosition(width);
              }
            }}
          >
            <BackButton style={{ left: 8 }} />
          </TouchableOpacity>
        </View>

        <View
          flex={0.3}
          style={{
            top: 12,
            left: 10,
            height: 6,
            backgroundColor: "#41D1FF",
          }}
        />
        <View
          flex={0.55}
          style={{
            top: 12,
            left: 10,
            height: 6,
            backgroundColor: "#F2F2F2",
          }}
        />
      </View>
    );
  }

  updateScrollPosition(width) {
    const newHorizontalPosition = this.state.pageIndex * width;
    this.scrollView.scrollTo({ x: newHorizontalPosition });
  }

  render() {
    const screenWidth = Dimensions.get("window").width;

    return (
      <SafeAreaView style={styles.rootView}>
        {this.statusHeader(screenWidth)}

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
              if (this.state.pageIndex + 1 <= this.state.pageCount) {
                this.setState({ pageIndex: this.state.pageIndex + 1 });
                this.updateScrollPosition(screenWidth);
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
});
