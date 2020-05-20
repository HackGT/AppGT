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
import Animated from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

export class ScheduleTab extends Component {
  bs = createRef();
  fall = new Animated.Value(1);

  static navigationOptions = {
    title: "Welcome",
  };

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
      this.bs.current.snapTo(1);
      this.bs.current.snapTo(1);
    } else {
      this.setState({ selectedEvent: null });
      this.bs.current.snapTo(0);
      this.bs.current.snapTo(0);
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
          <TouchableOpacity style={styles.panelButton}>
            <Text style={styles.panelButtonTitle}>Add to Calendar</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  renderHeader = () => (
    <View>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
      <TouchableOpacity
        style={styles.panelClose}
        onPress={() => {
          this.setSelectedEvent();
        }}
      >
        <X />
      </TouchableOpacity>
    </View>
  );

  render() {
    return (
      <View style={styles.underBackground}>
        <BottomSheet
          ref={this.bs}
          snapPoints={[0, 450]}
          renderContent={this.renderInner}
          renderHeader={this.renderHeader}
          initialSnap={0}
          enabledInnerScrolling={false}
          overdragResistanceFactor={8}
          callbackNode={this.fall}
        />

        <Animated.View
          style={{
            alignItems: "center",
            opacity: Animated.add(0.1, Animated.multiply(this.fall, 0.9)),
          }}
        >
          <View
            pointerEvents={
              this.state.selectedEvent != null
                ? Platform.OS === "android"
                  ? "none"
                  : this.pointerEvents
                : "auto"
            }
          >
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
                              <ScheduleEventCellVerticle
                                event={item}
                                highlighted
                              />
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
        </Animated.View>
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
  },

  panelHeader: {
    backgroundColor: "white",
    shadowColor: "white",
    padding: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 35,
  },

  panelHandle: {
    width: 75,
    height: 4,
    borderRadius: 100,
    backgroundColor: "#f2f2f2",
    marginBottom: 10,
    top: 5,
  },

  panelClose: {
    margin: 10,
    right: 0,
    position: "absolute",
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
    fontWeight: "bold",
    color: "white",
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
