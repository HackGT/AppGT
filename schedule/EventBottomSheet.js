import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { EventTypeView } from "./EventTypeView";
import { parseDate } from "../cms/DataHandler";
import RBSheet from "react-native-raw-bottom-sheet";
import X from "../assets/X";
import RemoveStarButton from "../assets/RemoveFromCalendarButton";
import AddStarButton from "../assets/AddToCalendarButton";
import { HackathonContext } from "../context";
import FontMarkdown from "../components/FontMarkdown";

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
      <HackathonContext.Consumer>
        {({ starredIds }) => {
          const addStarButton = starredIds.indexOf(event.id) == -1;

          return (
            <View style={styles.panel}>
              <TouchableOpacity
                style={styles.panelClose}
                onPress={() => {
                  this.RBSheet.close();
                }}
              >
                <X />
              </TouchableOpacity>

              <Text style={styles.panelTitleText}>{title}</Text>
              <Text style={styles.locationTimeText}>
                {location}
                {start} - {end}
              </Text>

              <EventTypeView eventType={eventType} />

              <FontMarkdown fontFamily="SpaceMono">{description}</FontMarkdown>

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
                          <AddStarButton />
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
    );
  };

  render() {
    return (
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
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
      >
        {this.props.event != null ? this.bottomSheetContent() : null}
      </RBSheet>
    );
  }
}

const styles = StyleSheet.create({
  panel: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    backgroundColor: "white",
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
    color: "#4F4F4F",
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.005,
  },
});
