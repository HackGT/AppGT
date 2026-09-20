import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Card } from '@/components/card';

interface SwagItemCardProps {
  name: string;
  cost: number;
  description: string;
  truncateText?: boolean;
}

export function SwagItemCard({ name, cost, description, truncateText }: SwagItemCardProps) {
  const theme = useTheme();

  return (
    <View style={styles.card}>
      <Card>
        <View style={styles.titleHeader}>
          <Text
            numberOfLines={truncateText ? 1 : undefined}
            ellipsizeMode="tail"
            style={[styles.titleFont, { color: theme.text }]}
          >
            {name}
          </Text>
        </View>
        <Text
          numberOfLines={truncateText ? 1 : undefined}
          ellipsizeMode="tail"
          style={[styles.titleFont, { color: theme.text, fontStyle: 'italic' }]}
        >
          {cost} points
        </Text>
        <Text
          numberOfLines={truncateText ? 1 : undefined}
          ellipsizeMode="tail"
          style={[styles.subtitleFont, { color: theme.textSecondary }]}
        >
          {description}
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  titleHeader: {
    flexDirection: 'row',
    width: '100%',
  },
  titleFont: {
    fontSize: 16,
    width: '90%',
    fontFamily: 'SpaceMono-Bold',
    letterSpacing: 0.005,
    marginRight: 10,
  },
  subtitleFont: {
    marginTop: 2,
    fontFamily: 'SpaceMono-Regular',
    letterSpacing: 0.005,
  },
});
