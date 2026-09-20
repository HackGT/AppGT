import { useLocalSearchParams } from 'expo-router';
import { ScavHuntItem } from '@/features/scav-hunt/scav-hunt-item';

export default function ScavHuntItemPage() {
  const { item, hackathonName } = useLocalSearchParams<{ item: string; hackathonName: string }>();
  const parsedItem = item ? JSON.parse(item) : null;

  if (!parsedItem) return null;
  return <ScavHuntItem item={parsedItem} hackathonName={hackathonName ?? ''} />;
}
