import React, { useState, useEffect, useRef } from "react";

import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import { ThemeContext } from "../../state/context";
import { ScheduleEventCell } from "./ScheduleEventCell";
import Svg, { Circle } from "react-native-svg";
import { Dimensions } from "react-native";
import SaturdayGray from "../../../assets/images/SaturdayGray";
import SaturdayGradient from "../../../assets/images/SaturdayGradient";
import FridayGray from "../../../assets/images/FridayGray";
import FridayGradient from "../../../assets/images/FridayGradient";
import SundayGray from "../../../assets/images/SundayGray";
import SundayGradient from "../../../assets/images/SundayGradient";
import Underline from "../../../assets/images/UnderlineGradient";
import {
  getTimeblocksForDay,
  isEventHappeningNow,
} from "../../cms/DataHandler";
import BackToTop from "../../../assets/images/ChevronUp";

export function ScheduleDayView(props) {
  const initDayIndex = props.initialDayIndex == -1 ? 0 : props.initialDayIndex;
  const [dayIndex, setDayIndex] = useState(initDayIndex);

  const tabListRef = useRef(null);
  const currentScheduleRef = useRef(null);

  useEffect(() => {
    if (props.events.count > 0) {
      tabListRef.current.scrollToIndex({
        index: dayIndex,
        animated: false,
      });
      if (props.initialEventIndex > 0) {
        if (
          currentScheduleRef != null &&
          props.days[dayIndex] == currentDayString
        ) {
          currentScheduleRef.current.scrollToIndex({
            index: props.initialEventIndex,
            animated: false,
          });
        }
      }
    }
  }, []);

  const tabContent = (day) => (
    <ThemeContext.Consumer>
      {({ dynamicStyles }) => {
        const events = props.events;
        const currentDayString = day;
        const timeblocks = getTimeblocksForDay(events, currentDayString);

        return (
          <FlatList
            ref={currentScheduleRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: props.paddingHeight,
            }}
            data={timeblocks}
            keyExtractor={(item, index) =>
              "" + (item && item.id ? item.id : index)
            }
            onScrollToIndexFailed={(error) => {
              setTimeout(() => {
                if (props.days[dayIndex] == currentDayString) {
                  currentScheduleRef.current.scrollToIndex({
                    index: error.index,
                    animated: false,
                  });
                }
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
                    key={"" + index}
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
                    style={[dynamicStyles.backgroundColor, styles.lineParent]}
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
                      props.onSelectEvent(item);
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
    </ThemeContext.Consumer>
  );

  const dayTabView = (width) => {
    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <View style={dynamicStyles.backgroundColor}>
            <View flexDirection="row" style={styles.daysParent}>
              {props.days.map((dayString, i) => {
                const isHighlight = dayIndex == i;
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
                  width: (width * 0.9) / props.days.length,
                };
                if (i == dayIndex) {
                  underline = (
                    <Underline
                      style={{
                        top: 7,
                        alignContent: "center",
                        justifyContent: "center",
                        alignSelf: "center",
                      }}
                      width={(width * 0.9) / props.days.length}
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
                      if (tabListRef.current != null) {
                        tabListRef.current.scrollToIndex({ index: i });
                        setDayIndex(i);
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

  const backToTopButton = () => {
    return (
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 0,
          bottom: props.paddingHeight + 10,
        }}
        onPress={() => {
          if (
            currentScheduleRef != null &&
            props.days[dayIndex] == currentDayString
          ) {
            currentScheduleRef.current.scrollToIndex({
              index: props.initialEventIndex,
              animated: true,
            });
          }
        }}
      >
        <BackToTop />
      </TouchableOpacity>
    );
  };

  const width = Dimensions.get("window").width;
  // only show back to top button if the current tab is on the current day, and there are events
  const shouldShowBackToTopButton =
    dayIndex == props.initialDayIndex && props.initialEventIndex != -1;
  const itemStyle = {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <ThemeContext.Consumer>
      {({ dynamicStyles }) => (
        <View>
          {dayTabView(width)}

          <FlatList
            ref={tabListRef}
            data={props.days}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            keyExtractor={(item) => item}
            onMomentumScrollEnd={(scrollData) => {
              setDayIndex(
                Math.round(scrollData.nativeEvent.contentOffset.x / width)
              );
            }}
            onScrollToIndexFailed={(error) => {
              setTimeout(() => {
                tabListRef.current.scrollToIndex({
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
                  {tabContent(item)}
                </View>
              );
            }}
          />

          {shouldShowBackToTopButton && backToTopButton()}
        </View>
      )}
    </ThemeContext.Consumer>
  );
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
