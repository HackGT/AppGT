import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { HackathonProvider } from '@/contexts/hackathon-context';
import { ScavHuntProvider } from '@/contexts/scav-hunt-context';

SplashScreen.preventAutoHideAsync();

const SCREEN_OPTIONS = { headerShown: false, animation: 'none' } as const;

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

function ThemedStatusBar() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return (
    <StatusBar
      barStyle={isDark ? 'light-content' : 'dark-content'}
      backgroundColor={isDark ? Colors.dark.background : Colors.light.background}
    />
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ThemedStatusBar />
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
