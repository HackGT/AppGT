import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

export type CheckoutType = 'hardware' | 'swag';

const OPTIONS: { value: CheckoutType; label: string }[] = [
  { value: 'hardware', label: 'Hardware' },
  { value: 'swag', label: 'Swag' },
];

interface CheckoutRadioProps {
  value: CheckoutType;
  onChange: (value: CheckoutType) => void;
  disabled?: boolean;
}

export function CheckoutRadio({ value, onChange, disabled }: CheckoutRadioProps) {
  const theme = useTheme();

  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {OPTIONS.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled }}
            disabled={disabled}
            onPress={() => onChange(option.value)}
            style={[
              styles.option,
              {
                backgroundColor: selected ? theme.backgroundSelected : theme.backgroundElement,
                borderColor: selected ? theme.tintColor : theme.borderColor,
              },
            ]}
          >
            <View style={[styles.outer, { borderColor: selected ? theme.tintColor : theme.textSecondary }]}>
              {selected && <View style={[styles.inner, { backgroundColor: theme.tintColor }]} />}
            </View>
            <Text style={[styles.label, { color: theme.text }]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, marginHorizontal: 15 },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 17,
    borderWidth: 1.3,
    borderRadius: 12,
  },
  outer: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  inner: { width: 10, height: 10, borderRadius: 5 },
  label: { fontFamily: 'SpaceMono-Bold', fontSize: 16 },
});
