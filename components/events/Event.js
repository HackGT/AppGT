import React from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import TagList from "../TagList";
import Meal from "./Meal";
import Workshop from "./Workshop";
import Talk from "./Talk";

export default (Event = ({
  isModalVisible,
  startTime,
  endTime,
  title,
  desc,
  tags,
  eventType,
  restaurantName,
  restaurantLink,
  menuItem,
  presenter
}) => {
  return (
    <View style={styles.content}>
      <Text style={styles.contentTitle}>{title}</Text>
      <Text style={styles.contentTitle}>{desc}</Text>
      {eventType === "meal" && <Meal />}
      {eventType === "workshop" && <Workshop />}
      {eventType === "talk" && <Talk />}
      <Button onPress={isModalVisible} title="Close" />
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
    borderColor: "rgba(0, 0, 0, 0.1)",
    height: 200
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12
  }
});
