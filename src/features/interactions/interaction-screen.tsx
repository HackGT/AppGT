import { ScrollView, Text, Pressable, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { ScanScreen } from './scan-screen';
import { getStartEndTime } from '@/lib/util';

interface InteractionScreenProps {
  selectedEvent: any;
}

export function InteractionScreen({ selectedEvent }: InteractionScreenProps) {
  const theme = useTheme();
  const router = useRouter();
  const { startTime, endTime } = getStartEndTime(selectedEvent.startDate, selectedEvent.endDate);
  const location = selectedEvent?.location?.[0]?.name
    ? selectedEvent.location[0].name + ' • '
    : '';

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.background }}>
    <ScrollView style={{ backgroundColor: theme.background }}>
      <View style={styles.eventContainer}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={[styles.backButtontext, { color: theme.text }]}>{'< Back'}</Text>
        </Pressable>

        <Text style={[styles.title, { color: theme.text }]}>{selectedEvent.name}</Text>
        <Text style={[styles.locationTime, { color: theme.textSecondary }]}>
          {location}
          {startTime + ' - ' + endTime}
        </Text>
        <ScanScreen
          eventID={selectedEvent.id}
          startTime={selectedEvent.startTime}
          endTime={selectedEvent.endTime}
          location={location}
          type={selectedEvent.type ?? { name: 'none', color: 'gray' }}
          description={selectedEvent.description}
        />
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'flex-start',
  },
  backButtontext: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 17,
    marginTop: 10,
  },
  title: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 22,
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center',
  },
  locationTime: {
    fontFamily: 'SpaceMono-Bold',
    textAlign: 'center',
    fontSize: 14,
  },
  eventContainer: {
    marginHorizontal: 15,
    flex: 1,
  },
});
