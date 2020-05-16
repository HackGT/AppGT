import React, { Component } from "react";

import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { CMSContext } from "../context";
import { ScheduleEventCellVerticle } from "./ScheduleEventCellVerticle";
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

  state = {
    dayIndex: 0,
    days: ["friday", "saturday", "sunday"],
  };

  constructor(props) {
    super(props);
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
                      <ScheduleEventCellVerticle
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
      <View
        flexDirection="row"
        style={{
          width: "100%",
          marginTop: 5,
          justifyContent: "center",
        }}
      >
        {Array.from(new Array(this.state.days.length).keys()).map((i) => {
          if (i == this.state.dayIndex) {
            return <Underline width={(width * 0.9) / this.state.days.length} />;
          } else {
            return (
              <View
                style={{
                  height: 3,
                  width: (width * 0.9) / this.state.days.length,
                  backgroundColor: "#F2F2F2",
                }}
              />
            );
          }
        })}
      </View>
    );
  };

  render() {
    const width = Dimensions.get("window").width;

    return (
      <View>
        <View flexDirection="row" style={styles.daysParent}>
          {this.state.days.map((dayString, i) => {
            const isHighlight = this.state.dayIndex == i;
            let button;

            if (dayString == "friday") {
              button = isHighlight ? <FridayGradient /> : <FridayGray />;
            }
            if (dayString == "saturday") {
              button = isHighlight ? <SaturdayGradient /> : <SaturdayGray />;
            }
            if (dayString == "sunday") {
              button = isHighlight ? <SundayGradient /> : <SundayGray />;
            }

            return (
              <TouchableOpacity
                onPress={() => {
                  const newHorizontalPosition = i * width;

                  if (this.scrollView != null) {
                    this.scrollView.scrollTo({
                      x: newHorizontalPosition,
                    });
                  }
                }}
              >
                {button}
              </TouchableOpacity>
            );
          })}
        </View>
        {this.dayTabView(width)}

        <ScrollView
          onMomentumScrollEnd={(scrollData) => {
            this.setState({
              dayIndex: Math.round(
                scrollData.nativeEvent.contentOffset.x / width
              ),
            });
          }}
          scrollEventThrottle={50}
          ref={(ref) => {
            this.scrollView = ref;
          }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
        >
          {this.state.days.map((day) => {
            return (
              <View
                key={day}
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
          })}
        </ScrollView>
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
    padding: 6,
    textAlign: "center",
  },

  lineParent: {
    width: "15%",
    justifyContent: "center",
  },

  daysParent: {
    marginTop: 5,
    marginBottom: 5,
    justifyContent: "space-evenly",
  },
});
