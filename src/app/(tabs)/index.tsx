import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { useContext } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { ScheduleTab } from '@/features/schedule/schedule-tab';
import { HackathonContext } from '@/contexts/hackathon-context';
import { HexlabsHeader } from '@/components/hexlabs-header';
import { Touchable } from '@/components/touchable';
import { useTopInset } from '@/hooks/use-top-inset';

export default function SchedulePage() {
  const theme = useTheme();
  const router = useRouter();
  const { state, toggleIsStarSchedule } = useContext(HackathonContext);
  const topInset = useTopInset();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: topInset }}>
      <HexlabsHeader
        right={
          <>
            <Touchable
              onPress={() => toggleIsStarSchedule()}
              style={[styles.toggleBtn, { borderColor: state.isStarSchedule ? theme.tintColor as string : theme.textSecondary as string }]}
            >
              <FontAwesome5
                name="star"
                solid={state.isStarSchedule}
                size={16}
                color={state.isStarSchedule ? theme.tintColor as string : theme.textSecondary as string}
              />
            </Touchable>
            <Touchable
              onPress={() => router.push('/schedule-search' as any)}
              style={[styles.toggleBtn, { borderColor: theme.textSecondary as string }]}
            >
              <FontAwesome5 name="search" size={16} color={theme.textSecondary as string} />
            </Touchable>
          </>
        }
      />
      <ScheduleTab />
    </View>
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
