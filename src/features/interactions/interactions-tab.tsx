import { useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { HackathonContext } from '@/contexts/hackathon-context';
import { EventCard } from './event-card';
import { getStartEndTime } from '@/lib/util';
import { SearchBar } from '@/components/search-bar';

const CHECK_IN_EVENT_ID = '68c049a6a2c57dfa55eb80d3';

export function InteractionsTab() {
  const theme = useTheme();
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const hackathonContext = useContext(HackathonContext);
  const hackathon = hackathonContext.state.hackathon;
  const events = hackathon?.events ?? [];

  const onPressEvent = (event: any) => {
    if (event.id === CHECK_IN_EVENT_ID) {
      router.navigate('/check-in' as any);
      return;
    }
    router.push({
      pathname: '/interaction-screen' as any,
      params: { selectedEvent: JSON.stringify(event) },
    });
  };

  const formattedEvents = events
    .filter((e: any) => e.name.toLowerCase().includes(searchText.toLowerCase()))
    .map((event: any) => {
      const eventType = event.type ?? 'none';
      const location = event?.location?.[0]?.name ? event.location[0].name + ' • ' : '';
      const { startTime, endTime } = getStartEndTime(event.startDate, event.endDate);
      return (
        <TouchableOpacity key={event.id} onPress={() => onPressEvent(event)} activeOpacity={Platform.OS === 'android' ? 1 : 0.2} needsOffscreenAlphaCompositing={true}>
          <EventCard
            name={event.name}
            startTime={startTime}
            endTime={endTime}
            location={location}
            type={eventType}
          />
        </TouchableOpacity>
      );
    });

  return (
    <View style={[{ backgroundColor: theme.background, flex: 1 }]}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: theme.text }]}>Event Scanning</Text>
        <Text style={[styles.headerHelpText, { color: theme.textSecondary }]}>
          Use this page to scan each person's badge before every event. If you can't scan a badge,
          scan their QR code from registration/mobile app instead.
        </Text>
        <SearchBar
          placeholder="Search..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView>
        <View style={styles.eventCardContainer}>{formattedEvents}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    marginBottom: 5,
  },
  headerText: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 22,
    marginHorizontal: 15,
  },
  headerHelpText: {
    marginHorizontal: 15,
    fontFamily: 'SpaceMono-Bold',
    marginTop: 5,
  },
  eventCardContainer: {
    marginHorizontal: 15,
    flex: 1,
    paddingTop: 5,
  },
});
