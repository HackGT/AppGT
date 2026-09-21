import { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as WebBrowser from 'expo-web-browser';
import { useTheme } from '@/hooks/use-theme';
import { AuthContext } from '@/contexts/auth-context';
import { CURRENT_HEXATHON, getHexathonUser, getRegistrationApplication } from '@/api/api';
import { Touchable } from '@/components/touchable';

export function ProfileTab() {
  const theme = useTheme();
  const { firebaseUser, user, signOut } = useContext(AuthContext);
  const [points, setPoints] = useState(0);
  const [showQRCode, setShowQRCode] = useState(false);

  const profilePage = async () => {
    try {
      await WebBrowser.openBrowserAsync('https://login.hexlabs.org/profile');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!firebaseUser) return;
    const getApplication = async () => {
      try {
        const token = await firebaseUser.getIdToken();
        const { json: data } = await getRegistrationApplication(
          token,
          CURRENT_HEXATHON.id,
          firebaseUser.uid
        );
        if (data?.applications?.[0]?.status === 'CONFIRMED') {
          setShowQRCode(true);
        }
      } catch (e) {
        console.log(e);
      }
    };
    getApplication();
  }, [firebaseUser]);

  useEffect(() => {
    if (!firebaseUser) return;
    const getPoints = async () => {
      try {
        const token = await firebaseUser.getIdToken();
        const { json: data } = await getHexathonUser(token, CURRENT_HEXATHON.id, firebaseUser.uid);
        setPoints(data?.points?.currentTotal ?? 0);
      } catch (e) {
        console.log(e);
      }
    };
    getPoints();
  }, [firebaseUser]);

  if (!user) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.text }}>Loading profile...</Text>
      </View>
    );
  }

  const phoneNumber = user.phoneNumber
    ? user.phoneNumber.toString().replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
    : '';

  const fullName = [user.name.first, user.name.middle, user.name.last]
    .filter(Boolean)
    .join(' ');

  return (
    <ScrollView style={{ backgroundColor: theme.background }}>
      <Text style={[styles.headerText, { color: theme.text }]}>Profile</Text>

      {showQRCode && firebaseUser && (
        <>
          <Text style={[styles.checkInText, { color: theme.text }]}>
            You can use this QR code or the one from HexLabs Registration to check-in!
          </Text>
          <View style={styles.qrPlaceholder}>
            <QRCode
              value={JSON.stringify({ uid: firebaseUser.uid })}
              size={200}
            />
          </View>
        </>
      )}

      <Text style={[styles.profileContent, { color: theme.text }]}>Name: {fullName}</Text>
      <Text style={[styles.profileContent, { color: theme.text }]}>Email: {user.email}</Text>
      {phoneNumber ? (
        <Text style={[styles.profileContent, { color: theme.text }]}>
          Phone Number: {phoneNumber}
        </Text>
      ) : null}
      <Text style={[styles.profileContent, { color: theme.text }]}>
        Swag Points: {points}
      </Text>

      <View>
        <Touchable
          style={[styles.logOutButton, { borderColor: theme.tintColor }]}
          onPress={signOut}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>Log Out</Text>
        </Touchable>
        <Touchable
          style={[styles.dangerButton, { borderColor: theme.tintColor }]}
          onPress={profilePage}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>Delete Profile</Text>
        </Touchable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  profileContent: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
  buttonText: {
    padding: 8,
    textAlign: 'center',
    fontFamily: 'SpaceMono-Regular',
    letterSpacing: 0.005,
  },
  headerText: {
    fontFamily: 'SpaceMono-Bold',
    fontSize: 22,
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 5,
  },
  checkInText: {
    fontFamily: 'SpaceMono-Bold',
    marginHorizontal: 15,
  },
  qrPlaceholder: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logOutButton: {
    margin: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  dangerButton: {
    backgroundColor: '#CB4848',
    margin: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
});
