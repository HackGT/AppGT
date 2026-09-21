import { View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { CheckInQR } from '@/features/check-in/check-in-qr';
import { HexlabsHeader } from '@/components/hexlabs-header';
import { useTopInset } from '@/hooks/use-top-inset';

export default function CheckInPage() {
  const theme = useTheme();
  const topInset = useTopInset();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: topInset }}>
      <HexlabsHeader />
      <CheckInQR />
    </View>
  );
}
