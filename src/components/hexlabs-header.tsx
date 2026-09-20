import { type ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import HexlabsIcon from '@/assets/images/HexlabsIcon.svg';
import { useTheme } from '@/hooks/use-theme';

interface HexlabsHeaderProps {
  right?: ReactNode;
}

export function HexlabsHeader({ right }: HexlabsHeaderProps) {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background as string }]}>
      <HexlabsIcon width={160} height={40} />
      {right && <View style={styles.right}>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 14,
    overflow: 'visible',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
