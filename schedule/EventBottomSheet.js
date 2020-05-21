import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { EventTypeView } from "./EventTypeView";
import { parseDate } from "../cms/DataHandler";
import RBSheet from "react-native-raw-bottom-sheet";
import X from "../assets/X";
import RemoveStarButton from "../assets/RemoveFromCalendarButton";
import AddStarButton from "../assets/AddToCalendarButton";
import { CMSContext } from "../context";

export class EventBottomSheet extends Component {
  bottomSheetContent = () => {
    const event = this.props.event;
    const title = event.title;
    const description = event.description;
    const location = event.area != null ? event.area.name + " • " : "";
    const start = parseDate(event.start_time).format("hh:mm A");
    const end = parseDate(event.end_time).format("hh:mm A");
    const isStarred = event.isStarred;

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

        <EventTypeView eventType="food" />

        <Text style={styles.panelDescriptionText}>{description}</Text>

        <View style={styles.panelButtonCenterRoot}>
          <CMSContext.Consumer>
            {({ toggleStar }) => {
              return (
                <TouchableOpacity onPress={() => toggleStar(this.props.event)}>
                  {isStarred ? <RemoveStarButton /> : <AddStarButton />}
                </TouchableOpacity>
              );
            }}
          </CMSContext.Consumer>
        </View>
      </View>
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
        openDuration={400}
        closeDuration={300}
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
    padding: 20,
    height: 600,
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
    left: 0,
    right: 0,
    bottom: 30,
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
