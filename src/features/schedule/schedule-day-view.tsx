import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Platform } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ScheduleEventCell } from './schedule-event-cell';
import { getTimeblocksForDay, isEventHappeningNow } from '@/lib/util';

interface ScheduleDayViewProps {
  events: any[];
  days: string[];
  initialDayIndex: number;
  initialEventIndex: number;
  paddingHeight: number;
  onSelectEvent: (event: any) => void;
}

export function ScheduleDayView({
  events,
  days,
  initialDayIndex,
  initialEventIndex,
  paddingHeight,
  onSelectEvent,
}: ScheduleDayViewProps) {
  const theme = useTheme();
  const initDayIndex = initialDayIndex === -1 ? 0 : initialDayIndex;
  const [dayIndex, setDayIndex] = useState(initDayIndex);

  const scrollRef = useRef<ScrollView>(null);

  const width = Dimensions.get('window').width;

  const tabContent = (day: string) => {
    const timeblocks = getTimeblocksForDay(events, day);
    const radius = 7;

    return (
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: paddingHeight }}
      >
        {timeblocks.map((item, index) => {
          if (!item) return null;

          const isHappeningNow = isEventHappeningNow(item);
          const highlighted = isHappeningNow;
          const highlightColor = highlighted ? theme.tintColor as string : theme.backgroundElement as string;

          if (item.time) {
            return (
              <View key={'' + index} style={{ flexDirection: 'row', height: 40 }}>
                <View style={styles.circleParent}>
                  <View style={{ width: radius * 2, height: radius * 2, borderRadius: radius, backgroundColor: highlightColor }} />
                </View>
                <View style={[styles.timeParent, { backgroundColor: theme.backgroundElement as string }]}>
                  <Text style={[styles.timeText, { color: theme.text as string }]}>{item.time}</Text>
                </View>
              </View>
            );
          }

          return (
            <View key={item.id ?? index} style={{ flexDirection: 'row' }}>
              <View style={[styles.lineParent, { backgroundColor: theme.background as string }]}>
                <View style={{ width: 1.5, flex: 1, backgroundColor: highlightColor }} />
              </View>
              <TouchableOpacity style={styles.cardParent} onPress={() => onSelectEvent(item)} activeOpacity={Platform.OS === 'android' ? 1 : 0.2} needsOffscreenAlphaCompositing={true}>
                <ScheduleEventCell event={item} highlighted={highlighted} />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  const dayTabView = () => (
    <View style={{ backgroundColor: theme.background }}>
      <View style={[styles.daysParent, { flexDirection: 'row' }]}>
        {days.map((dayString, i) => {
          const isHighlight = dayIndex === i;
          const label = dayString.charAt(0).toUpperCase() + dayString.slice(1);
          const underlineWidth = (width * 0.9) / days.length;

          return (
            <TouchableOpacity
              key={i}
              onPress={() => {
                setDayIndex(i);
              }}
              activeOpacity={Platform.OS === 'android' ? 1 : 0.2}
              needsOffscreenAlphaCompositing={true}
            >
              <Text
                style={{
                  fontFamily: 'SpaceMono-Bold',
                  fontSize: 16,
                  color: isHighlight ? theme.tintColor : theme.textSecondary,
                  textAlign: 'center',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                }}
              >
                {label}
              </Text>
              <View
                style={{
                  height: 3,
                  width: underlineWidth,
                  backgroundColor: isHighlight ? theme.tintColor : theme.backgroundElement,
                  alignSelf: 'center',
                  marginTop: 4,
                  marginBottom: 8,
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const backToTopButton = () => {
    const shouldShow = dayIndex === initialDayIndex && initialEventIndex !== -1;
    if (!shouldShow) return null;
    return (
      <TouchableOpacity
        style={{ position: 'absolute', right: 0, bottom: paddingHeight + 30 }}
        onPress={() => scrollRef.current?.scrollTo({ y: initialEventIndex * 80, animated: true })}
        activeOpacity={Platform.OS === 'android' ? 1 : 0.2}
        needsOffscreenAlphaCompositing={true}
      >
        <Text style={{ color: theme.tintColor, fontSize: 24, paddingRight: 8 }}>⬆</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {dayTabView()}
      {tabContent(days[dayIndex])}
      {backToTopButton()}
    </View>
  );
}

const styles = StyleSheet.create({
  cardParent: {
    padding: 8,
    flex: 1,
    borderRadius: 8,
  },
  circleParent: {
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeParent: {
    height: '80%',
    top: 5,
    width: 90,
    borderRadius: 8,
  },
  timeText: {
    padding: 5,
    textAlign: 'center',
    fontFamily: 'SpaceMono-Regular',
  },
  lineParent: {
    width: 36,
    alignItems: 'center',
  },
  daysParent: {
    marginTop: 2,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
