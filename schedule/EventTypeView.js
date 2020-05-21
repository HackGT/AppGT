import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors } from "../cms/DataHandler";

export class EventTypeView extends Component {
  render() {
    const radius = 6;
    const size = radius * 2;
    const eventType = this.props.eventType ?? "none";
    const typeColor = colors[eventType];

    return (
      <View flexDirection="row">
        <Svg height={size} width={size} style={styles.footerTopic}>
          <Circle cx={radius} cy={radius} r={radius} fill={typeColor} />
        </Svg>
        <Text
          style={{
            marginLeft: 7,
            color: typeColor,
            fontFamily: "SpaceMono-Regular",
          }}
        >
          {eventType}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footerTopic: {
    top: 5,
  },

  footerTags: {
    marginLeft: 7,
    top: -5,
  },
});
