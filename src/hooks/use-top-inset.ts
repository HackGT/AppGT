import { Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useTopInset(): number {
  const insets = useSafeAreaInsets();
  if (Platform.OS === 'android') {
    return StatusBar.currentHeight ?? insets.top;
  }
  return insets.top;
}
