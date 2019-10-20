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

    switch (this.props.puzzle.title) {
      case "Lobster Beach":
        img = lob_back;
        break;

      case "Rose Garden":
        img = rose_back;
        break;

      case "Mushroom Forest":
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
      puzzle: this.props.puzzle,
      show: true,
      image: lob_back,
      uuid: "",
      image: img
    };

    console.log(this.props);
    this.setState({uuid: this.props.user.uuid});
    this.setState({puzzle: this.props.puzzle});
    console.log(this.state.puzzle);


    this.setState({formState: FORM_CLOSED});
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

  closeModal = () => {
    this.setState({show: false});
    this.props.refreshModal();
  }

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
        // this.setState({ solvedQuestions, done });
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
      show,
      image,
      puzzle,
      formInput
    } = this.state;
    return(
      <View>
        <Modal
          isVisible={show}
          onRequestClose={() => this.setState({show:false})}
          animationType="slide"
          transparent={false}
        >
          <View style={{width: "100%", height: "100%", backgroundColor: "white"}}>
            <TouchableOpacity
              onPress={this.closeModal}
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
              <Image source={image} style={{width: "100%", height: 250, top: 0}}/>
            </View>
            <StyledText> {puzzle.question} </StyledText>
            <TouchableOpacity
              onPress={() => this.setState({formState: FORM_SUBMIT})}
              style={{
                marginTop: 10,
                ...styleguide.button,
              }}
            >
              <StyledText style={{color: "white"}}>Input Answer</StyledText>
            </TouchableOpacity>
          </View>
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

export default Location;
