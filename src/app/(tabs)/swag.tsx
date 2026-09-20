import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { SwagTab } from '@/features/swag/swag-tab';
import { HexlabsHeader } from '@/components/hexlabs-header';

export default function SwagPage() {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <HexlabsHeader />
      <SwagTab />
    </SafeAreaView>
  );
}
