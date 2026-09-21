import { View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ScanScreen } from '@/features/scan/scan-screen';
import { HexlabsHeader } from '@/components/hexlabs-header';
import { useTopInset } from '@/hooks/use-top-inset';

export default function ScanPage() {
  const theme = useTheme();
  const topInset = useTopInset();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: topInset }}>
      <HexlabsHeader />
      <ScanScreen />
    </View>
  );
}
