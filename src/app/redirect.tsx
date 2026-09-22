import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';
import { HackathonLoadingScreen } from '@/components/hackathon-error-screen';

// On Android, WebBrowser.openAuthSessionAsync fires the OAuth redirect URL as a
// system deep link, causing Expo Router to navigate here. We hold on a loading
// screen while the auth flow completes, then let the auth state drive navigation.
export default function RedirectPage() {
  const { isAuthenticating, showLogin } = useAuth();

  if (isAuthenticating) return <HackathonLoadingScreen />;
  if (showLogin) return <Redirect href="/login" />;
  return <Redirect href="/(tabs)" />;
}
