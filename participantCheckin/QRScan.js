import { Text, StyleSheet, View, Alert } from "react-native";
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { TouchableOpacity } from "react-native-gesture-handler";
import React, { useState, useEffect, useContext, useRef } from "react";
import {request, PERMISSIONS} from "react-native-permissions";
import { logInteraction } from "../yac";
import { HackathonContext, ScavHuntContext } from "../context";



function QRScan(props) {
  const { hackathon } = useContext(HackathonContext)
  const[uid, setUid] = useState('')
  const[fName, setfName] = useState("")
  const[lName, setlName] = useState("")
  const[email, setEmail] = useState("")
  const [status, setStatus] = useState("Scan to get started!")
  const scanner = useRef(null)

  const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 12,
    padding: 4,
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
    console.log('ID: ', hackathon)
    request(PERMISSIONS.IOS.CAMERA).then((result) => {
      console.log("asdf")
      console.log(result)
    });
  }, []);
  const onSuccess = async e => {
    console.log('QR code scanned!', e)
    const json = JSON.parse(e.data)
    if (json.uid) {
      setEmail(json.email)
      setfName(json.name.first)
      setlName(json.name.last)
      setUid(json.uid)
      const res = await logInteraction(hackathon.name, 'event', json.uid, props.eventID)
      setStatus(res.status)
      console.log('RES: ', res)
      if (res.status !== 200) {
        createAlert(res.json.message)
      } else {
        setTimeout(() => {
          scanner.current.reactivate()
        }, 2000);
      }
    } else {
      createAlert("Invalid QR Code")
    }
  };

  const createAlert = (message) =>
    Alert.alert(
      "Error",
      message,
      [
        { text: "OK", onPress: () => {
          console.log("OK Pressed")
          scanner.current.reactivate()
        } }
      ]
    );
    
  return (
    <View>
      <View style={styles.buttonTouchable}>
        <Text style={[styles.centerText, { fontWeight: 'bold', fontSize: 16, color: status === 200 ? 'green' : '#111' }]}>{status === 200 ? "Success!" : "Try again!"}</Text>
        <Text style={styles.centerText}>{'Name: ' + fName + ' ' + lName}</Text>
        <Text style={styles.centerText}>{'Email: ' + email}</Text>
        <Text style={styles.centerText}>{'ID: ' + uid}</Text>
      </View>
      <QRCodeScanner
        ref={scanner}
        reactivate={false}
        fadeIn={false}
        showMarker
        markerStyle={{borderColor: 'white', borderWidth: 2}}
        onRead={
          onSuccess
        }
      />
    </View>
  );
}

export default QRScan;
