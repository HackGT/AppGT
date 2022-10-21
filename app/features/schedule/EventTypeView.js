import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { EVENT_TYPE_COLOR_MAP } from "../../api/api";

export function EventTypeView(props) {
  const radius = 6;
  const size = radius * 2;
  const eventType = props.eventType;
  const color = EVENT_TYPE_COLOR_MAP[eventType] ?? "white";

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
