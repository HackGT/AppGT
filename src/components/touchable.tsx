import { Pressable, Platform, PressableProps, StyleProp, ViewStyle } from 'react-native';

interface TouchableProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
}

export function Touchable({ style, children, ...props }: TouchableProps) {
  return (
    <Pressable
      renderToHardwareTextureAndroid={Platform.OS === 'android'}
      style={({ pressed }) => [style, pressed && { opacity: 0.7 }]}
      {...props}
    >
      {children}
    </Pressable>
  );
}
