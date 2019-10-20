import React, { Component } from "react";
import {
  View,
  Modal as DefaultModal,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Button,
  Vibration
} from "react-native";
import Modal from "react-native-modal";
import {RNCamera} from "react-native-camera";
import AsyncStorage from "@react-native-community/async-storage";
import { styleguide } from "../styles";
import { colors } from "../themes";
import { StyledText, Location } from "../components";
import { faTimesCircle, faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

// TODO revamped UI
// TODO list of completed/incomplete puzzles (instead of score)
// TODO loading states
const CHECK_ENDPOINT = "https://qa.hack.gt/check";
const SCORE_ENDPOINT = "https://qa.hack.gt/score";

const fetchQA = (resString, endpoint) => {
  return fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: resString
  }).then(response => {
    if (!response.ok) {
      return {
        status: false,
        message: "Something went wrong. Our team is on it."
      };
    }
    try {
      return response.json();
    } catch (err) {
      return {
        status: false,
        message: "Something went wrong. Our team is on it."
      };
    }
  });
};

const FORM_CLOSED = 0,
  FORM_SUBMIT = 1,
  FORM_LOADING = 2,
  FORM_FEEDBACK = 3;
class LoggedIn extends Component<Props> {
  constructor(props) {
    super(props);
    this.getScores();
    this.state = {
      puzzle: {
        slug: "hi"
      },
      qr: false,
      formState: FORM_CLOSED,
      formMessage: "", // only used in feedback
      formInput: "",
      solvedQuestions: [],
      done: false,
      found: ["Rose Garden", "Lobster Beach", "Tea Party", "Mushroom Forest"],
      location: ""
    };
    AsyncStorage.getItem(
      "solvedQuestions",
      (error, result) =>
        result && this.setState({ solvedQuestions: JSON.parse(result) })
    );
    AsyncStorage.getItem(
      "scavDone",
      (error, result) => result && this.setState({ done: JSON.parse(result) })
    );
  }

  getPayload = (details = {}) => {
    const resBody = [];
    for (property in details) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(details[property]);
      resBody.push(encodedKey + "=" + encodedValue);
    }
    const encodedKey = encodeURIComponent("uuid");
    const encodedValue = encodeURIComponent(this.props.user.uuid);
    resBody.push(encodedKey + "=" + encodedValue);
    return resBody.join("&");
  };

  sendInput = () => {
    this.setState({ formState: FORM_LOADING });
    const { puzzle, formInput } = this.state;
    const resString = this.getPayload({
      question: puzzle.slug,
      answer: formInput
    });
    return fetchQA(resString, CHECK_ENDPOINT)
      .then(res => {
        // schema: message, status (bool), answered, done
        console.log("goodbye");

        const { status, message, answered: solvedQuestions, done } = res;
        this.setState({ formState: FORM_FEEDBACK, formMessage: message });
        if (!status) {
          return;
        }
        this.setState({ solvedQuestions, done });
        AsyncStorage.setItem(
          "solvedQuestions",
          JSON.stringify(solvedQuestions)
        );
        AsyncStorage.setItem("scavDone", JSON.stringify(done));
      })
      .catch(error => {
        console.error(error);
      });
  };

  getScores = () => {
    const resString = this.getPayload();
    return fetchQA(resString, SCORE_ENDPOINT)
      .then(res => {
        const { done, answered: solvedQuestions } = res;
        this.setState({ solvedQuestions, done });
        AsyncStorage.setItem(
          "solvedQuestions",
          JSON.stringify(solvedQuestions)
        );
        AsyncStorage.setItem("scavDone", JSON.stringify(done));
      })
      .catch(error => {
        console.error(error);
      });
  };

  handleQRCode = e => {
    Vibration.vibrate();
    this.setState({
      puzzle: JSON.parse(e.data),
      qr: false,
      formState: FORM_SUBMIT
    });
    this.setState({location: this.state.puzzle.title});
  };

  closeQR = () => {
    this.setState({ qr: false });
  };

  render() {
    const {
      solvedQuestions,
      formState,
      qr,
      done,
      formMessage,
      formInput,
      location
    } = this.state;

    return (

      <View>
        <View style={styleguide.card}>
          <StyledText style={styleguide.score}>
            Puzzles solved: {solvedQuestions.length}
          </StyledText>
          {done && (
            <StyledText>Save Beardell! Return to the Quest Board!</StyledText>
          )}
          { this.state.location !== "" &&
            <Location puzzle={this.state.puzzle} user={this.props.user} />
          }
          {!done && (
            <View style={{justifyContent: "center", textAlign: "center", alignItems: "center"}}>
              { this.state.found.length > 0 && this.state.found.indexOf("Lobster Beach") > -1 &&
                <View
                  style={styleguide.LobButton}>
                  <StyledText style={styleguide.LobText}>Lobster Beach</StyledText>
                </View>
              }

              { this.state.found.length > 0 && this.state.found.indexOf("Rose Garden") > -1 &&
                <View
                  style={styleguide.RoseButton}>
                  <StyledText style={styleguide.RoseText}>Rose Garden</StyledText>
                </View>
              }
              { this.state.found.length > 0 && this.state.found.indexOf("Mushroom Forest") > -1 &&
                <View
                  style={styleguide.ShroomButton}>
                  <StyledText style={styleguide.ShroomText}>Mushroom Forest</StyledText>
                </View>
              }
              { this.state.found.length > 0 && this.state.found.indexOf("Tea Party") > -1 &&
                <View
                  style={styleguide.TeaButton}>
                  <StyledText style={styleguide.TeaText}>Tea Party</StyledText>
                </View>
              }
            </View>
          )}
        </View>
        {!done && (
          <View style={styleguide.card}>
            <StyledText style={{ padding: 10 }}>
              Where to next? Splash around Lobster Beach, wander in the Mushroom
              Forest, sit at the Tea Party, and pick flowers in the Secret
              Garden!
            </StyledText>
            <TouchableOpacity
              onPress={() => {
                // this.setState({ formState: FORM_SUBMIT });
                this.setState({qr: true});
              }}
            >
              <View style={{ ...styleguide.button }}>
                <StyledText
                  style={{
                    color: "white",
                    paddingRight: 15
                  }}
                >
                  Found a Clue?
                </StyledText>
                <FontAwesomeIcon color="white" icon={faCamera} size={20} />
              </View>
            </TouchableOpacity>
            <View style={{ marginTop: 22 }}>
              <DefaultModal
                animationType="slide"
                transparent={false}
                visible={qr}
                style={{alignItems: "left", justifyContent: "left"}}
                onRequestClose={this.closeQR}
              >
                <RNCamera
                  onBarCodeRead={this.handleQRCode.bind(this)}
                  captureAudio={false}
                  style={{flex: 0, alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: 'transparent', height: "100%", width: "100%",}}
                >
                  <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: 'transparent'}}>
                    <TouchableOpacity
                      onPress={this.closeQR}
                      style={styleguide.cancelButton}
                    >
                      <FontAwesomeIcon
                        color="red"
                        icon={faTimesCircle}
                        size={30}
                      />
                    </TouchableOpacity>
                    <View style={{ height: "100%", width: "100%", backgroundColor: 'transparent'}} />
                  </View>
                </RNCamera>
              </DefaultModal>
            </View>
          </View>
        )}
      </View>
    );
  }
}

