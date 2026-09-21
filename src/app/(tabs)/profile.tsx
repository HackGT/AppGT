import { View } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ProfileTab } from '@/features/profile/profile-tab';
import { HexlabsHeader } from '@/components/hexlabs-header';
import { useTopInset } from '@/hooks/use-top-inset';

export default function ProfilePage() {
  const theme = useTheme();
  const topInset = useTopInset();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background, paddingTop: topInset }}>
      <HexlabsHeader />
      <ProfileTab />
    </View>
  );
}
