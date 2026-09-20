import { useLocalSearchParams } from 'expo-router';
import { SwagScreen } from '@/features/swag/swag-screen';

export default function SwagScreenPage() {
  const { selectedSwagItem } = useLocalSearchParams<{ selectedSwagItem: string }>();
  const item = selectedSwagItem ? JSON.parse(selectedSwagItem) : null;

  if (!item) return null;
  return <SwagScreen selectedSwagItem={item} />;
}
