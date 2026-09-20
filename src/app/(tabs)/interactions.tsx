import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { InteractionsTab } from '@/features/interactions/interactions-tab';
import { HexlabsHeader } from '@/components/hexlabs-header';

export default function InteractionsPage() {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <HexlabsHeader />
      <InteractionsTab />
    </SafeAreaView>
  );
}
