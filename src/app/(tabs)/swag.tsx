import { View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { SwagTab } from '@/features/swag/swag-tab';
import { HexlabsHeader } from '@/components/hexlabs-header';
import { useTopInset } from '@/hooks/use-top-inset';

export default function SwagPage() {
  const theme = useTheme();
  const topInset = useTopInset();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: topInset }}>
      <HexlabsHeader />
      <SwagTab />
    </View>
  );
}
