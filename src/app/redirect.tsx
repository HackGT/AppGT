import { Redirect } from 'expo-router';

// On Android, WebBrowser.openAuthSessionAsync fires the OAuth redirect URL as a
// system deep link, causing Expo Router to navigate here. Redirect to login;
// the auth context will forward to /(tabs) if the user is already authenticated.
export default function RedirectPage() {
  return <Redirect href="/login" />;
}
