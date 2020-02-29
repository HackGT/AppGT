import React, { Component, createRef } from "react";

import {
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  AppState,
} from "react-native";
import { CMSContext } from "../context";
import WhatsHappeningNow from "../assets/HappeningNow";
import { ScheduleEventCell } from "./ScheduleEventCell";
import { ScheduleDayView } from "./ScheduleDayView";
import { EventBottomSheet } from "./EventBottomSheet";
import BackToTop from "../assets/ChevronUp";
import {
  getEventsHappeningNow,
  getDaysForEvent,
  getCurrentDayIndex,
  getTimeblocksForDay,
  getCurrentEventIndex,
} from "../cms/DataHandler";

export class ScheduleTab extends Component {
  static contextType = CMSContext;

  state = {
    selectedEvent: null,
    eventsHappenignNow: [],
  };

  componentDidMount() {
    this.refreshEventState();

    // update time changes whenever app opens
    AppState.addEventListener("change", (state) => {
      if (state == "active") {
        this.refreshEventState();
      }
    });
  }

  refreshEventState() {
    const events = this.context.events;

    this.setState({
      eventsHappenignNow: getEventsHappeningNow(events),
    });
  }

  setSelectedEvent = (event) => {
    if (event) {
      this.setState({ selectedEvent: event });
      this.RBSheet.open();
    } else {
      this.setState({ selectedEvent: null });
      this.RBSheet.close();
    }
  };

  scrollToNow() {}

  render() {
    // TODO: only show back to top when needed and scroll to now
    return (
      <CMSContext.Consumer>
        {({ events }) => {
          const eventsHappeningNow = this.state.eventsHappenignNow;

          const hasEventsNow = eventsHappeningNow.length > 0;
          const happeningNowView = (
            <View style={styles.headerDetail}>
              <View style={styles.headerContent}>
                <WhatsHappeningNow style={styles.headerText} />
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  data={eventsHappeningNow}
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
              </View>
            </View>
          );

          const daysForEvents = getDaysForEvent(events);
          const currentDayIndex = getCurrentDayIndex(events);
          const intialEventIndex = getCurrentEventIndex(
            events,
            daysForEvents[currentDayIndex]
          );

          return (
            <View style={styles.underBackground}>
              <EventBottomSheet
                reference={(ref) => (this.RBSheet = ref)}
                event={this.state.selectedEvent}
              />

              {hasEventsNow ? happeningNowView : null}
              {!hasEventsNow ? <View style={{ height: 10 }} /> : null}
              <ScheduleDayView
                paddingHeight={hasEventsNow ? 190 : 40}
                initialEventIndex={intialEventIndex}
                initialDayIndex={currentDayIndex}
                days={daysForEvents}
                onSelectEvent={this.setSelectedEvent}
              />

              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 0,
                  bottom: 0,
                  opacity: hasEventsNow ? 1 : 0,
                }}
                // onPress={} TOOD: on press send to the current event, only show if what's happening now is not 0
              >
                <BackToTop />
              </TouchableOpacity>
            </View>
          );
        }}
      </CMSContext.Consumer>
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
