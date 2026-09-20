import { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { HackathonContext } from '@/contexts/hackathon-context';
import { Card } from '@/components/card';
import { EventTypeView } from './event-type-view';
import { getStartEndTime } from '@/lib/util';

interface ScheduleEventCellProps {
  event: any;
  highlighted?: boolean;
  truncateText?: boolean;
}

export function ScheduleEventCell({ event, highlighted, truncateText }: ScheduleEventCellProps) {
  const { state, toggleStar } = useContext(HackathonContext);
  const theme = useTheme();

  const eventType = event.type ?? 'none';
  const title = event.name;
  const { startTime, endTime } = getStartEndTime(event.startDate, event.endDate);
  const location =
    event?.location?.[0]?.name ? event.location[0].name + ' • ' : '';

  const isStarred = state.starredIds.includes(event.id);

  return (
    <Card highlighted={highlighted}>
      <View style={styles.titleHeader}>
        <Text
          numberOfLines={truncateText ? 1 : undefined}
          ellipsizeMode="tail"
          style={[styles.titleFont, { color: theme.text }]}
        >
          {title}
        </Text>
        <TouchableOpacity style={{ width: '10%' }} onPress={() => toggleStar(event)} activeOpacity={Platform.OS === 'android' ? 1 : 0.2} needsOffscreenAlphaCompositing={true}>
          <Text style={{ color: isStarred ? theme.tintColor : theme.textSecondary, fontSize: 18 }}>
            {isStarred ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        numberOfLines={truncateText ? 1 : undefined}
        ellipsizeMode="tail"
        style={[styles.subtitleFont, { color: theme.textSecondary }]}
      >
        {location}
        {startTime} - {endTime}
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
        <EventTypeView eventType={eventType} />
        {event.tags &&
          event.tags.map((tag: any) => (
            <Text key={tag.name} style={[styles.tagFont, { color: theme.textSecondary }]}>
              {tag.name}
            </Text>
          ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  titleHeader: {
    flexDirection: 'row',
    width: '100%',
  },
  titleFont: {
    fontSize: 16,
    width: '90%',
    fontFamily: 'SpaceMono-Bold',
    letterSpacing: 0.005,
    marginRight: 10,
  },
  subtitleFont: {
    marginTop: 2,
    fontFamily: 'SpaceMono-Regular',
    letterSpacing: 0.005,
  },
  tagFont: {
    marginTop: 2,
    fontFamily: 'SpaceMono-Regular',
    letterSpacing: 0.005,
    marginLeft: 8,
  },
});
