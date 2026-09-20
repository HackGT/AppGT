import { View, Text, StyleSheet } from 'react-native';
import { EVENT_TYPE_COLOR_MAP } from '@/api/api';
import { useTheme } from '@/hooks/use-theme';

interface EventTypeViewProps {
  eventType: string;
}

export function EventTypeView({ eventType }: EventTypeViewProps) {
  const theme = useTheme();
  const color = EVENT_TYPE_COLOR_MAP[eventType] ?? theme.text;
  const radius = 6;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={[
          styles.circle,
          {
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius,
            backgroundColor: color,
          },
        ]}
      />
      <Text style={{ marginLeft: 7, color, fontFamily: 'SpaceMono-Regular' }}>{eventType}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    marginTop: 4,
  },
});
