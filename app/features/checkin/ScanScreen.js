import React from "react";
import { View, StyleSheet } from "react-native";
import QRScan from "./QRScan";

export function ScanScreen(props) {
  return (
    <View style={styles.card}>
      <QRScan eventID={props.eventID} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
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

  wrappable: {
    flexWrap: "wrap",
  },
});