// const SubmissionModal = ({
//   onSubmit,
//   formState,
//   formMessage,
//   formInput,
//   setFormInput,
//   closeModal
// }) => {
//   return (
//     <Modal
//       isVisible={formState !== FORM_CLOSED}
//       hintInput={"Response"}
//       onBackButtonPress={closeModal}
//       onBackdropPress={closeModal}
//       closeDialog={() => {
//         this.setState({ formState: FORM_CLOSED });
//       }}
//     >
//       <View style={styles.content}>
//         {formState === FORM_SUBMIT && (
//           <View>
//             <View
//               style={{
//                 marginLeft: 8,
//                 marginBottom: 8
//               }}
//             >
//               <StyledText style={{ fontWeight: "bold" }}>Answer:</StyledText>
//               <TextInput
//                 value={formInput}
//                 onChangeText={setFormInput}
//                 style={{
//                   borderBottomColor: colors.darkGrayText,
//                   borderBottomWidth: 2
//                 }}
//               />
//             </View>
//             <TouchableOpacity
//               onPress={onSubmit}
//               style={
//                 formInput.length === 0
//                   ? styleguide.buttonDisabled
//                   : styleguide.button
//               }
//               disabled={formInput.length === 0}
//             >
//               <StyledText style={{ color: "white" }}>Submit</StyledText>
//             </TouchableOpacity>
//           </View>
//         )}
//
//         {formState === FORM_LOADING && (
//           <View>
//             <StyledText>Checking your answer...</StyledText>
//           </View>
//         )}
//
//         {formState === FORM_FEEDBACK && (
//           <View>
//             <StyledText>{formMessage}</StyledText>
//             <TouchableOpacity onPress={closeModal} style={styleguide.button}>
//               <StyledText style={{ color: "white" }}>Close</StyledText>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     </Modal>
//   );
// };

const styles = StyleSheet.create({
  qrTop: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
    paddingLeft: 20
  },
  qrBottom: {},
  content: {
    backgroundColor: "white",
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 18,
    borderRadius: 8,
    borderColor: "rgba(0, 0, 0, 0.1)",
    maxHeight: 600
  }
});
export default LoggedIn;
