import React, { Component, createRef } from "react";

import { TouchableOpacity, View, StyleSheet, FlatList } from "react-native";
import { CMSContext } from "../context";
import WhatsHappeningNow from "../assets/HappeningNow";
import { ScheduleEventCell } from "./ScheduleEventCell";
import { ScheduleDayView } from "./ScheduleDayView";
import { EventBottomSheet } from "./EventBottomSheet";

export class ScheduleTab extends Component {
  state = {
    selectedEvent: null,
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

  render() {
    return (
      <View style={styles.underBackground}>
        <EventBottomSheet
          reference={(ref) => (this.RBSheet = ref)}
          event={this.state.selectedEvent}
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
                    keyExtractor={(item, index) =>
                      item && item.id ? item.id : index
                    }
                    renderItem={({ item }) => {
                      return (
                        <TouchableOpacity
                          style={styles.cardHorizontalParent}
                          onPress={() => {
                            this.setSelectedEvent(item);
                          }}
                        >
                          <ScheduleEventCell event={item} highlighted />
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

  cardHorizontalParent: {
    width: 300,
    left: 5,
    marginRight: 8,
    marginTop: 15,
  },

  underBackground: {
    flex: 1,
    backgroundColor: "white",
  },
});
