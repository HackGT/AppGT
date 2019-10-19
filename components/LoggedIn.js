import React, { Component } from "react";
import {
  View,
  Modal as DefaultModal,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Button
} from "react-native";
import Modal from "react-native-modal";
import QRCodeScanner from "react-native-qrcode-scanner";
import AsyncStorage from "@react-native-community/async-storage";
import { styleguide } from "../styles";
import { colors } from "../themes";
import { StyledText } from "../components";
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
    //this.getScores();
  }

  state = {
    login: false,
    isDialogVisible: true,
    qr: true,
    submit: false,
    found: ["Rose", "Lobster", "Tea", "Mushroom"],
    solved: ["Rose", "Lobster", "Tea", "Mushroom"]
  };

  sendInput = (inputText) => {
    this.setState({submit: false});
    var details = {
      "question": this.state.values,
      "answer": inputText,
      "uuid": this.state.uuid
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
      done: false
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
      return (
                <View style={styleguide.card}>
                  <View>
                    <Modal
                      animationType="slide"
                      transparent={false}
                      visible={this.state.qr}
                      onRequestClose={() => {
                        console.log('Modal has been closed.');
                      }}>
                      <QRCodeScanner
                        onRead={this.handleQRCode.bind(this)}
                        topContent={
                          <View style={styleguide.titleView}>
                            <StyledText style={styleguide.title}>Scavenger Hunt</StyledText>
                            <StyledText>HackGT6: Into the Rabbit Hole</StyledText>
                          </View>
                        }
                        bottomContent={
                          <View>
                            <View>
                              <StyledText>Scan QR Code to Begin</StyledText>
                            </View>
                            {
                              <View>
                              if (!this.state.found) {
                                <View>
                                  <StyledText>No locations found yet :( </StyledText>
                                    <StyledText>Check out the quest board near Help Desk to start exploring Wonderland!</StyledText>
                                </View>
                              } else {
                                <View>
                                <StyledText>Locations Found</StyledText>
                                if (this.state.found.find("Lobster")) {
                                  style = (this.state.solved.find("Lobster") ? styleguide.LobButton : styleguide.unsolvedButton)
                                  text = (this.state.solved.find("Lobster") ? styleguide.LobText : styleguide.unsolvedText)
                                  <TouchableOpacity
                                    onPress={() => console.log("Lobster")}
                                    style={style}>
                                    <StyledText style={text}>Lobster Beach</StyledText>
                                  </TouchableOpacity>
                                }
                                if (this.state.found.find("Rose")) {
                                  style = (this.state.solved.find("Rose") ? styleguide.RoseButton : styleguide.unsolvedButton)
                                  text = (this.state.solved.find("Rose") ? styleguide.RoseText : styleguide.unsolvedText)
                                  <TouchableOpacity
                                    onPress={() => console.log("Rose")}
                                    style={style}>
                                    <StyledText style={text}>Rose Garden</StyledText>
                                  </TouchableOpacity>
                                }
                                if (this.state.found.find("Mushroom")) {
                                  style = (this.state.solved.find("Mushroom") ? styleguide.ShroomButton : styleguide.unsolvedButton)
                                  text = (this.state.solved.find("Mushroom") ? styleguide.ShroomText : styleguide.unsolvedText)
                                  <TouchableOpacity
                                    onPress={() => console.log("Shroom")}
                                    style={style}>
                                    <StyledText style={text}>Mushroom Forest</StyledText>
                                  </TouchableOpacity>
                                }
                                if (this.state.found.find("Tea")) {
                                  style = (this.state.solved.find("Tea") ? styleguide.TeaButton : styleguide.unsolvedButton)
                                  text = (this.state.solved.find("Tea") ? styleguide.TeaText : styleguide.unsolvedText)
                                  <TouchableOpacity
                                    onPress={() => console.log("Tea")}
                                    style={style}>
                                    <StyledText style={text}>Tea Party</StyledText>
                                  </TouchableOpacity>
                                }
                                <StyledText>Show your tokens to Help Desk to collect a reward!</StyledText>
                                </View>
                              }
                              </View>
                            }
                            <TouchableOpacity
                              onPress={() => this.setState({qr: false})}
                              style={styleguide.cancelButton}>
                              <FontAwesomeIcon color="red" icon={faTimesCircle} size={30} />
                            </TouchableOpacity>
                          </View>
                        }
                        topViewStyle={{flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", paddingBottom: 50, paddingLeft: 20}}
                      />
                    </Modal>
                  // </View>
                  //   <DialogInput isDialogVisible={this.state.submit}
                  //     title={"Scavenger Hunt Response"}
                  //     message={this.state.values}
                  //     hintInput ={"Response"}
                  //     submitInput={(inputText) => {
                  //       this.sendInput(inputText);
                  //     } }
                  //     closeDialog={() => {
                  //       this.setState({submit: false});
                  //     }}>
                  //   </DialogInput>
                  // </View>
              </View>
            </View>
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
