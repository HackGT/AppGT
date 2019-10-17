import React from "react";
import { View, StyleSheet, Button } from "react-native";
import { StyledText } from "../";
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
  menuItems,
  presenter
}) => {
  return (
    <View style={styles.content}>
      <StyledText style={styles.contentTitle}>{title}</StyledText>
      <StyledText style={styles.contentText}>{startTime}</StyledText>
      <StyledText style={styles.contentText}>{endTime}</StyledText>
      {eventType === "meal" && (
        <Meal
          restaurantName={restaurantName}
          restaurantLink={restaurantLink}
          menuItem={menuItems}
        />
      )}
      {eventType === "workshop" && <Workshop />}
      {eventType === "talk" && <Talk />}
      <StyledText style={styles.contentTitle}>{desc}</StyledText>
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
