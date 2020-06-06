import React, { Component } from "react";

import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import { HackathonContext } from "../context";
import { ScheduleEventCell } from "./ScheduleEventCell";
import Svg, { Circle } from "react-native-svg";
import { Dimensions } from "react-native";
import SaturdayGray from "../assets/SaturdayGray";
import SaturdayGradient from "../assets/SaturdayGradient";
import FridayGray from "../assets/FridayGray";
import FridayGradient from "../assets/FridayGradient";
import SundayGray from "../assets/SundayGray";
import SundayGradient from "../assets/SundayGradient";
import Underline from "../assets/UnderlineGradient";
import { getTimeblocksForDay, isEventHappeningNow } from "../cms/DataHandler";
import BackToTop from "../assets/ChevronUp";

export class ScheduleDayView extends Component {
  static contextType = HackathonContext;

  constructor(props) {
    super(props);

    const dayIndex =
      this.props.initialDayIndex == -1 ? 0 : this.props.initialDayIndex;

    this.state = {
      dayIndex: dayIndex,
    };

    this.tabListRef = React.createRef();
    this.scheduleListRef = React.createRef();
  }

  componentDidMount() {
    this.tabListRef.current.scrollToIndex({
      index: this.state.dayIndex,
      animated: false,
    });
    if (this.props.initialEventIndex > 0) {
      this.scheduleListRef.current.scrollToIndex({
        index: this.props.initialEventIndex,
        animated: false,
      });
    }
  }

  tabContent = (day) => (
    <HackathonContext.Consumer>
      {({ hackathon }) => {
        const events = hackathon.events;
        const currentDayString = day;
        const timeblocks = getTimeblocksForDay(events, currentDayString);

        return (
          <FlatList
            ref={this.scheduleListRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: this.props.paddingHeight }}
            data={timeblocks}
            keyExtractor={(item, index) => (item && item.id ? item.id : index)}
            onScrollToIndexFailed={(error) => {
              setTimeout(() => {
                this.scheduleListRef.current.scrollToIndex({
                  index: error.index,
                  animated: false,
                });
              }, 100);
            }}
            renderItem={({ item, index }) => {
              if (item == null) {
                return;
              }

              const radius = 7;
              const size = radius * 2;
              const isHappeningNow = isEventHappeningNow(item);
              const highlighted = isHappeningNow;
              const highlightColor = highlighted ? "#41D1FF" : "#F2F2F2";

              if (item && item.time) {
                return (
                  <View key={index} flexDirection="row" style={{ height: 40 }}>
                    <View flexDirection="row" style={styles.circleParent}>
                      <Svg height={size} width={size}>
                        <Circle
                          cx={radius}
                          cy={radius}
                          r={radius}
                          fill={highlightColor}
                        />
                      </Svg>
                    </View>
                    <View style={styles.timeParent}>
                      <Text style={styles.timeText}>{item.time}</Text>
                    </View>
                  </View>
                );
              }

              return (
                <View key={index} flexDirection="row">
                  <View flexDirection="row" style={styles.lineParent}>
                    <View
                      style={{
                        width: 1.5,
                        height: "100%",
                        backgroundColor: highlightColor,
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.cardParent}
                    onPress={() => {
                      this.props.onSelectEvent(item);
                    }}
                  >
                    <ScheduleEventCell event={item} highlighted={highlighted} />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        );
      }}
    </HackathonContext.Consumer>
  );

  dayTabView = (width) => {
    return (
      <View style={{ backgroundColor: "white" }}>
        <View flexDirection="row" style={styles.daysParent}>
          {this.props.days.map((dayString, i) => {
            const isHighlight = this.state.dayIndex == i;
            let button;

            if (dayString == "friday") {
              button = isHighlight ? (
                <FridayGradient style={styles.dayTextGradient} />
              ) : (
                <FridayGray style={styles.dayTextGradient} />
              );
            }
            if (dayString == "saturday") {
              button = isHighlight ? (
                <SaturdayGradient style={styles.dayTextGradient} />
              ) : (
                <SaturdayGray style={styles.dayTextGradient} />
              );
            }
            if (dayString == "sunday") {
              button = isHighlight ? (
                <SundayGradient style={styles.dayTextGradient} />
              ) : (
                <SundayGray style={styles.dayTextGradient} />
              );
            }

            var underline;
            if (i == this.state.dayIndex) {
              underline = (
                <Underline
                  style={{
                    top: 7,
                    alignContent: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                  }}
                  width={(width * 0.9) / this.props.days.length}
                />
              );
            } else {
              underline = (
                <View
                  style={{
                    alignContent: "center",
                    justifyContent: "center",
                    alignSelf: "center",
                    top: 7,
                    height: 3,
                    width: (width * 0.9) / this.props.days.length,
                    backgroundColor: "#F2F2F2",
                  }}
                />
              );
            }

            return (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  if (this.tabListRef.current != null) {
                    this.tabListRef.current.scrollToIndex({ index: i });
                    this.setState({ dayIndex: i });
                  }
                }}
              >
                {button}
                {underline}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  backToTopButton = () => {
    return (
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 0,
          bottom: this.props.paddingHeight - 15,
        }}
        onPress={() => {
          if (this.scheduleListRef.current != null) {
            this.scheduleListRef.current.scrollToIndex({
              index: this.props.initialEventIndex,
              animated: true,
            });
          }
        }}
      >
        <BackToTop />
      </TouchableOpacity>
    );
  };

  render() {
    const width = Dimensions.get("window").width;
    // only show back to top button if the current tab is on the current day, and there are events
    const shouldShowBackToTopButton =
      this.state.dayIndex == this.props.initialDayIndex &&
      this.props.initialEventIndex != -1;

    return (
      <View>
        {this.dayTabView(width)}

        <FlatList
          ref={this.tabListRef}
          data={this.props.days}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          keyExtractor={(item) => item}
          onMomentumScrollEnd={(scrollData) => {
            this.setState({
              dayIndex: Math.round(
                scrollData.nativeEvent.contentOffset.x / width
              ),
            });
          }}
          onScrollToIndexFailed={(error) => {
            setTimeout(() => {
              this.tabListRef.current.scrollToIndex({
                index: error.index,
                animated: false,
              });
            }, 100);
          }}
          renderItem={({ item }) => {
            return (
              <View
                key={item}
                style={{
                  backgroundColor: "white",
                  width: width,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {this.tabContent(item)}
              </View>
            );
          }}
        />

        {shouldShowBackToTopButton && this.backToTopButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardParent: {
    padding: 8,
    width: "85%",
    borderRadius: 8,
  },

  circleParent: {
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },

  timeParent: {
    height: "80%",
    top: 5,
    width: 100,
    backgroundColor: "#F2F2F2",
    borderRadius: 8,
  },

  timeText: {
    color: "#3F3F3F",
    padding: 5,
    textAlign: "center",
    fontFamily: "SpaceMono-Regular",
  },

  lineParent: {
    width: "15%",
    justifyContent: "center",
    backgroundColor: "white",
  },

  daysParent: {
    marginBottom: 7,
    justifyContent: "center",
    alignSelf: "center",
  },

  dayTextGradient: {
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
});