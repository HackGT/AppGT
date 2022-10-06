import React, { useState, useEffect } from "react";
import { Alert, Text, StyleSheet } from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { useScanBarcodes, BarcodeFormat } from "vision-camera-code-scanner";

export default function QRCodeScanner(props) {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  useEffect(() => {
    const checkCameraPermission = async () => {
      let status = await Camera.getCameraPermissionStatus();

      if (status !== "authorized") {
        await Camera.requestCameraPermission();
        status = await Camera.getCameraPermissionStatus();

        if (status === "denied") {
          Alert.alert(
            "Error",
            "You will not be able to scan if you do not allow camera access."
          );
        }
      } else {
        setHasCameraPermission(true);
      }
    };

    checkCameraPermission();
  }, []);

  const devices = useCameraDevices();
  const backCameraDevice = devices.back;
  console.log("DEVICES");
  console.log(backCameraDevice);

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  return !backCameraDevice || !hasCameraPermission ? null : (
    <>
      <Camera
        style={StyleSheet.absoluteFill}
        device={backCameraDevice}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
      {barcodes.map((barcode, idx) => (
        <Text key={idx} style={styles.barcodeTextURL}>
          {barcode.displayValue}
        </Text>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  barcodeTextURL: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
});
