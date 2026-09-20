import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { InformationTab } from '@/features/information/information-tab';
import { HexlabsHeader } from '@/components/hexlabs-header';

export default function InformationPage() {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <HexlabsHeader />
      <InformationTab />
    </SafeAreaView>
  );
}
