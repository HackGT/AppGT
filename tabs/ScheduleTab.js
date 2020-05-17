import React, { Component, createRef } from "react";

import {
  Animated,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { CMSContext } from "../context";
import moment from "moment";
import BottomSheet from "reanimated-bottom-sheet";
import WhatsHappeningNow from "../assets/HappeningNow";
import { ScheduleEventCellVerticle } from "./ScheduleEventCellVerticle";
import { Dimensions } from "react-native";
import { ScheduleDayView } from "./ScheduleDayView";
export class ScheduleTab extends Component {
  bs = createRef();
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

  renderInner = () => (
    <View style={styles.panel}>
      <Text>{JSON.stringify(this.state.selectedEvent)}</Text>
      <TouchableOpacity style={styles.panelButton}>
        <Text style={styles.panelButtonTitle}>✪ Add to Calendar</Text>
      </TouchableOpacity>
    </View>
  );

  renderHeader = () => (
    <View style={styles.panelHeader}>
      <View style={styles.panelPlaceholder} />
      <View style={styles.panelHandle} />
      <TouchableOpacity
        style={styles.panelClose}
        onPress={() => {
          this.setSelectedEvent();
        }}
      >
        <Text>𝗫</Text>
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
          enabledGestureInteraction={false}
        />

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
    top: 10,
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
    paddingHorizontal: 20,
    height: 600,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  panelHeader: {
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    padding: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    height: 35,
  },

  panelPlaceholder: {
    width: 31,
    height: 31,
    borderRadius: 100,
    backgroundColor: "#ffffff",
    marginBottom: 10,
    alignSelf: "center",
  },

  panelHandle: {
    width: 75,
    height: 4,
    borderRadius: 100,
    backgroundColor: "#f2f2f2",
    marginBottom: 10,
    alignSelf: "center",
  },

  panelClose: {
    width: 31,
    height: 31,
    borderRadius: 100,
    backgroundColor: "#f2f2f2",
    marginBottom: 10,
    alignSelf: "center",
    alignItems: "center",
    alignContent: "center",
    padding: 5,
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

  underBackground: {
    backgroundColor: "white",
  },
});
