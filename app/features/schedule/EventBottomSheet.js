import React, { useEffect, useContext, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import { EventTypeView } from "./EventTypeView";
import RBSheet from "react-native-raw-bottom-sheet";
import X from "../../../assets/images/X";
import RemoveStarButton from "../../../assets/images/RemoveFromCalendarButton";
import AddStarButton from "../../../assets/images/AddToCalendarButton";
import { HackathonContext } from "../../state/hackathon";
import FontMarkdown from "../../components/FontMarkdown";
import { Linking } from "react-native";
import { ThemeContext } from "../../contexts/ThemeContext";
import { getStartEndTime } from "../../util";

const SHEET_HEIGHT = 450;

export function EventBottomSheet(props) {
  const { state, toggleStar } = useContext(HackathonContext);
  const [addStarButton, setAddStarButton] = useState(
    props.event ? state.starredIds.indexOf(props.event.id) == -1 : true
  );
  useEffect(() => {
    setAddStarButton(
      props.event ? state.starredIds.indexOf(props.event.id) == -1 : false
    );
  });
  const bottomSheetContent = () => {
    const event = props.event;
    const title = event.name;
    const description = event.description;
    const { startTime, endTime } = getStartEndTime(event.startDate, event.endDate)
    const location =
      event != null &&
      event.location != null &&
      event.location[0] != null &&
      event.location[0].name != null
        ? event.location[0].name + " • "
        : "";
    const start = startTime;
    const end = endTime;
    const eventType = event.type ?? 'none'

    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => {
          const eventTags = event.tags ? event.tags.map((tag) => tag.name) : [];

          return (
            <View style={[dynamicStyles.tritaryBackgroundColor, styles.panel]}>
              <TouchableOpacity
                style={styles.panelClose}
                onPress={() => {
                  props.reference.current.close();
                }}
              >
                <X
                  fill={dynamicStyles.secondaryBackgroundColor.backgroundColor}
                />
              </TouchableOpacity>

              <Text style={[dynamicStyles.text, styles.panelTitleText]}>
                {title}
              </Text>
              <Text
                style={[dynamicStyles.secondaryText, styles.locationTimeText]}
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

              {!event.url ? null : (
                <TouchableOpacity
                  style={[
                    dynamicStyles.secondaryBackgroundColor,
                    styles.joinEvent,
                  ]}
                  onPress={() => Linking.openURL(event.url)}
                >
                  <Text style={[dynamicStyles.text, styles.buttonText]}>
                    Join
                  </Text>
                </TouchableOpacity>
              )}
                <FontMarkdown fontFamily="SpaceMono">{description}</FontMarkdown>

              <View style={styles.panelButtonCenterRoot}>
                <TouchableOpacity
                  onPress={() => {
                    setAddStarButton(!addStarButton);
                    toggleStar(props.event);
                  }}
                >
                  {addStarButton ? (
                    <AddStarButton fill={dynamicStyles.tintColor.color} />
                  ) : (
                    <RemoveStarButton />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      </ThemeContext.Consumer>
    );
  };

  return (
    <ThemeContext.Consumer>
      {({ dynamicStyles }) => (
        <RBSheet
          ref={props.reference}
          height={SHEET_HEIGHT}
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
          {props.event != null ? bottomSheetContent() : null}
        </RBSheet>
      )}
    </ThemeContext.Consumer>
  );
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
    padding: 10,
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
    fontFamily: "SpaceMono-Regular",
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
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.005,
  },
});
