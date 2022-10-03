import React, { useContext } from "react";
import { Text, View, StyleSheet } from "react-native";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Card } from "../../components/Card";

export function EventSel(props) {
  const { dynamicStyles } = useContext(ThemeContext);

  return (
    <View style={styles.card}>
      <Card>
        <View style={styles.titleHeader}>
          <Text
            numberOfLines={props.truncateText ? 1 : null}
            ellipsizeMode={"tail"}
            style={[styles.flexWrap, dynamicStyles.text, styles.titleFont]}
          >
            {props.name}
          </Text>
        </View>

        <Text
          numberOfLines={props.truncateText ? 1 : null}
          ellipsizeMode={"tail"}
          style={[
            styles.flexWrap,
            dynamicStyles.secondaryText,
            styles.subtitleFont,
          ]}
        >
          {props.location}
          {props.startTime} - {props.endTime}
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  titleHeader: {
    flexDirection: "row",
    width: "100%",
    letterSpacing: 0.005,
  },

  titleFont: {
    fontSize: 16,
    width: "90%",
    fontWeight: "bold",
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.005,
    marginRight: 10,
  },

  subtitleFont: {
    marginTop: 2,
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.005,
  },

  tagFont: {
    marginTop: 2,
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.005,
    marginTop: -0.2,
    marginLeft: 8,
  },

  wrappable: {
    flexWrap: "wrap",
  },
});
