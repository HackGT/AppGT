import { ScrollView, Text, Pressable, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { ScanScreen } from './scan-screen';

interface SwagScreenProps {
  selectedSwagItem: any;
}

export function SwagScreen({ selectedSwagItem }: SwagScreenProps) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: theme.background }}>
    <ScrollView style={{ backgroundColor: theme.background }}>
      <View style={styles.swagContainer}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={[styles.backButtontext, { color: theme.text }]}>{'< Back'}</Text>
        </Pressable>

        <Text style={[styles.title, { color: theme.text }]}>{selectedSwagItem.name}</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {selectedSwagItem.points} points
        </Text>
        <ScanScreen swagID={selectedSwagItem.id} />
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
  subtitle: {
    fontFamily: 'SpaceMono-Bold',
    textAlign: 'center',
    fontSize: 14,
  },
  swagContainer: {
    marginHorizontal: 15,
    flex: 1,
  },
});
