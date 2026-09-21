import { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { AuthContext } from '@/contexts/auth-context';
import { logInteraction } from '@/api/api';
import { Card } from '@/components/card';
import { initNfc, writeNFC } from '@/lib/nfc';
import { Touchable } from '@/components/touchable';

const BADGE_IMAGES: Record<string, any> = {
  PARTICIPANT: require('@/assets/images/badges/BadgeParticipant.png'),
  MENTOR: require('@/assets/images/badges/BadgeMentor.png'),
  JUDGE: require('@/assets/images/badges/BadgeJudge.png'),
  ORGANIZER: require('@/assets/images/badges/BadgeOrganizer.png'),
  SPONSOR: require('@/assets/images/badges/BadgeSponsor.png'),
  VOLUNTEER: require('@/assets/images/badges/BadgeVolunteer.png'),
};

interface CheckInNFCProps {
  application: any;
}

export function CheckInNFC({ application }: CheckInNFCProps) {
  const theme = useTheme();
  const router = useRouter();
  const { firebaseUser } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    initNfc();
    console.log('[check-in-nfc] confirmationBranch:', JSON.stringify(application.confirmationBranch));
  }, []);

  const createAlert = (message: string) =>
    Alert.alert('Error', message, [{ text: 'OK' }]);

  const onPressScan = async () => {
    setModalVisible(true);
    const success = await writeNFC(JSON.stringify({ uid: application.userId }));
    setModalVisible(false);
    if (!success) {
      createAlert('There was an issue writing to the badge. Try again.');
    } else {
      if (!firebaseUser) return;
      const token = await firebaseUser.getIdToken();
      const interactionResponse = await logInteraction(token, 'check-in', application.userId);
      if (interactionResponse.status !== 200) {
        console.log(interactionResponse);
        createAlert(
          'There was an issue logging the checkin interaction. However, badge was successfully written to.'
        );
      } else {
        router.back();
      }
    }
  };

  return (
    <>
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <ActivityIndicator size="large" color="#5dbb63" style={{ marginBottom: 20 }} />
            <Text style={{ color: theme.text, fontFamily: 'SpaceMono-Regular' }}>Waiting for NFC Tag...</Text>
          </View>
        </View>
      </Modal>
      <SafeAreaView edges={['top']} style={{ flex: 1, paddingHorizontal: 20, backgroundColor: theme.background }}>
        <Text style={[styles.infoText, { color: theme.text }]}>
          {'Name: ' + application.name}
        </Text>
        <Text style={[styles.infoText, { color: theme.text }]}>
          {'Email: ' + application.email}
        </Text>
        <Text style={[styles.infoText, { color: theme.text }]}>
          {'User ID: ' + application.userId}
        </Text>
        <Text style={[styles.infoText, { color: theme.text }]}>
          {'Application Group: ' + application.confirmationBranch?.applicationGroup}
        </Text>
        <Touchable onPress={onPressScan} style={styles.writeToBadgeButton}>
          <Card>
            <Text style={[styles.writeToBadgeButtonText, { color: theme.text }]}>
              Write to Badge
            </Text>
          </Card>
        </Touchable>
        <View style={styles.badgeImageWrapper}>
          {BADGE_IMAGES[application.confirmationBranch?.applicationGroup] && (
            <Image
              source={BADGE_IMAGES[application.confirmationBranch.applicationGroup]}
              style={{ width: Dimensions.get('window').width - 160 }}
              resizeMode="contain"
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  writeToBadgeButton: {
    marginTop: 30,
    marginHorizontal: 15,
  },
  writeToBadgeButtonText: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 20,
    alignSelf: 'center',
    padding: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeImageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    zIndex: -1,
  },
  infoText: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 16,
  },
  modalContent: {
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
});
