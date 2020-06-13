import React, { Component } from "react";

import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import { HackathonContext, ThemeContext } from "../context";
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
  constructor(props) {
    super(props);

    const dayIndex =
      this.props.initialDayIndex == -1 ? 0 : this.props.initialDayIndex;

    this.state = {
      dayIndex: dayIndex,
    };

    this.tabListRef = React.createRef();
    this.currentScheduleRef = React.createRef();
  }

  componentDidMount() {
    this.tabListRef.current.scrollToIndex({
      index: this.state.dayIndex,
      animated: false,
    });
    if (this.props.initialEventIndex > 0) {
      if (this.currentScheduleRef != null) {
        this.currentScheduleRef.scrollToIndex({
          index: this.props.initialEventIndex,
          animated: false,
        });
      }
    }
  }

  tabContent = (day) => (
    <ThemeContext.Consumer>
      {({ dynamicStyles }) => (
        <HackathonContext.Consumer>
          {({ hackathon }) => {
            const events = hackathon.events;
            const currentDayString = day;
            const timeblocks = getTimeblocksForDay(events, currentDayString);

            return (
              <FlatList
                ref={(ref) => {
                  if (
                    this.props.days[this.state.dayIndex] == currentDayString
                  ) {
                    this.currentScheduleRef = ref;
                  }
                }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: this.props.paddingHeight,
                }}
                data={timeblocks}
                keyExtractor={(item, index) =>
                  item && item.id ? item.id : index
                }
                onScrollToIndexFailed={(error) => {
                  setTimeout(() => {
                    this.currentScheduleRef.scrollToIndex({
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
                  const highlightColor = highlighted
                    ? dynamicStyles.tintColor.color
                    : dynamicStyles.secondaryBackgroundColor.backgroundColor;

                  if (item && item.time) {
                    return (
                      <View
                        key={index}
                        flexDirection="row"
                        style={{ height: 40 }}
                      >
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
                        <View
                          style={[
                            dynamicStyles.secondaryBackgroundColor,
                            styles.timeParent,
                          ]}
                        >
                          <Text style={[dynamicStyles.text, styles.timeText]}>
                            {item.time}
                          </Text>
                        </View>
                      </View>
                    );
                  }

                  return (
                    <View key={index} flexDirection="row">
                      <View
                        flexDirection="row"
                        style={[
                          dynamicStyles.backgroundColor,
                          styles.lineParent,
                        ]}
                      >
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
                        <ScheduleEventCell
                          event={item}
                          highlighted={highlighted}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            );
          }}
        </HackathonContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );

  dayTabView = (width) => {
    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <View style={dynamicStyles.backgroundColor}>
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
                const underlineStyle = {
                  alignContent: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  top: 7,
                  height: 3,
                  width: (width * 0.9) / this.props.days.length,
                };
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
                      style={[
                        dynamicStyles.secondaryBackgroundColor,
                        underlineStyle,
                      ]}
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
        )}
      </ThemeContext.Consumer>
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
          if (this.currentScheduleRef != null) {
            this.currentScheduleRef.scrollToIndex({
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
    const itemStyle = {
      width: width,
      justifyContent: "center",
      alignItems: "center",
    };

    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
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
                    style={[dynamicStyles.backgroundColor, itemStyle]}
                  >
                    {this.tabContent(item)}
                  </View>
                );
              }}
            />

            {shouldShowBackToTopButton && this.backToTopButton()}
          </View>
        )}
      </ThemeContext.Consumer>
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
    borderRadius: 8,
  },

  timeText: {
    padding: 5,
    textAlign: "center",
    fontFamily: "SpaceMono-Regular",
  },

  lineParent: {
    width: "15%",
    justifyContent: "center",
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
