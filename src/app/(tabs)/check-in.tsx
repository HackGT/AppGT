import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { CheckInQR } from '@/features/check-in/check-in-qr';
import { HexlabsHeader } from '@/components/hexlabs-header';

export default function CheckInPage() {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <HexlabsHeader />
      <CheckInQR />
    </SafeAreaView>
  );
}
