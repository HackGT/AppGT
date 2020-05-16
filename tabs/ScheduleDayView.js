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

export class ScheduleDayView extends Component {
  constructor(props) {
    super(props);
  }

  tabContent = (i) => (
    <View>
      <CMSContext.Consumer>
        {({ events }) => {
          const curLen = events.length;
          const curData = events;

          return (
            <ScrollView>
              {new Array(curLen).fill(null).map((_, i) => {
                const radius = 7;
                const size = radius * 2;
                const highlighted = i >= 4 && i < 8;
                const highlightColor = highlighted ? "#41D1FF" : "#F2F2F2";

                if (i % 4 == 0) {
                  return (
                    <View flexDirection="row" style={{ height: 40 }}>
                      <View
                        flexDirection="row"
                        style={{
                          width: "15%",
                          justifyContent: "center",
                          alignItems: "center",
                          alignContent: "center",
                        }}
                      >
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
                        style={{
                          height: "80%",
                          top: 5,
                          width: 100,
                          backgroundColor: "#F2F2F2",
                          borderRadius: 8,
                        }}
                      >
                        <Text
                          style={{
                            padding: 6,
                            textAlign: "center",
                          }}
                        >
                          {i}:00 PM
                        </Text>
                      </View>
                    </View>
                  );
                }

                return (
                  <View flexDirection="row">
                    <View
                      flexDirection="row"
                      style={{
                        width: "15%",
                        justifyContent: "center",
                      }}
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
                        this.setState({ selectedEvent: curData[i] });
                        this.props.bs.current.snapTo(1);
                        this.props.bs.current.snapTo(1);
                      }}
                    >
                      <ScheduleEventCellVerticle
                        event={curData[i]}
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

  render() {
    const width = Dimensions.get("window").width;
    // const newHorizontalPosition = this.state.pageIndex * screenWidth;

    // if (this.scrollView != null) {
    //   this.scrollView.scrollTo({ x: newHorizontalPosition });
    // }

    return (
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
      >
        <View
          style={{
            backgroundColor: "white",
            flex: 1,
            width: width,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {this.tabContent(0)}
        </View>
        <View
          style={{
            backgroundColor: "white",
            flex: 1,
            width: width,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {this.tabContent(0)}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  cardParent: {
    padding: 8,
    width: "85%",
    borderRadius: 8,
  },
});
