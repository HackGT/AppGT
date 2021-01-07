import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

export class EventTypeView extends Component {
  render() {
    const radius = 6;
    const size = radius * 2;
    const eventType = this.props.eventType ?? { name: "none", color: "gray" };
    const color = eventType.color ?? "white";

    return (
      <View flexDirection="row">
        <Svg height={size} width={size} style={styles.footerTopic}>
          <Circle cx={radius} cy={radius} r={radius} fill={color} />
        </Svg>
        <Text
          style={{
            marginLeft: 7,
            color: color,
            fontFamily: "SpaceMono-Regular",
          }}
        >
          {eventType.name}
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
