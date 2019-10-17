import React from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { StyledText } from "../";

export default (Talk = ({ presenter }) => {
  return (
    <View style={styles.content}>
      <StyledText style={styles.contentTitle}>Workshops Modal</StyledText>
    </View>
  );
});

const styles = StyleSheet.create({
  content: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12
  }
});
