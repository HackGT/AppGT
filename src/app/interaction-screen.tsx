import { useLocalSearchParams } from 'expo-router';
import { InteractionScreen } from '@/features/interactions/interaction-screen';

export default function InteractionScreenPage() {
  const { selectedEvent } = useLocalSearchParams<{ selectedEvent: string }>();
  const event = selectedEvent ? JSON.parse(selectedEvent) : null;

  if (!event) return null;
  return <InteractionScreen selectedEvent={event} />;
}
