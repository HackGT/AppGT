import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { HackathonProvider } from '@/contexts/hackathon-context';
import { ScavHuntProvider } from '@/contexts/scav-hunt-context';

SplashScreen.preventAutoHideAsync();

const SCREEN_OPTIONS = { headerShown: false } as const;

function RootNavigator() {
  const { loading, firebaseUser } = useAuth();
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
    'SpaceMono-Bold': require('@/assets/fonts/SpaceMono-Bold.ttf'),
    'SpaceMono-Italic': require('@/assets/fonts/SpaceMono-Italic.ttf'),
    'SpaceMono-BoldItalic': require('@/assets/fonts/SpaceMono-BoldItalic.ttf'),
  });

  useEffect(() => {
    if (!loading && fontsLoaded) SplashScreen.hideAsync();
  }, [loading, fontsLoaded]);

  if (loading || !fontsLoaded) return null;

  const stack = (
    <Stack screenOptions={SCREEN_OPTIONS}>
      <Stack.Screen name="login" options={SCREEN_OPTIONS} />
      <Stack.Screen name="(tabs)" options={SCREEN_OPTIONS} />
      <Stack.Screen name="index" options={SCREEN_OPTIONS} />
      <Stack.Screen name="explore" options={SCREEN_OPTIONS} />
      <Stack.Screen name="schedule-search" options={SCREEN_OPTIONS} />
      <Stack.Screen name="interaction-screen" options={SCREEN_OPTIONS} />
      <Stack.Screen name="check-in-nfc" options={SCREEN_OPTIONS} />
      <Stack.Screen name="swag-screen" options={SCREEN_OPTIONS} />
      <Stack.Screen name="scav-hunt-item" options={SCREEN_OPTIONS} />
      <Stack.Screen name="redirect" options={SCREEN_OPTIONS} />
    </Stack>
  );

  if (!firebaseUser) {
    return stack;
  }

  return (
    <HackathonProvider firebaseUser={firebaseUser}>
      <ScavHuntProvider>
        {stack}
      </ScavHuntProvider>
    </HackathonProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
