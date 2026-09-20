import { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, FlatList, AppState, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { HackathonContext } from '@/contexts/hackathon-context';
import { ScheduleEventCell } from './schedule-event-cell';
import { ScheduleDayView } from './schedule-day-view';
import { EventBottomSheet } from './event-bottom-sheet';
import {
  getEventsHappeningNow,
  getDaysForEvent,
  getCurrentDayIndex,
  getCurrentEventIndex,
} from '@/lib/util';

export function ScheduleTab() {
  const { state } = useContext(HackathonContext);
  const theme = useTheme();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [eventsHappeningNow, setEventsHappeningNow] = useState<any[]>([]);

  useEffect(() => {
    refreshEventState();
    const sub = AppState.addEventListener('change', (appState) => {
      if (appState === 'active') refreshEventState();
    });
    return () => sub.remove();
  }, []);

  const refreshEventState = () => {
    const events = state.hackathon?.events ?? [];
    setEventsHappeningNow(getEventsHappeningNow(events));
  };

  const onPressEvent = (event: any) => {
    if (event) {
      setSelectedEvent(event);
      setSheetVisible(true);
    } else {
      setSelectedEvent(null);
      setSheetVisible(false);
    }
  };

  let events = state.hackathon?.events ?? [];
  const hasEventsNow = eventsHappeningNow.length > 0;

  if (state.isStarSchedule) {
    events = events.filter((event: any) => state.starredIds.includes(event.id));
  }

  const daysForEvents = getDaysForEvent(events);
  const currentDayIndex = getCurrentDayIndex(events);
  const initialEventIndex = getCurrentEventIndex(events, daysForEvents[currentDayIndex]);

  if (state.isStarSchedule && state.starredIds.length === 0) {
    return (
      <Text style={[styles.noEventsText, { color: theme.text, backgroundColor: theme.background }]}>
        You have no starred events.
      </Text>
    );
  }

  if (events.length === 0) {
    return (
      <Text style={[styles.noEventsText, { color: theme.text, backgroundColor: theme.background }]}>
        No events found.
      </Text>
    );
  }

  const happeningNowView = (
    <View style={[{ backgroundColor: theme.background }, styles.headerDetail]}>
      <View style={styles.headerContent}>
        <Text style={[styles.happeningNowText, { color: theme.tintColor }]}>
          What's Happening Now
        </Text>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={eventsHappeningNow}
          keyExtractor={(item, index) => item?.id ?? String(index)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.cardHorizontalParent}
              onPress={() => onPressEvent(item)}
              activeOpacity={Platform.OS === 'android' ? 1 : 0.2}
              needsOffscreenAlphaCompositing={true}
            >
              <ScheduleEventCell event={item} highlighted truncateText />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );

  return (
    <View style={[{ backgroundColor: theme.background }, styles.underBackground]}>
      <EventBottomSheet
        visible={sheetVisible}
        event={selectedEvent}
        onClose={() => setSheetVisible(false)}
      />
      {hasEventsNow ? happeningNowView : <View style={{ height: 10 }} />}
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
  headerDetail: {
    height: 160,
  },
  headerContent: {
    top: 10,
  },
  happeningNowText: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 14,
    marginLeft: 10,
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
    textAlign: 'center',
    flex: 1,
    fontFamily: 'SpaceMono-Regular',
  },
});
