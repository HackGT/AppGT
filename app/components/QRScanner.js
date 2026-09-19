import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { Camera } from "react-native-camera-kit";

export const QRScanner = forwardRef(({ onRead, style }, ref) => {
  const armed = useRef(true);

  useImperativeHandle(ref, () => ({
    reactivate: () => {
      armed.current = true;
    },
  }));

  const handleReadCode = useCallback(
    (event) => {
      if (!armed.current) {
        return;
      }
      armed.current = false;
      onRead({ data: event.nativeEvent.codeStringValue });
    },
    [onRead]
  );

  return (
    <Camera
      scanBarcode
      showFrame
      frameColor="white"
      laserColor="white"
      onReadCode={handleReadCode}
      style={[{ aspectRatio: 1 }, style]}
    />
  );
});
