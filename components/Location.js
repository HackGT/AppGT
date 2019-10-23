import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Button,
  ScrollView,
  Vibration,
  Modal as DefaultModal
} from "react-native";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-community/async-storage";
import { styleguide } from "../styles";
import { colors } from "../themes";
import { StyledText, Spacer } from "../components";
import { faTimesCircle, faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { lob_back, rose_back, shroom_back, tea_back } from "../images";

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

class Location extends Component<Props> {
  constructor(props) {
    super(props);

    img = null;

    switch (this.props.puzzle.slug) {
      case "lobster-beach-stage-2":
        img = lob_back;
        break;

      case "rose-garden-stage-1":
        img = rose_back;
        break;

      case "button-wall-stage-4":
        img = shroom_back;
        break;

      default:
        img = tea_back;
    }

    this.state = {
      formState: FORM_CLOSED,
      formMessage: "", // only used in feedback
      formInput: "",
      done: false,
      image: img
    };
  }

  reset = () => {
    if (!!this.props.closePuzzleModal)
      this.props.closePuzzleModal();
    this.setState({
      formState: FORM_CLOSED,
      formMessage: "",
      formInput: ""
    });
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
    const { puzzle, setSolvedQuestions, setDone } = this.props;
    const { formInput } = this.state;
    const resString = this.getPayload({
      question: puzzle.slug,
      answer: formInput
    });
    return fetchQA(resString, CHECK_ENDPOINT)
      .then(res => {
        // schema: message, status (bool), answered, done
        const { status, message, answered: solvedQuestions, done } = res;
        if (!status) {
          this.setState({ formState: FORM_FEEDBACK, formMessage: message });
          return;
        }
        setSolvedQuestions(solvedQuestions);
        setDone(done);
        this.setState({ formState: FORM_FEEDBACK, formMessage: message, solvedQuestions, done });
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

  render() {
    const {
      formState,
      formMessage,
      image,
      formInput,
    } = this.state;

    const { puzzle, solvedQuestions } = this.props;
    const completed = puzzle && solvedQuestions.includes(puzzle.slug);
    return(
      <View>
        <Modal
          isVisible={true}
          onRequestClose={this.reset}
          animationType="slide"
          transparent={false}
        >
          <View style={{width: "100%", height: "100%", backgroundColor: "white"}}>
            <TouchableOpacity
              onPress={this.reset}
              style={{
                zIndex: 1,
                ...styleguide.cancelButton,
                position: "absolute",
              }}
            >
              <FontAwesomeIcon
                color="red"
                icon={faTimesCircle}
                size={30}
              />
            </TouchableOpacity>
            <View>
              <Image source={image} style={{width: "100%", height: 250, top: 0, marginBottom: 10}}/>
            </View>

            {
              this.state.formState !== FORM_SUBMIT && (
              <View style={{
                alignItems: "center",
              }}>
                <View style={{
                  marginTop: 4,
                  paddingHorizontal: 10
                }}>
                  <StyledText style={{fontWeight: "bold"}}> {puzzle.title} </StyledText>
                  <StyledText> {puzzle.question} </StyledText>
                </View>
                { completed ? <StyledText style={{fontWeight: "bold"}}>Puzzle complete</StyledText> :
                  <TouchableOpacity
                  onPress={() => this.setState({formState: FORM_SUBMIT})}
                  style={{
                    marginTop: 10,
                    ...styleguide.button,
                  }}
                  >
                  <StyledText style={{color: "white"}}>Input Answer</StyledText>
                </TouchableOpacity>
                }
              </View>
              )
            }
            <SubmissionSnippet
              formState={formState}
              formMessage={formMessage}
              formInput={formInput}
              setFormInput={formInput => this.setState({ formInput })}
              onSubmit={this.sendInput}
            />

          </View>
        </Modal>
      </View>
    )
  }
}

const SubmissionSnippet = ({
  onSubmit,
  formState,
  formMessage,
  formInput,
  setFormInput,
}) => {
  return (
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
        <StyledText>Checking your answer...</StyledText>
      )}

      {formState === FORM_FEEDBACK && (
          <StyledText>{formMessage}</StyledText>
      )}
    </View>
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
    paddingTop: 10,
    paddingBottom: 18,
    borderRadius: 8,
    borderColor: "rgba(0, 0, 0, 0.1)",
    maxHeight: 600,
    justifyContent: "center"
  }
});

export default Location;
