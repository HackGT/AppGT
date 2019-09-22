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
  restaurant,
  menuItems,
  presenter
}) => {
  return (
    <View style={styles.content}>
      <Text style={styles.contentTitle}>{title}</Text>
      <Text style={styles.contentText}>{startTime}</Text>
      <Text style={styles.contentText}>{endTime}</Text>
      {eventType === "meal" && <Meal restaurant={restaurant} />}
      {eventType === "workshop" && <Workshop />}
      {eventType === "talk" && <Talk />}
      <Text style={styles.contentTitle}>{desc}</Text>
      <TagList tagList={tags} />
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
    height: 400
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12
  },
  contentText: {
    fontSize: 15,
    marginBottom: 12
  }
});
