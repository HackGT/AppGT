import { useContext, useState, useRef } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { AuthContext } from '@/contexts/auth-context';
import { getRegistrationApplication, CURRENT_HEXATHON } from '@/api/api';
import { Touchable } from '@/components/touchable';

const COOLDOWN_MS = 3000;

export function CheckInQR() {
  const theme = useTheme();
  const router = useRouter();
  const { firebaseUser } = useContext(AuthContext);
  const [scanned, setScanned] = useState(false);
  const scanningRef = useRef(false);
  const [isFocused, setIsFocused] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();

  useFocusEffect(useCallback(() => {
    setIsFocused(true);
    return () => {
      setIsFocused(false);
      scanningRef.current = false;
      setScanned(false);
    };
  }, []));

  const resetAfterCooldown = () => setTimeout(() => {
    scanningRef.current = false;
    setScanned(false);
  }, COOLDOWN_MS);

  const createAlert = (message: string) =>
    Alert.alert('Error', message, [{ text: 'OK' }]);

  const onQRScanned = async ({ data }: { data: string }) => {
    if (scanningRef.current) return;
    scanningRef.current = true;
    setScanned(true);

    let json: any = {};
    try { json = JSON.parse(data); } catch {}
    if (!json.uid) {
      createAlert('Invalid QR Code');
      resetAfterCooldown();
      return;
    }

    try {
      if (!firebaseUser) return;
      const token = await firebaseUser.getIdToken();
      const { status, json: appData } = await getRegistrationApplication(
        token,
        CURRENT_HEXATHON.id,
        json.uid
      );
      if (status !== 200) {
        createAlert(`Error contacting server: Status ${status}`);
        resetAfterCooldown();
      } else if (!appData?.applications?.length) {
        createAlert(`This person never submitted an application to ${CURRENT_HEXATHON.name}`);
        resetAfterCooldown();
      } else if (appData.applications[0].status !== 'CONFIRMED') {
        createAlert(`This person's application is not confirmed yet. Current status: ${appData.applications[0].status}`);
        resetAfterCooldown();
      } else if (!appData.applications[0].confirmationBranch) {
        createAlert('This person does not have a valid confirmation branch');
        resetAfterCooldown();
      } else {
        router.push({ pathname: '/check-in-nfc' as any, params: { application: JSON.stringify(appData.applications[0]) } });
      }
    } catch (e: any) {
      createAlert(e.message);
      resetAfterCooldown();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Text style={[styles.headerText, { color: theme.text }]}>Check-In</Text>
      <Text style={[styles.headerHelpText, { color: theme.textSecondary }]}>
        Use this page to check-in people to {CURRENT_HEXATHON.name}. Scan their QR code then tap
        the matching badge to write their data.
      </Text>
      <View style={{ alignItems: 'center', marginTop: 30 }}>
        <Text style={[styles.scanLabel, { color: theme.text }]}>
          Scan User QR Code
        </Text>
        {permission?.granted ? (
          isFocused && <CameraView
            style={styles.camera}
            facing="back"
            onBarcodeScanned={scanned ? undefined : onQRScanned}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          />
        ) : (
          <Touchable style={styles.permissionBtn} onPress={requestPermission}>
            <Text style={{ color: theme.text, fontFamily: 'SpaceMono-Bold' }}>
              Grant Camera Permission
            </Text>
          </Touchable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: { fontFamily: 'SpaceMono-Bold', fontSize: 22, marginHorizontal: 15, marginTop: 10, marginBottom: 5 },
  headerHelpText: { marginHorizontal: 15, fontFamily: 'SpaceMono-Bold' },
  scanLabel: { fontFamily: 'SpaceMono-Bold', fontSize: 18, marginBottom: 15 },
  camera: { width: '90%', height: 300, borderRadius: 12, overflow: 'hidden' },
  permissionBtn: { padding: 16 },
});
