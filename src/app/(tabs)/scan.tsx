import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { ScanScreen } from '@/features/scan/scan-screen';
import { HexlabsHeader } from '@/components/hexlabs-header';

export default function ScanPage() {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <HexlabsHeader />
      <ScanScreen />
    </SafeAreaView>
  );
}
