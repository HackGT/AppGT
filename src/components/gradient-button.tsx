import { Text, StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Touchable } from '@/components/touchable';

interface GradientButtonProps {
  text: string;
  onPress: () => void;
}

export function GradientButton({ text, onPress }: GradientButtonProps) {
  const theme = useTheme();
  return (
    <Touchable style={styles.button} onPress={onPress}>
      <View style={[styles.gradient, { backgroundColor: theme.tintColor }]}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </Touchable>
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
