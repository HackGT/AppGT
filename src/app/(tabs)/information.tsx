import { View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { InformationTab } from '@/features/information/information-tab';
import { HexlabsHeader } from '@/components/hexlabs-header';
import { useTopInset } from '@/hooks/use-top-inset';

export default function InformationPage() {
  const theme = useTheme();
  const topInset = useTopInset();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: topInset }}>
      <HexlabsHeader />
      <InformationTab />
    </View>
  );
}
