import React, { Component, createRef } from "react";

import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Modal,
} from "react-native";
import { CMSContext } from "../context";
import moment from "moment";
import BottomSheet from "reanimated-bottom-sheet";
import WhatsHappeningNow from "../assets/HappeningNow";
import { ScheduleEventCellVerticle } from "./ScheduleEventCellVerticle";
import { ScheduleDayView } from "./ScheduleDayView";
import X from "../assets/X";
import Svg, { Circle } from "react-native-svg";
import RBSheet from "react-native-raw-bottom-sheet";

export class ScheduleTab extends Component {
  state = {
    selectedEvent: null,
  };

  parse_date = (t) => {
    // parse iso-formatted string as local time
    if (!t) return "";
    let localString = t;
    if (t.slice(-1).toLowerCase() === "z") {
      localString = t.slice(0, -1);
    }
    return moment(localString);
  };

  setSelectedEvent = (event) => {
    if (event) {
      this.setState({ selectedEvent: event });
      this.RBSheet.open();
    } else {
      this.setState({ selectedEvent: null });
      this.RBSheet.close();
    }
  };

  parseDate = (date) => {
    // parse iso-formatted string as local time
    if (!date) return "";
    let localString = date;
    if (date.slice(-1).toLowerCase() === "z") {
      localString = date.slice(0, -1);
    }
    return moment(localString);
  };

  renderInner = () => {
    if (this.state.selectedEvent != null) {
      // TODO: this should be shared with a CMS data object
      const event = this.state.selectedEvent;
      const title = event.title;
      const description = event.description;
      const location = event.area != null ? event.area.name + " • " : "";
      const start = this.parseDate(event.start_time).format("hh:mm A");
      const end = this.parseDate(event.end_time).format("hh:mm A");
      const isStarred = event.isStarred;
      const colors = ["#2CDACF", "#C866F5", "#786CEB", "#FF586C", "#FF8D28"];
      const radius = 6;
      const size = radius * 2;
      const categoryColor = colors[Math.floor(Math.random() * colors.length)];

      return (
        <View style={styles.panel}>
          <TouchableOpacity
            style={styles.panelClose}
            onPress={() => {
              this.setSelectedEvent();
            }}
          >
            <X />
          </TouchableOpacity>
          <Text style={styles.panelTitleText}>{title}</Text>
          <Text
            style={{
              marginTop: 2,
              color: "#4F4F4F",
              fontFamily: "SpaceMono-Regular",
              letterSpacing: 0.005,
            }}
          >
            {location}
            {start} - {end}
          </Text>

          <View flexDirection="row" style={styles.footer}>
            <Svg height={size} width={size} style={{ top: 5 }}>
              <Circle cx={radius} cy={radius} r={radius} fill={categoryColor} />
            </Svg>
            <Text
              style={{
                marginLeft: 7,
                color: categoryColor,
                fontFamily: "SpaceMono-Regular",
              }}
            >
              food
            </Text>
          </View>

          <Text style={styles.panelDescriptionText}>{description}</Text>

          <View style={styles.panelButtonCenterRoot}>
            <TouchableOpacity style={styles.panelButton}>
              <Text style={styles.panelButtonTitle}>Add to Calendar</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  render() {
    return (
      <View style={styles.underBackground}>
        <RBSheet
          ref={(ref) => {
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
          {this.renderInner()}
        </RBSheet>

        <View style={styles.headerDetail}>
          <View style={styles.headerContent}>
            <WhatsHappeningNow style={styles.headerText} />
            <CMSContext.Consumer>
              {({ events }) => {
                return (
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={events}
                    keyExtractor={({ item }) => item}
                    renderItem={({ item }) => {
                      return (
                        <TouchableOpacity
                          style={styles.cardHorizontalParent}
                          onPress={() => {
                            this.setSelectedEvent(item);
                          }}
                        >
                          <ScheduleEventCellVerticle event={item} highlighted />
                        </TouchableOpacity>
                      );
                    }}
                  />
                );
              }}
            </CMSContext.Consumer>
          </View>
        </View>

        <ScheduleDayView onSelectEvent={this.setSelectedEvent} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    left: 10,
    top: 6,
  },

  headerDetail: {
    backgroundColor: "white",
    height: 160,
  },

  headerContent: {
    top: 10,
  },

  headerHorizontalScroll: {
    marginLeft: 5,
    marginTop: 5,
  },

  cardHorizontalParent: {
    width: 300,
    left: 5,
    marginRight: 8,
    marginTop: 15,
  },

  cardItem: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    height: 100,
    borderColor: "#41D1FF",
    borderWidth: 1.2,
    borderRadius: 8,
  },

  panel: {
    padding: 20,
    height: 600,
    backgroundColor: "white",
    flex: 1,
  },

  panelClose: {
    margin: 10,
    right: 0,
    top: -20,
    position: "absolute",
  },

  panelButtonCenterRoot: {
    position: "absolute",
    backgroundColor: "red",
    left: 0,
    right: 0,
    bottom: 30,
    alignItems: "center",
  },

  panelButton: {
    borderRadius: 5,
    backgroundColor: "#41d1ff",
    alignItems: "center",
    justifyContent: "center",
    height: 42,
    width: 335,
  },

  panelButtonTitle: {
    fontSize: 17,
    color: "white",
    fontFamily: "SpaceMono-Bold",
    letterSpacing: 0.05,
  },

  panelTitleText: {
    fontFamily: "SpaceMono-Bold",
    letterSpacing: 0.05,
    fontSize: 16,
  },

  panelDescriptionText: {
    fontFamily: "SpaceMono-Regular",
    letterSpacing: 0.05,
  },

  underBackground: {
    flex: 1,
    backgroundColor: "#2F2F2f",
  },
});
