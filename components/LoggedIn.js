import React, { Component } from "react";
import {
  View,
  Modal as DefaultModal,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Button,
  ScrollView,
  Vibration
} from "react-native";
import Modal from "react-native-modal";
import {RNCamera} from "react-native-camera";
import AsyncStorage from "@react-native-community/async-storage";
import { styleguide } from "../styles";
import { colors } from "../themes";
import { StyledText, Spacer } from "../components";
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

    console.log(this.props);
    this.setState({uuid: this.props.user.uuid});
    this.setState({login: this.props.login});
    this.setState({logout: this.props.logout});
    // this.setState({found: ["Rose", "Lobster", "Tea", "Mushroom"]});
    this.setState({formState: FORM_CLOSED});
    // this.setState({cameraType: Camera.constants.Type.back});

    //this.getScores();
  }


  state = {
    puzzle: {
      slug: "hi"
    },
    qr: true,
    formState: FORM_CLOSED,
    formMessage: "", // only used in feedback
    formInput: "",
    solvedQuestions: [],
    done: false,
    found: ["Rose", "Lobster", "Tea", "Mushroom"]
  };

  // sendInput = (inputText) => {
  //   this.setState({submit: false});
  //   var details = {
  //     "question": this.state.values,
  //     "answer": inputText,
  //     "uuid": this.state.uuid
  //   }
  //   this.getScores();
  //   this.state = {
  //     puzzle: {
  //       slug: "hi"
  //     },
  //     qr: false,
  //     formState: FORM_CLOSED,
  //     formMessage: "", // only used in feedback
  //     formInput: "",
  //     solvedQuestions: [],
  //     done: false
  //   };
  //   AsyncStorage.getItem(
  //     "solvedQuestions",
  //     (error, result) =>
  //       result && this.setState({ solvedQuestions: JSON.parse(result) })
  //   );
  //   AsyncStorage.getItem(
  //     "scavDone",
  //     (error, result) => result && this.setState({ done: JSON.parse(result) })
  //   );
  //   this.setState({qr: true});
  // }

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
    this.setState({qr: true});
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
    console.log(JSON.parse(e.data))
    this.setState({
      puzzle: JSON.parse(e.data),
      qr: false,
      formState: FORM_SUBMIT
    });
  };

  closeQR = () => {
    this.setState({ qr: false });
  };

  componentDidMount() {
    // AsyncStorage.getItem("Found", (error, result) => {
    //   if (error) {
    //     console.log("Error: " + error);
    //   } else {
    //     this.setState({found: result});
    //   }
    // });
    //
    // AsyncStorage.getItem("Solved", (error, result) => {
    //   if(error) {
    //     console.log("Error: " + error);
    //   } else {
    //     this.setState({solved: result});
    //   }
    // })
  }

  render() {
    const {
      solvedQuestions,
      formState,
      qr,
      done,
      formMessage,
      formInput
    } = this.state;
      return (
                <ScrollView contentContainerStyle={{flexDirection: "column", justifyContent: "center", textAlign: "center", alignItems: "center", paddingBottom: 100}}>
                  <View style={{justifyContent: "center", textAlign: "center", alignItems: "center"}}>
                    <View style={{justifyContent: "center", textAlign: "center", alignItems: "center"}}>
                      <StyledText style={{fontWeight: "bold", fontSize: 20}}>Scavenger Hunt</StyledText>
                      <StyledText>HackGT6: Into the Rabbit Hole</StyledText>
                    </View>
                    { this.state.qr && <RNCamera
                      onBarCodeRead={this.handleQRCode.bind(this)}
                      captureAudio={false}
                      style={{flex: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', height: 370, width: 278,}}
                    >
                      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'}}>
                        <View style={{ height: 370, width: 278, backgroundColor: 'transparent'}} />
                      </View>
                    </RNCamera> }
                    <View style={{justifyContent: "center", textAlign: "center", alignItems: "center"}}>
                      <View>
                        <StyledText>Scan QR Code to Begin</StyledText>
                      </View>
                      {this.state.found.length == 0 &&
                        <View style={{justifyContent: "center", textAlign: "center", alignItems: "center"}}>
                          <StyledText>No locations found yet :( </StyledText>
                          <StyledText>Check out the quest board near Help Desk to start exploring Wonderland!</StyledText>
                        </View>
                      }
                      {this.state.found.length > 0 &&
                        <View style={{justifyContent: "center", textAlign: "center", alignItems: "center"}}>
                          <StyledText>Show your tokens to Help Desk to collect a reward!</StyledText>
                          <StyledText>Locations Found</StyledText>
                        </View>

                      }
                      <View style={{justifyContent: "center", textAlign: "center", alignItems: "center", paddingRight: 100}}>

                      { this.state.found.length > 0 && this.state.found.indexOf("Lobster") > -1 &&
                        <TouchableOpacity
                          onPress={() => console.log("Lobster")}
                          style={styleguide.LobButton}>
                          <StyledText style={styleguide.LobText}>Lobster Beach</StyledText>
                        </TouchableOpacity>
                      }

                      { this.state.found.length > 0 && this.state.found.indexOf("Rose") > -1 &&
                        <TouchableOpacity
                          onPress={() => console.log("Rose")}
                          style={styleguide.RoseButton}>
                          <StyledText style={styleguide.RoseText}>Rose Garden</StyledText>
                        </TouchableOpacity>
                      }
                      { this.state.found.length > 0 && this.state.found.indexOf("Mushroom") > -1 &&
                        <TouchableOpacity
                          onPress={() => console.log("Shroom")}
                          style={styleguide.ShroomButton}>
                          <StyledText style={styleguide.ShroomText}>Mushroom Forest</StyledText>
                        </TouchableOpacity>
                      }
                      { this.state.found.length > 0 && this.state.found.indexOf("Tea") > -1 &&
                        <TouchableOpacity
                          onPress={() => console.log("Tea")}
                          style={styleguide.TeaButton}>
                          <StyledText style={styleguide.TeaText}>Tea Party</StyledText>
                        </TouchableOpacity>
                      }
                      </View>
                    </View>
                  </View>
                  <SubmissionModal
                    formState={formState}
                    formMessage={formMessage}
                    formInput={formInput}
                    setFormInput={formInput => this.setState({ formInput })}
                    onSubmit={this.sendInput}
                    closeModal={() =>
                      this.setState({
                        formInput: "",
                        formState: FORM_CLOSED
                      })
                    }
                  />
                </ScrollView>
      );
  }
}

const SubmissionModal = ({
  onSubmit,
  formState,
  formMessage,
  formInput,
  setFormInput,
  closeModal
}) => {
  return (
    <Modal
      isVisible={formState !== FORM_CLOSED}
      hintInput={"Response"}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      closeDialog={() => {
        this.setState({ formState: FORM_CLOSED });
      }}
    >
      <View style={styles.content}>
        {formState === FORM_SUBMIT && (
          <View>
            <View
              style={{
                marginLeft: 8,
                marginBottom: 8
              }}
            >
              <StyledText style={{ fontWeight: "bold" }}>Answer:</StyledText>
              <TextInput
                value={formInput}
                onChangeText={setFormInput}
                style={{
                  borderBottomColor: colors.darkGrayText,
                  borderBottomWidth: 2
                }}
              />
            </View>
            <TouchableOpacity
              onPress={onSubmit}
              style={
                formInput.length === 0
                  ? styleguide.buttonDisabled
                  : styleguide.button
              }
              disabled={formInput.length === 0}
            >
              <StyledText style={{ color: "white" }}>Submit</StyledText>
            </TouchableOpacity>
          </View>
        )}

        {formState === FORM_LOADING && (
          <View>
            <StyledText>Checking your answer...</StyledText>
          </View>
        )}

        {formState === FORM_FEEDBACK && (
          <View>
            <StyledText>{formMessage}</StyledText>
            <TouchableOpacity onPress={closeModal} style={styleguide.button}>
              <StyledText style={{ color: "white" }}>Close</StyledText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

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
