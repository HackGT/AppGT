import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import StarOff from "../assets/StarOff";
import StarOn from "../assets/StarOn";
import { HackathonContext, ThemeContext } from "../context";
import { EventTypeView } from "./EventTypeView";
import { Card } from "../components/Card";

export class ScheduleEventCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isStarred: false,
    };
  }

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
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <HackathonContext.Consumer>
            {({ toggleStar, starredIds }) => {
              const isStarred = starredIds.indexOf(event.id) != -1;

              return (
                <Card>
                  <View style={styles.titleHeader}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode={"tail"}
                      style={[dynamicStyles.text, styles.titleFont]}
                    >
                      {title}
                    </Text>
                    <TouchableOpacity
                      style={{ width: "10%" }}
                      onPress={() => toggleStar(event)}
                    >
                      {isStarred ? (
                        <StarOn fill={dynamicStyles.tintColor.color} />
                      ) : (
                        <StarOff
                          fill={
                            dynamicStyles.secondaryBackgroundColor
                              .backgroundColor
                          }
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={"tail"}
                    style={[dynamicStyles.secondaryText, styles.subtitleFont]}
                  >
                    {location}
                    {start} - {end}
                  </Text>

                  <View style={{ flexDirection: "row" }}>
                    <EventTypeView eventType={eventType} />
                    {event.tags &&
                      event.tags.map((tag) => (
                        <Text
                          style={[dynamicStyles.secondaryText, styles.tagFont]}
                        >
                          {tag.name}
                        </Text>
                      ))}
                  </View>
                </Card>
              );
            }}
          </HackathonContext.Consumer>
        )}
      </ThemeContext.Consumer>
    );
  }
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
});
