import React, { useState, useEffect, useContext, useRef } from "react";

import {
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  AppState,
  Text,
} from "react-native";
import { HackathonContext } from "../../state/hackathon";
import WhatsHappeningNow from "../../../assets/images/HappeningNow";
import { ScheduleEventCell } from "./ScheduleEventCell";
import { ScheduleDayView } from "./ScheduleDayView";
import { EventBottomSheet } from "./EventBottomSheet";
import { ThemeContext } from "../../contexts/ThemeContext";
import {
  getEventsHappeningNow,
  getDaysForEvent,
  getCurrentDayIndex,
  getCurrentEventIndex,
} from "../../cms/DataHandler";

export function ScheduleTab(props) {
  const { state } = useContext(HackathonContext);
  const { dynamicStyles } = useContext(ThemeContext);
  const sheetRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsHappeningNow, setEventsHappeningNow] = useState([]);
  console.log('schedule state: ', state)
  useEffect(() => {
    console.log("REFRESHING");
    refreshEventState();

    // update time changes whenever app opens
    AppState.addEventListener("change", (state) => {
      if (state == "active") {
        refreshEventState();
      }
    });
  }, []);

  const refreshEventState = () => {
    const events = state.hackathon.events;
    setEventsHappeningNow(getEventsHappeningNow(events));
  };

  const onPressEvent = (event) => {
    if (event) {
      setSelectedEvent(event);
      console.log("REF", sheetRef);
      sheetRef.current.open();
    } else {
      setSelectedEvent(null);
      sheetRef.current.close();
    }
  };

  let events = state.hackathon.events;
  const hasEventsNow = eventsHappeningNow.length > 0;
  const happeningNowView = (
    <View style={[dynamicStyles.backgroundColor, styles.headerDetail]}>
      <View style={styles.headerContent}>
        <WhatsHappeningNow style={styles.headerText} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={eventsHappeningNow}
          keyExtractor={(item, index) => (item && item.id ? item.id : index)}
          renderItem={({ item }) => {
            console.log("ITEM: ", item);
            return (
              <TouchableOpacity
                style={styles.cardHorizontalParent}
                onPress={() => {
                  onPressEvent(item);
                }}
              >
                <ScheduleEventCell event={item} highlighted truncateText />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );

  if (state.isStarSchedule) {
    events = events.filter((event) => state.starredIds.indexOf(event.id) != -1);
  }

  const daysForEvents = getDaysForEvent(events);
  const currentDayIndex = getCurrentDayIndex(events);
  const initialEventIndex = getCurrentEventIndex(
    events,
    daysForEvents[currentDayIndex]
  );

  if (state.isStarSchedule && state.starredIds.length === 0) {
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
    <View style={[dynamicStyles.backgroundColor, styles.underBackground]}>
      <EventBottomSheet reference={sheetRef} event={selectedEvent} />

      {hasEventsNow ? happeningNowView : null}
      {!hasEventsNow ? <View style={{ height: 10 }} /> : null}
      <ScheduleDayView
        paddingHeight={hasEventsNow ? 160 : 40}
        events={events}
        initialEventIndex={initialEventIndex}
        initialDayIndex={currentDayIndex}
        days={daysForEvents}
        onSelectEvent={onPressEvent}
      />
    </View>
  );
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
