import { useLocalSearchParams } from 'expo-router';
import { CheckInNFC } from '@/features/check-in/check-in-nfc';

export default function CheckInNFCPage() {
  const { application } = useLocalSearchParams<{ application: string }>();
  const app = application ? JSON.parse(application) : null;

  if (!app) return null;
  return <CheckInNFC application={app} />;
}
