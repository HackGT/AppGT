import { Redirect } from 'expo-router';

export default function Explore() {
  return <Redirect href={'/(tabs)' as any} />;
}
