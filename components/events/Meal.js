import React from "react";
import { View, StyleSheet } from "react-native";
import { StyledText } from "../";

export default (Meal = ({ restaurantName, restaurantLink, menuItem }) => {
  return (
    <View style={styles.content}>
      <StyledText style={styles.contentTitle}>{restaurantName}</StyledText>
      <StyledText style={styles.contentTitle}>{restaurantLink}</StyledText>
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
