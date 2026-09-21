export {};

declare module 'react-native' {
  interface TouchableOpacityProps {
    needsOffscreenAlphaCompositing?: boolean;
  }
}
