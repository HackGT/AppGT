import React, { Component, createRef } from "react";

import {
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  AppState,
  Text,
} from "react-native";
import { HackathonContext, ThemeContext } from "../context";
import WhatsHappeningNow from "../assets/HappeningNow";
import { ScheduleEventCell } from "./ScheduleEventCell";
import { ScheduleDayView } from "./ScheduleDayView";
import { EventBottomSheet } from "./EventBottomSheet";

import {
  getEventsHappeningNow,
  getDaysForEvent,
  getCurrentDayIndex,
  getCurrentEventIndex,
} from "../cms/DataHandler";

export class ScheduleTab extends Component {
  static contextType = HackathonContext;

  state = {
    selectedEvent: null,
    eventsHappeningNow: [],
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
    const events = this.context.hackathon.events;

    this.setState({
      eventsHappeningNow: getEventsHappeningNow(events),
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

  render() {
    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <HackathonContext.Consumer>
            {({ hackathon, isStarSchedule, starredIds }) => {
              let events = hackathon.events;
              const eventsHappeningNow = this.state.eventsHappeningNow;
              const hasEventsNow = eventsHappeningNow.length > 0;
              const happeningNowView = (
                <View
                  style={[dynamicStyles.backgroundColor, styles.headerDetail]}
                >
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

              if (isStarSchedule) {
                events = events.filter(
                  (event) => starredIds.indexOf(event.id) != -1
                );
              }

              const daysForEvents = getDaysForEvent(events);
              const currentDayIndex = getCurrentDayIndex(events);
              const initialEventIndex = getCurrentEventIndex(
                events,
                daysForEvents[currentDayIndex]
              );

              if (isStarSchedule && starredIds.length === 0) {
                return (
                  <Text
                    style={[
                      dynamicStyles.text,
                      styles.noEventsText,
                      dynamicStyles.backgroundColor,
                    ]}
                  >
                    You have no starred events.
                  </Text>
                );
              } else if (events.length == 0) {
                return (
                  <Text
                    style={[
                      dynamicStyles.text,
                      styles.noEventsText,
                      dynamicStyles.backgroundColor,
                    ]}
                  >
                    No events found.
                  </Text>
                );
              }

              return (
                <View
                  style={[
                    dynamicStyles.backgroundColor,
                    styles.underBackground,
                  ]}
                >
                  <EventBottomSheet
                    reference={(ref) => (this.RBSheet = ref)}
                    event={this.state.selectedEvent}
                  />

                  {hasEventsNow ? happeningNowView : null}
                  {!hasEventsNow ? <View style={{ height: 10 }} /> : null}
                  <ScheduleDayView
                    paddingHeight={hasEventsNow ? 190 : 40}
                    events={events}
                    initialEventIndex={initialEventIndex}
                    initialDayIndex={currentDayIndex}
                    days={daysForEvents}
                    onSelectEvent={this.setSelectedEvent}
                  />
                </View>
              );
            }}
          </HackathonContext.Consumer>
        )}
      </ThemeContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    left: 10,
    top: 6,
  },

  headerDetail: {
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
  },

  noEventsText: {
    fontSize: 14,
    paddingTop: 8,
    textAlign: "center",
    textAlignVertical: "center",
    justifyContent: "center",
    flex: 1,
    fontFamily: "SpaceMono-Regular",
  },
});
