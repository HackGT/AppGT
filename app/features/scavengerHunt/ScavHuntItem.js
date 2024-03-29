import React, { useRef, useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  ScrollView,
} from "react-native";
import { logInteraction } from "../../api/api";
import AsyncStorage from "@react-native-community/async-storage";
import RBSheet from "react-native-raw-bottom-sheet";
import QRCodeScanner from "react-native-qrcode-scanner";
import { ScavHuntContext } from "../../state/scavHunt";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import DismissModal from "../../../assets/images/DismissModal.svg";
import CorrectAnswer from "../../../assets/images/CorrectAnswer.svg";
import IncorrectAnswer from "../../../assets/images/IncorrectAnswer.svg";

export function ScavHuntItem(props) {
  const { state, completeQuestion, completeHint } = useContext(ScavHuntContext);
  const { firebaseUser } = useContext(AuthContext);
  const { dynamicStyles } = useContext(ThemeContext);
  const answerSheetRef = useRef();
  const qrSheetRef = useRef();
  const scanner = useRef(null);
  const item = props.route.params.item;
  const isComplete = state.completedQuestions.includes(item.id);

  let initScannedCode = null;
  // completed hints are of format '{id}-{hint}'\
  state.completedHints.forEach((h) => {
    const splitLoc = h.indexOf("-");
    if (splitLoc !== -1) {
      if (h.slice(0, splitLoc) === item.id) {
        initScannedCode = h.slice(splitLoc + 1);
        return;
      }
    }
  });

  const [scannedCode, setScannedCode] = useState(initScannedCode);

  const [answer, setAnswer] = useState(isComplete ? item.answer : "");
  const [showAnswerStatus, setShowAnswerStatus] = useState(isComplete);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(isComplete);

  const createAlert = (message) =>
    Alert.alert("Error", message, [
      {
        text: "OK",
        onPress: () => {
          if (scanner && scanner.current) {
            scanner.current.reactivate();
          }
        },
      },
    ]);

  const handleSubmitAnswer = async () => {
    setShowAnswerStatus(true);
    if (answer.toLowerCase() === item.answer.toLowerCase()) {
      setIsAnswerCorrect(true);
      completeQuestion(item.id);
      AsyncStorage.setItem(
        "completedQuestions",
        JSON.stringify(state.completedQuestions.concat([item.id]))
      );

      const token = await firebaseUser.getIdToken();
      const interactionResponse = await logInteraction(
        token,
        "scavenger-hunt",
        firebaseUser.uid,
        item.id
      );
      if (interactionResponse.status !== 200) {
        Alert.alert("Error", "There was an error logging your answer", [
          {
            text: "OK",
          },
        ]);
      }
    }
  };

  const onQRCodeScanned = async (e) => {
    setScannedCode(e.data);
    qrSheetRef.current.close();
    if (e.data === item.code) {
      completeHint(item);
    } else {
      createAlert(
        "Wrong QR code. Try again or visit the help desk for assistance!"
      );
    }
  };

  const qrSheetContent = () => {
    return (
      <View style={{ alignItems: "center" }}>
        <Text style={[styles.answerButtonText, dynamicStyles.text]}>
          Scan QR Code
        </Text>
        <QRCodeScanner
          ref={scanner}
          reactivate={false}
          fadeIn={false}
          showMarker
          markerStyle={{ borderColor: "white", borderWidth: 2 }}
          onRead={onQRCodeScanned}
          cameraStyle={{
            width: Dimensions.get("window").width,
            overflow: "hidden",
            alignSelf: "center",
          }}
        />
      </View>
    );
  };

  const answerSheetContent = () => (
    <View style={[styles.sheetStyle]}>
      <TouchableOpacity
        style={{ alignSelf: "flex-end", marginRight: 26 }}
        onPress={() => {
          answerSheetRef.current.close();
        }}
      >
        <DismissModal />
      </TouchableOpacity>
      <Text
        style={[styles.hintText, dynamicStyles.text, { paddingBottom: 15 }]}
      >
        {"What's the answer?"}
      </Text>
      <View
        style={[
          styles.answerInputContainer,
          dynamicStyles.searchBackgroundColor,
        ]}
      >
        <TextInput
          style={[styles.answerInput, dynamicStyles.text]}
          onChangeText={setAnswer}
          value={answer}
          placeholder={"Your Answer"}
        />
        {
          // answerStatus()
          showAnswerStatus ? (
            isAnswerCorrect ? (
              <CorrectAnswer style={{ marginRight: 5 }} />
            ) : (
              <IncorrectAnswer style={{ marginRight: 5 }} />
            )
          ) : null
        }
      </View>
      {isAnswerCorrect ? (
        <Text style={[styles.completeText, dynamicStyles.text]}>
          {"Complete"}
        </Text>
      ) : (
        <TouchableOpacity
          style={[styles.answerButton, { width: 200 }]}
          onPress={handleSubmitAnswer}
        >
          <Text style={[styles.answerButtonText, dynamicStyles.text]}>
            {"Submit"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const completed = () => {
    if (props.isComplete) {
      return (
        <View style={{ flexDirection: "row" }}>
          <Text>{"Completed!"}</Text>
        </View>
      );
    }
  };

  return (
    <ScrollView style={dynamicStyles.backgroundColor}>
      <View style={{ flex: 1, paddingBottom: 10 }}>
        <View
          style={{
            flexDirection: "column",
            paddingTop: 34,
            paddingHorizontal: 32,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.titleText, dynamicStyles.text]}>
              {item.title}
            </Text>
            {completed()}
          </View>
          <Text style={[styles.hintText, dynamicStyles.text]}>{item.hint}</Text>
          {item.isQR && (
            <TouchableOpacity
              disabled={scannedCode === item.code}
              style={[styles.answerButton]}
              onPress={() => {
                qrSheetRef.current.open();
              }}
            >
              <Text style={[styles.answerButtonText, dynamicStyles.text]}>
                {scannedCode === item.code ? "Completed!" : "Scan Code"}
              </Text>
            </TouchableOpacity>
          )}
          {!item.isQR && (
            <View style={{ paddingTop: 10 }}>
              <Text style={[styles.hintText, dynamicStyles.text]}>
                {item.question}
              </Text>
              <TouchableOpacity
                style={[styles.answerButton]}
                onPress={() => {
                  answerSheetRef.current.open();
                }}
                disabled={isComplete}
              >
                <Text style={[styles.answerButtonText, dynamicStyles.text]}>
                  {isComplete ? "Completed!" : "Input Answer"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <RBSheet
        ref={qrSheetRef}
        height={500}
        openDuration={250}
        closeDuration={250}
        closeOnDragDown
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: dynamicStyles.backgroundColor.backgroundColor,
          },
          draggableIcon: {
            backgroundColor: dynamicStyles.text.color,
          },
        }}
      >
        {qrSheetContent()}
      </RBSheet>
      <RBSheet
        ref={answerSheetRef}
        height={300}
        openDuration={250}
        closeDuration={250}
        closeOnDragDown
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: dynamicStyles.backgroundColor.backgroundColor,
          },
          draggableIcon: {
            backgroundColor: dynamicStyles.text.color,
          },
        }}
      >
        {answerSheetContent()}
      </RBSheet>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  answerButton: {
    marginTop: 32,
    backgroundColor: "#5DBCD2",
    alignItems: "center",
    borderRadius: 10,
  },

  answerButtonText: {
    padding: 17,
    fontFamily: "SpaceMono-Bold",
  },

  hintText: {
    paddingTop: 4,
    textAlign: "left",
    fontFamily: "SpaceMono-Regular",
    fontSize: 16,
    letterSpacing: 0.005,
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
    flexDirection: "column",
    alignItems: "center",
  },

  answerInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F3F3",
    borderRadius: 5,
    padding: 11,
    width: Dimensions.get("window").width - 80,
  },

  answerInput: {
    fontFamily: "SpaceMono-Regular",
    fontSize: 20,
    borderRadius: 5,
    padding: 11,
    flex: 1,
  },

  completeText: {
    fontFamily: "SpaceMono-Bold",
    fontSize: 20,
    marginTop: 32,
  },
});
