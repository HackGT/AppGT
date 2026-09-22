import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Touchable } from '@/components/touchable';

interface HackathonErrorScreenProps {
  onRetry: () => void;
  errorMessage?: string;
}

export function HackathonErrorScreen({ onRetry, errorMessage }: HackathonErrorScreenProps) {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FontAwesome5 name="exclamation-circle" size={48} color={theme.textSecondary} />
      <Text style={[styles.title, { color: theme.text }]}>Something went wrong</Text>
      <Text style={[styles.body, { color: theme.textSecondary }]}>
        {errorMessage || "Could not load hackathon data. Check your connection and try again."}
      </Text>
      <Touchable onPress={onRetry} style={[styles.button, { backgroundColor: theme.tintColor }]}>
        <Text style={styles.buttonText}>Retry</Text>
      </Touchable>
    </View>
  );
}

export function HackathonLoadingScreen() {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ActivityIndicator size="large" color={theme.tintColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  title: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 20,
    textAlign: 'center',
  },
  body: {
    fontFamily: 'SpaceMono-Regular',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginTop: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 16,
    color: 'white',
  },
});
