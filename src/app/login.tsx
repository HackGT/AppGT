import { Redirect } from 'expo-router';

import { LoginOnboarding } from '@/features/onboarding/login-onboarding';
import { useAuth } from '@/contexts/auth-context';

export default function LoginPage() {
  const { showLogin, loading } = useAuth();

  if (!loading && !showLogin) {
    return <Redirect href={'/(tabs)' as any} />;
  }

  return <LoginOnboarding />;
}
