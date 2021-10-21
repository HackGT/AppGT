import React, { useRef, useState } from "react";

import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { HackathonContext, ThemeContext } from "../context";
import { fetchServerTime } from "../cms";
import moment from "moment-timezone";
import { scavHuntData } from "./scavenger-hunt-data";
import DismissModal from "../assets/DismissModal.svg";
import CorrectAnswer from "../assets/CorrectAnswer.svg";
import IncorrectAnswer from "../assets/IncorrectAnswer.svg";

export function ScavHuntItem(props) {
    const sheetRef = useRef()
    const item = props.route.params.item
    const [modalVisible, setModalVisible] = useState(false)
    const [answer, setAnswer] = useState('')
    const [showAnswerStatus, setShowAnswerStatus] = useState(false)
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false)


    const answerStatus = () => {
      console.log("answer status: ", showAnswerStatus, isAnswerCorrect)
      if (showAnswerStatus) {
        isAnswerCorrect ? <CorrectAnswer/> : <IncorrectAnswer/>
      }
    }

    const sheetContent = () => (
      <View style={[styles.sheetStyle]}>
        <TouchableOpacity style={{alignSelf: 'flex-end', marginRight: 26}} onPress={() => {
          setModalVisible(false)
          sheetRef.current.close()
        }}>
          <DismissModal/>
        </TouchableOpacity>
        <Text style={[styles.hintText, {paddingBottom: 15}]}>{'What\'s the answer?'}</Text>
        <View style={styles.answerInputContainer}>
          <TextInput
            style={styles.answerInput}
            onChangeText={setAnswer}
            value={answer}
            placeholder={"Your Answer"}
          />
          {
            // answerStatus()
            showAnswerStatus ?
              (isAnswerCorrect ? <CorrectAnswer style={{marginRight: 5}}/> : <IncorrectAnswer style={{marginRight: 5}}/>) :
              null
          }
          
        </View>
        {
          isAnswerCorrect ?
          <Text style={[styles.completeText]}>{'Complete'}</Text> :
          <TouchableOpacity style={[styles.answerButton, { width: 200 }]} onPress={() => {
            setShowAnswerStatus(true)
            setIsAnswerCorrect(answer === item.answer)
          }}>
            <Text style={[styles.answerButtonText]}>{'Submit'}</Text>
          </TouchableOpacity>
        }
      </View>
    )

    const completed = () => {
      if (props.isComplete) {
        return (
          <View style={{flexDirection:'row'}}>
            <Text>{'Completed!'}</Text>
          </View>
        )
      }
    }

    return (
      <>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <View style={{flexDirection: 'column', paddingTop: 34, paddingHorizontal: 32}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.titleText]}>{item.title}</Text>
              {
                completed()
              }
            </View>
            <Text style={[styles.hintText]}>{item.hint}</Text>
            <TouchableOpacity style={[styles.answerButton]} onPress={() => {
              setModalVisible(true)
              sheetRef.current.open()
              // sheetRef.current.snapTo(0)
            }}>
              <Text style={[styles.answerButtonText]}>{'Input Answer'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <RBSheet
            ref={sheetRef}
            height={300}
            openDuration={250}
            closeDuration={250}
            closeOnDragDown
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
            { sheetContent() }
          </RBSheet>
      </>
    )
}

const styles = StyleSheet.create({
  answerButton: {
    marginTop: 32,
    backgroundColor: '#5DBCD2',
    alignItems: 'center',
    borderRadius: 10
  },

  answerButtonText: {
    padding: 17,
    fontFamily: 'SpaceMono-Bold',
    color: 'white'
  },

  hintText: {
    paddingTop: 4,
    textAlign: "left",
    fontFamily: "SpaceMono-Regular",
    fontSize: 16,
    letterSpacing: 0.005
  },

  joinEvent: {
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    flex: 0.5,
  },

  titleText: {
    paddingTop: 5,
    textAlign: "center",
    fontFamily: "SpaceMono-Bold",
    fontSize: 24,
    letterSpacing: 0.005,
  },

  sheetStyle: {
    flexDirection: 'column',
    backgroundColor: 'white',
    alignItems: 'center'
  },

  answerInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 5,
    padding: 11,
    width: Dimensions.get('window').width - 80
  },

  answerInput: {
    fontFamily: 'SpaceMono-Regular',
    fontSize: 20,
    borderRadius: 5,
    padding: 11,
    flex: 1
  },

  completeText: {
    fontFamily: "SpaceMono-Bold",
    fontSize: 20,
    marginTop: 32
  }
});