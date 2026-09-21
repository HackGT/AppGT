import { View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { InteractionsTab } from '@/features/interactions/interactions-tab';
import { HexlabsHeader } from '@/components/hexlabs-header';
import { useTopInset } from '@/hooks/use-top-inset';

export default function InteractionsPage() {
  const theme = useTheme();
  const topInset = useTopInset();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: topInset }}>
      <HexlabsHeader />
      <InteractionsTab />
    </View>
  );
}
