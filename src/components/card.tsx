import { type ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

interface CardProps {
  children: ReactNode;
  highlighted?: boolean;
  height?: number;
}

export function Card({ children, highlighted, height }: CardProps) {
  const theme = useTheme();

  const cardStyle = {
    padding: 17,
    flexDirection: 'column' as const,
    alignItems: 'flex-start' as const,
    justifyContent: 'space-evenly' as const,
    height,
    borderWidth: 1.3,
    borderRadius: 12,
    borderColor: highlighted ? theme.tintColor : theme.backgroundElement,
    backgroundColor: theme.backgroundElement,
    elevation: 1,
    shadowColor: theme.text,
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  };

  return <View style={[cardStyle, styles.card]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
});
