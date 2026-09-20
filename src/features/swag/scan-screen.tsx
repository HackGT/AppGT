import { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTheme } from '@/hooks/use-theme';
import { AuthContext } from '@/contexts/auth-context';
import { Card } from '@/components/card';
import { checkoutSwagItem, getUserProfile } from '@/api/api';
import { initNfc, cancelNFC, readNFC } from '@/lib/nfc';

interface ScanScreenProps {
  swagID: string;
}

export function ScanScreen({ swagID }: ScanScreenProps) {
  const theme = useTheme();
  const { firebaseUser } = useContext(AuthContext);
  const [useQR, setUseQR] = useState(false);
  const [uid, setUid] = useState('');
  const [fName, setfName] = useState('');
  const [lName, setlName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(-1);
  const [isScanning, setIsScanning] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    initNfc();
  }, []);

  const createAlert = (message: string) =>
    Alert.alert('Error', message, [{ text: 'OK' }]);

  const getProfileAndCheckoutSwag = async (userId: string): Promise<boolean> => {
    if (!firebaseUser) return false;
    const token = await firebaseUser.getIdToken();
    const userProfileResponse = await getUserProfile(token, userId);
    if (userProfileResponse.status !== 200) {
      setStatus(userProfileResponse.status);
      createAlert(userProfileResponse.json.message);
      return false;
    }
    setfName(userProfileResponse.json.name.first);
    setlName(userProfileResponse.json.name.last);
    setEmail(userProfileResponse.json.email);

    const checkoutResponse = await checkoutSwagItem(token, userId, swagID);
    setStatus(checkoutResponse.status);
    if (checkoutResponse.status !== 200) {
      createAlert(checkoutResponse.json.message);
      return false;
    }
    return true;
  };

  const onQRScanned = async ({ data }: { data: string }) => {
    if (qrScanned) return;
    setQrScanned(true);
    let json: any = {};
    try { json = JSON.parse(data); } catch {}
    if (!json.uid) {
      createAlert('Invalid QR Code');
      setTimeout(() => setQrScanned(false), 3000);
      return;
    }
    setUid(json.uid);
    await getProfileAndCheckoutSwag(json.uid);
    setTimeout(() => setQrScanned(false), 3000);
  };

  const scanNFC = async () => {
    setIsScanning(true);
    if (Platform.OS === 'android') setModalVisible(true);
    const { success, data } = await readNFC();
    if (Platform.OS === 'android') setModalVisible(false);
    if (success) {
      let json: any = {};
      try { json = JSON.parse(data); } catch {}
      if (!json.uid) {
        createAlert('Invalid badge. Please see help desk to register your badge.');
        setStatus(500);
      } else {
        setUid(json.uid);
        setQrScanned(true);
        await getProfileAndCheckoutSwag(json.uid);
        setTimeout(() => setQrScanned(false), 3000);
      }
    } else {
      createAlert(data);
      setStatus(500);
    }
    setIsScanning(false);
  };

  const statusColor = status === 200 ? '#5dbb63' : status === -1 ? theme.text : '#d74040';
  const statusText = status === 200 ? 'Success!' : status === -1 ? 'Scan to get started!' : 'Try again!';

  return (
    <View style={styles.container}>
      <Modal visible={modalVisible} transparent animationType="fade"
        onRequestClose={async () => { await cancelNFC(); setModalVisible(false); }}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <ActivityIndicator size="large" color="#5dbb63" style={{ marginBottom: 20 }} />
            <Text style={{ color: theme.text, fontFamily: 'SpaceMono-Bold' }}>Scanning for NFC Tag...</Text>
          </View>
        </View>
      </Modal>

      <View style={styles.infoContainer}>
        <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>{'Name: ' + fName + ' ' + lName}</Text>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>{'Email: ' + email}</Text>
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>{'ID: ' + uid}</Text>

        <View style={{ marginTop: 5, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ color: theme.text, fontFamily: 'SpaceMono-Bold' }}>NFC</Text>
            <Switch value={useQR} onValueChange={setUseQR} />
            <Text style={{ color: theme.text, fontFamily: 'SpaceMono-Bold' }}>QR Code</Text>
          </View>
        </View>
      </View>

      {useQR ? (
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.scanLabel, { color: theme.text }]}>
            Scan User QR Code
          </Text>
          {permission?.granted ? (
            <CameraView
              style={styles.camera}
              facing="back"
              onBarcodeScanned={qrScanned ? undefined : onQRScanned}
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            />
          ) : (
            <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission} activeOpacity={Platform.OS === 'android' ? 1 : 0.2} needsOffscreenAlphaCompositing={true}>
              <Text style={{ color: theme.text, fontFamily: 'SpaceMono-Bold' }}>
                Grant Camera Permission
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <TouchableOpacity style={styles.scanButton} onPress={scanNFC} disabled={isScanning} activeOpacity={Platform.OS === 'android' ? 1 : 0.2} needsOffscreenAlphaCompositing={true}>
          <Card>
            <Text style={[styles.scanButtonText, { color: theme.text }]}>Scan Badge</Text>
          </Card>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 10 },
  statusText: { fontFamily: 'SpaceMono-Bold', fontSize: 16, padding: 4 },
  infoText: { fontFamily: 'SpaceMono-Regular', fontSize: 14, padding: 4 },
  scanButtonText: { fontFamily: 'SpaceMono-Bold', fontSize: 20, alignSelf: 'center', padding: 10 },
  scanLabel: { fontFamily: 'SpaceMono-Bold', fontSize: 18, marginBottom: 15 },
  infoContainer: { padding: 16 },
  scanButton: { alignSelf: 'center', marginTop: 20 },
  camera: { width: '90%', height: 300, borderRadius: 12, overflow: 'hidden' },
  permissionBtn: { alignSelf: 'center', marginTop: 20, padding: 16 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { padding: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
});
