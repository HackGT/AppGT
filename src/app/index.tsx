import { Redirect } from 'expo-router';

export default function RootIndex() {
  // The _layout.tsx handles auth-based routing.
  // This file exists only to avoid a 404 at the root path.
  return <Redirect href={'/(tabs)' as any} />;
}
