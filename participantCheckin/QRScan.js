import { Text, StyleSheet, View } from "react-native";
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { TouchableOpacity } from "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import {request, PERMISSIONS} from "react-native-permissions"

function QRScan() {
  const[uid, setUid] = useState(null)
  const[fName, setfName] = useState("*First Name*")
  const[lName, setlName] = useState("*Last Name*")
  const[email, setEmail] = useState("*Email*")

  const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21
  },
  buttonTouchable: {
    padding: 16
  }
  });
  useEffect(() => {
    console.log("235")
    console.log('ID: ')
    request(PERMISSIONS.IOS.CAMERA).then((result) => {
      console.log("asdf")
      console.log(result)
    });
  }, []);
  onSuccess = e => {
    console.log('QR code scanned!', e)
    const json = JSON.parse(e.data)
    if (json.uid != null) {
      setEmail(json.email)
      setfName(json.name.first)
      setlName(json.name.last)
      setUid(json.uid)
    }
  };

  return (
      <QRCodeScanner
        reactivateTimeout={5000}
        onRead={
          onSuccess
        }
        bottomContent={
          <View style={styles.buttonTouchable}>
            <Text style={styles.buttonText}>{email}</Text>
            <Text style={styles.buttonText}>{lName}</Text>
            <Text style={styles.buttonText}>{fName}</Text>
            <Text style={styles.buttonText}>{uid}</Text>
          </View>
        }
      />
    );
}

export default QRScan;
