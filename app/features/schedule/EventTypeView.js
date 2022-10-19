import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

export function EventTypeView(props) {

  const eventTypeColorMap = {
    'ceremony': '#b52c22',
    'food': '#19458c',
    'important': '#2CDACF',
    'mini-challenge': '#C866F5',
    'mini-event': '#FF8D28',
    'speaker': '#FF586C',
    'submission-expo': '#77DD77',
    'tech-talk': '#FFB6C1',
    'workshop': '#786CEB'
  }

  const radius = 6;
  const size = radius * 2;
  // const eventType = props.eventType ?? { name: "none", color: "gray" };
  const eventType = props.eventType;
  const color = eventTypeColorMap[eventType] ?? "white";

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
        {eventType}
      </Text>
    </View>
  );
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
