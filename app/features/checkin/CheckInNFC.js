import React, { useContext } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { ThemeContext } from "../../contexts/ThemeContext";
import { initNfc, writeNFC } from '../../NFCScanning/nfc';
import BadgeJudge from '../../../assets/images/BadgeJudge.png';
import BadgeMentor from '../../../assets/images/BadgeMentor.png';
import BadgeOrganizer from '../../../assets/images/BadgeOrganizer.png';
import BadgeParticipant from '../../../assets/images/BadgeParticipant.png';
import BadgeSponsor from '../../../assets/images/BadgeSponsor.png';
import BadgeVolunteer from '../../../assets/images/BadgeVolunteer.png';


export function CheckInNFC(props) {
  const { application } = props.route.params
  const { dynamicStyles } = useContext(ThemeContext);

  useEffect(async () => {

    const cleanUp = await initNfc((scannedText) => { onScan(scannedText) })

    return () => cleanUp()
  }, [])

  const tagImage = (branch) => {
    const source = null
    switch(branch) {
      case 'PARTICIPANT':
        source = BadgeParticipant;
        break;
      case 'MENTOR':
        source = BadgeMentor;
        break;
      case 'JUDGE':
        source = BadgeJudge;
        break;
      case 'ORGANIZER':
        source = BadgeOrganizer;
        break;
      case 'SPONSOR':
        source = BadgeSponsor;
        break;
      case 'VOLUNTEER':
        source = BadgeVolunteer;
        break;
      default:
        return null;
    }
    if (source === null) return null;
    return <Image source={source} style={{ width: Dimensions.get("window").width - 80, resizeMode: 'contain', backgroundColor: 'red' }} />

  }

  const createAlert = (message) =>
    Alert.alert("Error", message, [
      {
        text: "OK",
        onPress: () => {
          onPressScan()
        },
      },
    ]);

  const onPressScan = async () => {
    const success = await writeNFC(JSON.stringify({uid: application.userId}))
    if (!success) {
      createAlert("There was an issue writing to the badge. Try again.")
    }
  }

  return (
    <View style={[dynamicStyles.backgroundColor, { flex: 1 }]}>
      <View style={{ alignItems: 'center', paddingTop: 40 }}>
        <Text style={{
            color: dynamicStyles.toggleText.color,
            fontFamily: "SpaceMono-Bold",
            fontSize: 20
        }}>
          {'Name: ' + application.name}
        </Text>
        <Text style={{
          color: dynamicStyles.toggleText.color,
          fontFamily: "SpaceMono-Bold",
          fontSize: 20
        }}>
          {'Email: ' + application.email}
        </Text>
        <Text style={{
          color: dynamicStyles.toggleText.color,
          fontFamily: "SpaceMono-Bold",
          fontSize: 20
        }}>
          {'User ID: ' + application.userId}
        </Text>
        <Text style={{
          color: dynamicStyles.toggleText.color,
          fontFamily: "SpaceMono-Bold",
          fontSize: 20
        }}>
          {'Application Group: ' + application.confirmationBranch.applicationGroup}
        </Text>
        <TouchableOpacity onPress={onPressScan}>
          <Text style={{
            color: dynamicStyles.toggleText.color,
            fontFamily: "SpaceMono-Bold",
            fontSize: 20
          }}>
            {'Scan Badge'}
          </Text>
        </TouchableOpacity>
        {tagImage(application.confirmationBranch.applicationGroups)}
      </View>
    </View>
  )
}