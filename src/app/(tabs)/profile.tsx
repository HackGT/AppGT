import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { ProfileTab } from '@/features/profile/profile-tab';
import { HexlabsHeader } from '@/components/hexlabs-header';

export default function ProfilePage() {
  const theme = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <HexlabsHeader />
      <ProfileTab />
    </SafeAreaView>
  );
}
