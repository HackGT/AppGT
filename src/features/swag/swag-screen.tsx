import { ScrollView, Text, Pressable, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useTopInset } from '@/hooks/use-top-inset';
import { ScanScreen } from './scan-screen';

interface SwagScreenProps {
  selectedSwagItem: any;
}

export function SwagScreen({ selectedSwagItem }: SwagScreenProps) {
  const theme = useTheme();
  const router = useRouter();
  const topInset = useTopInset();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: topInset }}>
      <View style={[styles.header, { backgroundColor: theme.background }]}>
        <Pressable onPress={() => router.back()} android_ripple={null}>
          <Text style={[styles.backButtonText, { color: theme.text }]}>{'< Back'}</Text>
        </Pressable>
      </View>
      <ScrollView style={{ backgroundColor: theme.background }}>
        <View style={styles.container}>
          <Text style={[styles.title, { color: theme.text }]}>{selectedSwagItem.name}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {selectedSwagItem.points} points
          </Text>
          <ScanScreen swagID={selectedSwagItem.id} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 59,
    paddingTop: 5,
    paddingBottom: 14,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  backButtonText: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 17,
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
  container: {
    marginHorizontal: 15,
    flex: 1,
  },
});
