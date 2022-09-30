import React, { Component, useState, useContext } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import StarOff from "../../../assets/images/StarOff";
import StarOn from "../../../assets/images/StarOn";
import { HackathonContext } from "../../state/context";
import { EventTypeView } from "./EventTypeView";
import { Card } from "../../components/Card";
import { ThemeContext } from "../../contexts/ThemeContext";

export function ScheduleEventCell(props) {
  const { state, toggleStar } = useContext(HackathonContext);
  const { dynamicStyles } = useContext(ThemeContext);

  const event = props.event;
  const eventType =
    event != null && event.type != null
      ? event.type
      : { name: "none", color: "gray" };
  const title = event.name;
  const location =
    event != null &&
    event.location != null &&
    event.location[0] != null &&
    event.location[0].name != null
      ? event.location[0].name + " • "
      : "";
  const start = event.startTime;
  const end = event.endTime;

  const isStarred = state.starredIds.indexOf(event.id) != -1;

  return (
    <Card highlighted={props.highlighted}>
      <View style={styles.titleHeader}>
        <Text
          numberOfLines={props.truncateText ? 1 : null}
          ellipsizeMode={"tail"}
          style={[styles.flexWrap, dynamicStyles.text, styles.titleFont]}
        >
          {title}
        </Text>
        <TouchableOpacity
          style={{ width: "10%" }}
          onPress={() => {
            console.log("toggling star pressed", event.id);
            toggleStar(event);
          }}
        >
          {isStarred ? (
            <StarOn fill={dynamicStyles.tintColor.color} />
          ) : (
            <StarOff
              fill={dynamicStyles.secondaryBackgroundColor.backgroundColor}
            />
          )}
        </TouchableOpacity>
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
        {location}
        {start} - {end}
      </Text>

      <View style={{ flexDirection: "row" }}>
        <EventTypeView eventType={eventType} />
        {event.tags &&
          event.tags.map((tag) => (
            <Text style={[dynamicStyles.secondaryText, styles.tagFont]}>
              {tag.name}
            </Text>
          ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
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
