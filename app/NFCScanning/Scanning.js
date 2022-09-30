import React, { useState, useEffect, useRef } from 'react';
import { Buffer } from 'buffer';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, View, Dimensions, ScrollView, TextInput, FlatList } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";
import NDEFParser from './NDEFParser';
import { initNfc, readNdef } from './nfc';
import { notifyEventAttendence } from '../yac';
import { getCMSEvent } from '../cms';

export function Scanning(props) {
  const sheetRef = useRef()
  const [shouldScan, setShouldScan] = useState(true)
  const [uuid, setUuid] = useState("")
  const [errorCode, setErrorCode] = useState(null)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [forceScan, setForceScan] = useState(true)
  const [searchStr, setSearchStr] = useState("")
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [displayedEvents, setDisplayedEvents] = useState([])

  useEffect(() => {
    console.log('Getting CMS events')
    const func = async () => {
      const events = await getCMSEvent()
      console.log('events ', events)
      setEvents(events)
    }

    func()
  }, [])

  useEffect(() => {
    const func = async () => {
      console.log('about to initialize nfc')
      await initNfc()
      console.log('finished initializing nfc')
      const res = await readNdef()
      const payload = res.ndefMessage[0].payload
      const text = payload.reduce(
        (acc, byte) => acc + String.fromCharCode(byte), ''
      )
      console.log('reduced: ', text)
      const match = text.match(/info.hack.gt\/?\?user=([a-f0-9\-]+)$/i);
      if (!match) {
        console.warn(`Invalid URL: ${text}`);
        return;
      }
      const [, id] = match;
      setUuid(id)
      if (selectedEvent && id) {
        const code = await notifyEventAttendence(id, selectedEvent ? selectedEvent.id : null, selectedEvent ? selectedEvent.type.name : null)
        setErrorCode(code)
        setShowCompleteModal(true)
        sheetRef.current.open()
      } else {
        setErrorCode(420)
        setShowCompleteModal(true)
        sheetRef.current.open()
      }
    }

    func();
  }, [forceScan])

  useEffect(() => {
    setDisplayedEvents(events.filter(event => event.name.toLowerCase().includes(searchStr.toLowerCase())))
  }, [events])

  useEffect(() => {
    const newDisplayedEvents = events.filter(event => event.name.toLowerCase().includes(searchStr.toLowerCase()))
    setDisplayedEvents(newDisplayedEvents)
  }, [searchStr])

  const scannedNotif = () => {
    return (
      <View style={{ flexDirection: 'column' }}>
        <Text style={styles.text}>{('Participant UUID: ' + uuid)}</Text>
      </View>
    )
  }

  const sheetContent = () => {
    return (
      <View style={[styles.sheetStyle]}>
        <Text style={styles.text}>{errorCode === 200 ? 'Success!' : 'There was an issue, try again.'}</Text>
        <TouchableOpacity style={{ backgroundColor: '#4AC8EF', alignItems: 'center', borderRadius: 5, width: Dimensions.get('window').width - 100 }} onPress={() => sheetRef.current.close()}>
          <Text style={styles.text}>{'Done'}</Text>
        </TouchableOpacity>
      </View>
    )
    }

  return (
    <SafeAreaView>
      <>
        <View style={styles.container}>
          <Text style={[styles.text, { color: '#8B54A2', fontWeight: 'bold', fontSize: 40}]}>{'MAGNITUDE!!!'}</Text>
          {uuid ? scannedNotif() : null}
          <TextInput style={{ paddingTop: 20 }} value={searchStr} onChangeText={val => {
            console.log('val ', val)
            setSearchStr(val)
          }} placeholder={'Search Events'} onFocus={() => {
            setShowDropdown(true)
          }} onSubmitEditing={() => {
            // setShowDropdown(false)
          }} />
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <View style={{ flex: 1, marginHorizontal: 40, backgroundColor: '#a1a1a1', height: 1, alignItems: 'center', marginBottom: 10, marginTop: 4 }}>
            </View>
          </View>
          {
            !selectedEvent ? null :
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <View style={{ flex: 1, marginHorizontal: 40, backgroundColor: '#d1d1d1', borderRadius: 15, alignItems: 'center'}}>
                  <Text style={{fontSize: 14, padding: 20}}>{selectedEvent.name}</Text>
                </View>
              </View>

          }
          {
            !showDropdown ? null :
              <View style={{ marginHorizontal: 40, height: 250, marginTop: 20}}>
                <FlatList
                  style={{ backgroundColor: '#d1d1d1', borderRadius: 15, width: Dimensions.get('window').width - 100}}
                  data={displayedEvents}
                  keyExtractor={event => event.id}
                  renderItem={event => {
                    return (
                      <TouchableOpacity style={{ padding: 10, alignItems: 'center', padding: 20 }} onPress={() => {
                        console.log('EVENT: ', event)
                          setSelectedEvent(event.item)
                          setShowDropdown(false)
                          setSearchStr("")
                        }}>
                        <Text style={{ fontSize: 14 }}>{event.item.name}</Text>
                      </TouchableOpacity>
                    )
                  }}
                  ItemSeparatorComponent={() => {
                    return (
                      <View style={{ backgroundColor: 'black', height: 1, marginHorizontal: 5 }} />
                    )
                  }}
                />
              </View>
          }
          <TouchableOpacity style={{ backgroundColor: '#4AC8EF', alignItems: 'center', borderRadius: 5, marginTop: 40, padding: 10 }} onPress={() => {
            setForceScan(oldVal => !oldVal)
          }}>
            <Text style={styles.text}>{'Start Scanning'}</Text>
          </TouchableOpacity>
        </View>
        <RBSheet
          ref={sheetRef}
          height={200}
          openDuration={250}
          closeDuration={250}
          closeOnDragDown
          onClose={() => {
            setShowCompleteModal(false)
          }}
          customStyles={{
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
            draggableIcon: {
              backgroundColor: 'white'
            },
          }}
        >
          {sheetContent()}
        </RBSheet>
      </>
    </SafeAreaView>
  )
};

async function onPressSend(uid, eventID, eventType, setError, setShowComplete, sRef) {
  if (uid && eventID && eventType) {
    const code = await notifyEventAttendence(uid, eventID, eventType)
    setError(code)
    setShowComplete(true)
    sRef.current.open()
  } else {
    setError(420)
    setShowComplete(true)
  }
}

async function notifyAttendence(uid, eventID, eventType) {
  return await notifyEventAttendence(uid, eventID, eventType)
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
  },

  text: {
    fontFamily: 'Arial',
    fontSize: 20,
    padding: 10
  },
  sheetStyle: {
    flexDirection: 'column',
    backgroundColor: 'white',
    alignItems: 'center'
  }
});

export default Scanning;
