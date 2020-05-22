import React, { Component } from "react";

import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { CMSContext } from "../context";
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

export class ScheduleDayView extends Component {
  daysAvailable = ["friday", "saturday", "sunday"];

  // TODO: changing to just sat/sun breaks
  state = {
    dayIndex: 1,
    days: ["friday", "saturday", "sunday"],
  };

  constructor(props) {
    super(props);

    this.scheduleListRef = React.createRef();
  }

  tabContent = () => (
    <View>
      <CMSContext.Consumer>
        {({ events }) => {
          return (
            <ScrollView>
              {new Array(events.length).fill(null).map((_, i) => {
                const radius = 7;
                const size = radius * 2;
                const highlighted = i >= 4 && i < 8;
                const highlightColor = highlighted ? "#41D1FF" : "#F2F2F2";

                if (i % 4 == 0) {
                  return (
                    <View key={i} flexDirection="row" style={{ height: 40 }}>
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
                        <Text style={styles.timeText}>{i}:00 PM</Text>
                      </View>
                    </View>
                  );
                }

                return (
                  <View flexDirection="row">
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
                        this.props.onSelectEvent(events[i]);
                      }}
                    >
                      <ScheduleEventCell
                        event={events[i]}
                        highlighted={highlighted}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          );
        }}
      </CMSContext.Consumer>
    </View>
  );

  dayTabView = (width) => {
    return (
      <View style={{ backgroundColor: "white" }}>
        <View flexDirection="row" style={styles.daysParent}>
          {this.state.days.map((dayString, i) => {
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
                  width={(width * 0.9) / this.state.days.length}
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
                    width: (width * 0.9) / this.state.days.length,
                    backgroundColor: "#F2F2F2",
                  }}
                />
              );
            }

            return (
              <TouchableOpacity
                onPress={() => {
                  if (this.scheduleListRef.current != null) {
                    this.scheduleListRef.current.scrollToIndex({ index: i });
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

  render() {
    const width = Dimensions.get("window").width;

    return (
      <View>
        {this.dayTabView(width)}

        <FlatList
          ref={this.scheduleListRef}
          data={this.state.days}
          initialScrollIndex={this.state.dayIndex}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          keyExtractor={({ item }) => item}
          onMomentumScrollEnd={(scrollData) => {
            this.setState({
              dayIndex: Math.round(
                scrollData.nativeEvent.contentOffset.x / width
              ),
            });
          }}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              this.scheduleListRef.scrollToIndex({
                index: this.state.dayIndex,
                animated: false,
              });
            });
          }}
          renderItem={({ item }) => {
            return (
              <View
                key={item.key}
                style={{
                  backgroundColor: "white",
                  flex: 1,
                  width: width,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {this.tabContent()}
              </View>
            );
          }}
        />
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
