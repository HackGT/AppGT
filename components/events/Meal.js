import React from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import TagList from "../TagList";

export default (Meal = ({ desc, restaurant, menuItem }) => {
  return (
    <View style={styles.content}>
      <Text style={styles.contentTitle}>{restaurant.name}</Text>
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
