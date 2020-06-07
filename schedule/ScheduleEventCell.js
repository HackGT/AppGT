import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import StarOff from "../assets/StarOff";
import StarOn from "../assets/StarOn";
import { HackathonContext } from "../context";
import { EventTypeView } from "./EventTypeView";

export class ScheduleEventCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isStarred: false,
    };
  }

  createCardStyle = () => {
    const style = {
      padding: 17,
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "space-evenly",
      backgroundColor: "white",
      height: 100,
      borderColor: this.props.highlighted ? "#41D1FF" : "white",
      borderWidth: 1.2,
      borderRadius: 12,
      elevation: 1, // android shadow
      shadowColor: "black",
      shadowOffset: { width: 0.5, height: 0.5 },
      shadowOpacity: 0.1,
      shadowRadius: 1.5,
    };

    return style;
  };

  render() {
    const event = this.props.event;
    const eventType =
      event != null && event.type != null ? event.type.name : "none";
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

    return (
      <HackathonContext.Consumer>
        {({ toggleStar, starredIds }) => {
          const isStarred = starredIds.indexOf(event.id) != -1;

          return (
            <View style={styles.cardParent}>
              <View style={this.createCardStyle()}>
                <View style={styles.titleHeader}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={"tail"}
                    style={styles.titleFont}
                  >
                    {title}
                  </Text>
                  <TouchableOpacity
                    style={{ width: "10%" }}
                    onPress={() => toggleStar(event)}
                  >
                    {isStarred ? <StarOn /> : <StarOff />}
                  </TouchableOpacity>
                </View>
                <Text
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                  style={styles.subtitleFont}
                >
                  {location}
                  {start} - {end}
                </Text>
                <EventTypeView eventType={eventType} />
              </View>
            </View>
          );
        }}
      </HackathonContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  cardParent: {
    width: "100%",
    borderRadius: 8,
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
    color: "#4F4F4F",
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.005,
    marginRight: 10,
  },

  subtitleFont: {
    marginTop: 2,
    color: "#4F4F4F",
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.005,
  },

  footer: {
    top: 6,
  },

  footerTopic: {
    top: 5,
  },

  footerTags: {
    marginLeft: 7,
    top: -5,
  },
});
