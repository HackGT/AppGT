import React, { Component } from "react";
import {
  View,
  Modal as DefaultModal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Vibration
} from "react-native";
import Modal from "react-native-modal";
import {RNCamera} from "react-native-camera";
import AsyncStorage from "@react-native-community/async-storage";
import { styleguide } from "../styles";
import { colors } from "../themes";
import { StyledText, Location } from "../components";
import { faTimes, faCamera, faSync, faSpinner} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

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
      puzzle: null,
      qr: false,
      formState: FORM_CLOSED,
      formMessage: "", // only used in feedback
      formInput: "",
      solvedQuestions: [],
      done: false,
      location: false,
      load: false
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
        // AsyncStorage.setItem("scavDone", JSON.stringify(done));
      })
      .catch(error => {
        console.error(error);
      });
  };

  getScores = () => {
    // console.log("Fetching");
    const resString = this.getPayload();
    return fetchQA(resString, SCORE_ENDPOINT)
      .then(res => {
        const { done, answered: solvedQuestions } = res;
        this.setState({ solvedQuestions, done });
        AsyncStorage.setItem(
          "solvedQuestions",
          JSON.stringify(solvedQuestions)
        );
        // AsyncStorage.setItem("scavDone", JSON.stringify(done));
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
      location: true
      // formState: FORM_SUBMIT
    });
  };

  closeQR = () => {
    this.setState({ qr: false });
  };

  closePuzzleModal = () => {
    this.setState({
      puzzle: null,
      location: false
    });
  }

  finalPuzzle = () => {
    this.setState({
      puzzle: {
        slug: "final-stage-stage-5"
      },
      formState: FORM_SUBMIT
    });
  }

  render() {
    const {
      solvedQuestions,
      formState,
      qr,
      done,
      formMessage,
      formInput,
      location,
      puzzle
    } = this.state;

    return (

      <View>
        <View style={styleguide.card}>
          { solvedQuestions.length == 4 &&
            (<View>
              <StyledText>Dear hacker,  {"\n"}</StyledText>

              <StyledText>The Queen heard of how you have helped the creatures of Wonderland, and she has declared she will behead you! You must go back to safety. To escape, there is one last riddle you must solve. Go back to the quest board, and find the key to the exit: {"\n"}</StyledText>

              <StyledText style={{fontStyle: "italic"}}>Spin a yarn, tell your tale</StyledText>
              <StyledText style={{fontStyle: "italic"}}>of the colorful adventures you will keep without fail</StyledText>
              <StyledText style={{fontStyle: "italic"}}>In a world of tangles and knots, it is easy to go astray</StyledText>
              <StyledText style={{fontStyle: "italic"}}>Let your new found wisdom point the way{"\n"}</StyledText>

              <StyledText>I wish you the best of luck!</StyledText>
              <StyledText>Beardell</StyledText>

              <TouchableOpacity
                onPress={() => this.finalPuzzle()}
                style={{
                  marginTop: 10,
                  ...styleguide.button,
                }}
              >
                <StyledText style={{color: "white"}}>Input Answer</StyledText>
              </TouchableOpacity>
            </View>)
          }
          { location &&
            <Location
              puzzle={puzzle}
              user={this.props.user}
              closePuzzleModal={this.closePuzzleModal}
              setSolvedQuestions={(solvedQuestions) => this.setState({solvedQuestions})}
              solvedQuestions={solvedQuestions}
              setDone={(done) => this.setState({done})}
            />
          }
          { done && (
            <View>
              <StyledText>Congratulations! You have successfully escaped the wrath of the Queen, and helped Beardell uncover the mysteries of Wonderland.{"\n"}</StyledText>
              <StyledText>Go to Help Desk to receive your prize. Thanks for playing!</StyledText>
            </View>
          )}
          {solvedQuestions.length == 0 && (
            <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-start"}}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({load: true});
                  this.getScores()
                    .then(() => {
                      this.setState({load: false});
                    });
                }}
                style={{width: 30, height: 30}}
              >
                <FontAwesomeIcon
                  color="black"
                  icon={faSync}
                  size={20}
                />
              </TouchableOpacity>
              <StyledText style={styleguide.score}>
                {this.state.load ? "Loading score..." : "No puzzles solved yet :("}
              </StyledText>
            </View>
          )}
          {!done && solvedQuestions.length > 0 && (
            <View>
              <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-start"}}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({load: true});
                    this.getScores()
                      .then(() => {
                        this.setState({load: false});
                      });
                  }}
                  style={{width: 30, height: 30}}
                >
                  <FontAwesomeIcon
                    color="black"
                    icon={faSync}
                    size={20}
                  />
                </TouchableOpacity>
                <StyledText style={styleguide.score}>
                  {this.state.load ? "Loading score..." : "Puzzles solved:"}
                </StyledText>
              </View>
              <View style={{justifyContent: "center", textAlign: "center", alignItems: "center"}}>
                { solvedQuestions.indexOf("lobster-beach-stage-2") > -1 &&
                  <View
                    style={styleguide.LobButton}>
                    <StyledText style={styleguide.LobText}>Lobster Beach</StyledText>
                  </View>
                }
                { solvedQuestions.indexOf("rose-garden-stage-1") > -1 &&
                  <View
                    style={styleguide.RoseButton}>
                    <StyledText style={styleguide.RoseText}>Rose Garden</StyledText>
                  </View>
                }
                { solvedQuestions.indexOf("button-wall-stage-4") > -1 &&
                  <View
                    style={styleguide.ShroomButton}>
                    <StyledText style={styleguide.ShroomText}>Mushroom Forest</StyledText>
                  </View>
                }
                { solvedQuestions.indexOf("tea-party-stage-3") > -1 &&
                  <View
                    style={styleguide.TeaButton}>
                    <StyledText style={styleguide.TeaText}>Tea Party</StyledText>
                  </View>
                }
              </View>
            </View>
          )}
        </View>
        {solvedQuestions.length < 4 && (
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
              <View style={ styleguide.button }>
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
                  onBarCodeRead={this.handleQRCode}
                  captureAudio={false}
                  style={{flex: 0, alignItems: 'flex-start', justifyContent: 'flex-start', backgroundColor: 'transparent', height: "100%", width: "100%",}}
                >
                  <TouchableOpacity
                    onPress={this.closeQR}
                    style={{
                      ...styleguide.cancelButton,
                      position: "absolute",
                      top: 8,
                      left: 8,
                      backgroundColor: "white",
                      borderRadius: 25,
                    }}
                  >
                    <FontAwesomeIcon
                      color="red"
                      icon={faTimes}
                      size={30}
                    />
                  </TouchableOpacity>
                </RNCamera>
              </DefaultModal>
            </View>
          </View>

        )}
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
