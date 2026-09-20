import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { useContext } from 'react';
import { useRouter } from 'expo-router';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ScheduleTab } from '@/features/schedule/schedule-tab';
import { HackathonContext } from '@/contexts/hackathon-context';
import { HexlabsHeader } from '@/components/hexlabs-header';

export default function SchedulePage() {
  const theme = useTheme();
  const router = useRouter();
  const { state, toggleIsStarSchedule } = useContext(HackathonContext);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <HexlabsHeader
        right={
          <>
            <TouchableOpacity
              onPress={() => toggleIsStarSchedule()}
              style={[styles.toggleBtn, { borderColor: state.isStarSchedule ? theme.tintColor as string : theme.textSecondary as string }]}
              activeOpacity={Platform.OS === 'android' ? 1 : 0.2}
              needsOffscreenAlphaCompositing={true}
            >
              <FontAwesome5
                name="star"
                solid={state.isStarSchedule}
                size={16}
                color={state.isStarSchedule ? theme.tintColor as string : theme.textSecondary as string}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/schedule-search' as any)}
              style={[styles.toggleBtn, { borderColor: theme.textSecondary as string }]}
              activeOpacity={Platform.OS === 'android' ? 1 : 0.2}
              needsOffscreenAlphaCompositing={true}
            >
              <FontAwesome5 name="search" size={16} color={theme.textSecondary as string} />
            </TouchableOpacity>
          </>
        }
      />
      <ScheduleTab />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  toggleBtn: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
