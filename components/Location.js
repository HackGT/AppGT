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
import AsyncStorage from "@react-native-community/async-storage";
import { styleguide } from "../styles";
import { colors } from "../themes";
import { StyledText, Spacer } from "../components";
import { faTimesCircle, faCamera } from "@fortawesome/free-solid-svg-icons";
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

class Location extends Component<Props> {
  constructor(props) {
    super(props);

    console.log(this.props);
    this.setState({uuid: this.props.user.uuid});
    this.setState({location: this.props.location});

    this.setState({formState: FORM_CLOSED});
  }


  state = {
    formState: FORM_CLOSED,
    formMessage: "", // only used in feedback
    formInput: "",
    done: false,
  };

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

  render() {
    return(
      <View>
        <Modal
          isVisible={this.state.show}
          onBackButtonPress={() => this.setState({show: false})}
          closeDialog={() => this.setState({show:false})}
        >

        </Modal>
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
    )
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

export default Location;
