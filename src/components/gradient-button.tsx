import { TouchableOpacity, Text, StyleSheet, View, Platform } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface GradientButtonProps {
  text: string;
  onPress: () => void;
}

export function GradientButton({ text, onPress }: GradientButtonProps) {
  const theme = useTheme();
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={Platform.OS === 'android' ? 1 : 0.2} needsOffscreenAlphaCompositing={true}>
      <View style={[styles.gradient, { backgroundColor: theme.tintColor }]}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  gradient: {
    width: 280,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'SpaceMono-Regular',
    letterSpacing: 0.005,
    textAlign: 'center',
  },
});
