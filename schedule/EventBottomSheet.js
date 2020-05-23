import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { EventTypeView } from "./EventTypeView";
import { parseDate } from "../cms/DataHandler";
import RBSheet from "react-native-raw-bottom-sheet";
import X from "../assets/X";
import RemoveStarButton from "../assets/RemoveFromCalendarButton";
import AddStarButton from "../assets/AddToCalendarButton";
import { CMSContext } from "../context";
import Markdown from "react-native-markdown-renderer";

export class EventBottomSheet extends Component {
  constructor(props) {
    super(props);
  }

  bottomSheetContent = () => {
    const event = this.props.event;
    const title = event.title;
    const description = event.description;
    const location = event.area != null ? event.area.name + " • " : "";
    const start = parseDate(event.start_time).format("hh:mm A");
    const end = parseDate(event.end_time).format("hh:mm A");
    const addStarButton =
      this.props.event.isStarred != null ? !this.props.event.isStarred : true;

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

        <Markdown style={markdownStyles}>{description}</Markdown>

        <View style={styles.panelButtonCenterRoot}>
          <CMSContext.Consumer>
            {({ toggleStar }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      addStarButton: !toggleStar(this.props.event),
                    })
                  }
                >
                  {addStarButton ? <AddStarButton /> : <RemoveStarButton />}
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
    paddingLeft: 20,
    paddingRight: 20,
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

const markdownStyles = StyleSheet.create({
  em: {
    fontStyle: "italic",
    fontFamily: "SpaceMono-Italic",
  },
  heading1: {
    fontSize: 32,
    fontFamily: "SpaceMono-Regular",
  },
  heading2: {
    fontSize: 24,
    fontFamily: "SpaceMono-Regular",
  },
  heading3: {
    fontSize: 18,
    fontFamily: "SpaceMono-Regular",
  },
  heading4: {
    fontSize: 16,
    fontFamily: "SpaceMono-Regular",
  },
  heading5: {
    fontSize: 13,
    fontFamily: "SpaceMono-Regular",
  },
  heading6: {
    fontSize: 11,
    fontFamily: "SpaceMono-Regular",
  },
  hr: {
    backgroundColor: "#000000",
    height: 1,
    fontFamily: "SpaceMono-Regular",
  },
  listItem: {
    flex: 1,
    flexWrap: "wrap",
    fontFamily: "SpaceMono-Regular",
  },
  listUnordered: {},

  listUnorderedItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    fontFamily: "SpaceMono-Regular",
  },
  listUnorderedItemText: {
    fontSize: 20,
    lineHeight: 20,
    fontFamily: "SpaceMono-Regular",
  },
  listOrderedItem: {
    flexDirection: "row",
    fontFamily: "SpaceMono-Regular",
  },
  listOrderedItemText: {
    fontWeight: "bold",
    lineHeight: 20,
    fontFamily: "SpaceMono-Regular",
  },
  paragraph: {
    marginTop: 10,
    marginBottom: 10,
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    fontFamily: "SpaceMono-Regular",
  },
  strong: {
    fontFamily: "SpaceMono-Bold",
  },
  text: {
    fontFamily: "SpaceMono-Regular",
  },
  strikethrough: {
    textDecorationLine: "line-through",
    fontFamily: "SpaceMono-Regular",
  },
  link: {
    textDecorationLine: "underline",
    fontFamily: "SpaceMono-Regular",
  },
  blocklink: {
    flex: 1,
    borderColor: "#000000",
    borderBottomWidth: 1,
    fontFamily: "SpaceMono-Regular",
  },
  u: {
    borderColor: "#000000",
    borderBottomWidth: 1,
    fontFamily: "SpaceMono-Regular",
  },
});
