import React from "react";
import { ScrollView, StyleSheet, Button } from "react-native";
import { StyledText } from "../";
import TagList from "../TagList";
import Meal from "./Meal";
import Talk from "./Talk";
import { styleguide } from "../../styles";

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
  people
}) => {
  console.log(menuItems);
  return (
    <ScrollView style={styles.content}>
      <StyledText style={{ ...styleguide.title }}>{title}</StyledText>
      {startTime && (
        <StyledText style={{ ...styleguide.text }}>
          {startTime.format("dddd")}
        </StyledText>
      )}
      {startTime && (
        <StyledText style={{ ...styleguide.text }}>
          {startTime.format("MMM Do")}
        </StyledText>
      )}
      {startTime && (
        <StyledText style={{ ...styleguide.text }}>
          {startTime.format("hh:mm A")}
        </StyledText>
      )}
      {endTime && (
        <StyledText style={{ ...styleguide.text }}>
          {endTime.format("hh:mm A")}
        </StyledText>
      )}
      <StyledText style={{ ...styleguide.text }}>{desc}</StyledText>
      {eventType === "meal" && (
        <Meal
          restaurantName={restaurantName}
          restaurantLink={restaurantLink}
          menuItems={menuItems}
        />
      )}
      {eventType === "talk" && <Talk people={people} />}
      <TagList tagList={tags} />
      <Button onPress={isModalVisible} title="Close" />
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  content: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
    maxHeight: 400
  }
});
