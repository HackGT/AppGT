import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { EventTypeView } from "./EventTypeView";
import { parseDate } from "../cms/DataHandler";
import RBSheet from "react-native-raw-bottom-sheet";
import X from "../assets/X";
import RemoveStarButton from "../assets/RemoveFromCalendarButton";
import AddStarButton from "../assets/AddToCalendarButton";
import { HackathonContext, ThemeContext } from "../context";
import FontMarkdown from "../components/FontMarkdown";
import TagScrollView from "../components/TagScrollView";

export class EventBottomSheet extends Component {
  bottomSheetContent = () => {
    const event = this.props.event;
    const title = event.name;
    const description = event.description;
    const location =
      event != null &&
      event.location != null &&
      event.location[0] != null &&
      event.location[0].name != null
        ? event.location[0].name + " • "
        : "";
    const start = event.startTime;
    const end = event.endTime;
    const eventType =
      event != null && event.type != null ? event.type.name : "none";

    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <HackathonContext.Consumer>
            {({ starredIds }) => {
              const addStarButton = starredIds.indexOf(event.id) == -1;
              const eventTags = event.tags
                ? event.tags.map((tag) => tag.name)
                : [];

              return (
                <View
                  style={[dynamicStyles.tritaryBackgroundColor, styles.panel]}
                >
                  <TouchableOpacity
                    style={styles.panelClose}
                    onPress={() => {
                      this.RBSheet.close();
                    }}
                  >
                    <X
                      fill={
                        dynamicStyles.secondaryBackgroundColor.backgroundColor
                      }
                    />
                  </TouchableOpacity>

                  <Text style={[dynamicStyles.text, styles.panelTitleText]}>
                    {title}
                  </Text>
                  <Text
                    style={[
                      dynamicStyles.secondaryText,
                      styles.locationTimeText,
                    ]}
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

                  <TouchableOpacity
                    style={[
                      dynamicStyles.secondaryBackgroundColor,
                      styles.joinEvent,
                    ]}
                  >
                    <Text style={styles.buttonText}>Join</Text>
                  </TouchableOpacity>

                  <FontMarkdown fontFamily="SpaceMono">
                    {description}
                  </FontMarkdown>

                  <View style={styles.panelButtonCenterRoot}>
                    <HackathonContext.Consumer>
                      {({ toggleStar }) => {
                        return (
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({
                                addStarButton: !toggleStar(this.props.event),
                              })
                            }
                          >
                            {addStarButton ? (
                              <AddStarButton
                                fill={dynamicStyles.tintColor.color}
                              />
                            ) : (
                              <RemoveStarButton />
                            )}
                          </TouchableOpacity>
                        );
                      }}
                    </HackathonContext.Consumer>
                  </View>
                </View>
              );
            }}
          </HackathonContext.Consumer>
        )}
      </ThemeContext.Consumer>
    );
  };

  render() {
    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <RBSheet
            ref={(ref) => {
              this.props.reference(ref);
              this.RBSheet = ref;
            }}
            height={450}
            openDuration={250}
            closeDuration={250}
            closeOnDragDown
            customStyles={{
              container: {
                backgroundColor:
                  dynamicStyles.tritaryBackgroundColor.backgroundColor,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
              draggableIcon: {
                backgroundColor:
                  dynamicStyles.secondaryBackgroundColor.backgroundColor,
              },
            }}
          >
            {this.props.event != null ? this.bottomSheetContent() : null}
          </RBSheet>
        )}
      </ThemeContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  panel: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    flex: 1,
  },

  panelTitleText: {
    fontFamily: "SpaceMono-Bold",
    letterSpacing: 0.05,
    fontSize: 16,
  },

  panelClose: {
    margin: 10,
    right: 0,
    top: -20,
    position: "absolute",
  },

  panelButtonCenterRoot: {
    position: "absolute",
    top: 350,
    left: 0,
    right: 0,
    alignItems: "center",
  },

  panelDescriptionText: {
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.05,
  },

  locationTimeText: {
    marginTop: 2,
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.005,
  },

  tagTextStyle: {
    padding: 7,
    fontFamily: "Space Mono",
  },

  tagStyle: {
    borderRadius: 50,
    marginTop: 15,
    marginLeft: 10,
  },

  tagFont: {
    marginTop: 2,
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.005,
    marginTop: -0.2,
    marginLeft: 8,
  },

  joinEvent: {
    top: 5,
    width: 60,
    borderRadius: 10,
  },

  buttonText: {
    padding: 5,
    textAlign: "center",
    color: "white",
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.005,
  },
});
