import React, { Component } from "react";
import { View, Text, Button, Alert, Modal, TouchableOpacity, Image } from "react-native";
import { AuthContext } from "../App";
import QRCodeScanner from 'react-native-qrcode-scanner';
import DialogInput from 'react-native-dialog-input';
import AsyncStorage from "@react-native-community/async-storage";
import { styleguide } from '../styles'
import { colors } from "../themes";
import { StyledText } from "../components";
import { faTimesCircle, faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

class LoggedIn extends Component<Props> {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.setState({uuid: this.props.user.uuid});
    this.setState({login: this.props.login});
    this.setState({logout: this.props.logout});
    this.getScores();
  }

  state = {
    login: false,
    isDialogVisible: true,
    qr: false,
    submit: false,
  };

  sendInput = (inputText) => {
    this.setState({submit: false});
    var details = {
      "question": this.state.values,
      "answer": inputText,
      "uuid": this.state.uuid
    };

    var resBody = []
    for (property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      resBody.push(encodedKey + "=" + encodedValue);
    }
    resBody = resBody.join("&");

    return fetch('https://qa.hack.gt/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: resBody,
    }).then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        Alert.alert(
          'Response',
          responseJson.message,
          [
            { text : 'Dismiss', onPress: () => console.log("Dismissed") },
          ],
          {cancelable: true},
        );
        this.getScores();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getScores = () => {
    var details = {
      "uuid": this.state.uuid
    };
    console.log("**********************UUID: " + this.state.uuid)

    var resBody = []
    for (property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      resBody.push(encodedKey + "=" + encodedValue);
    }
    resBody = resBody.join("&");

    return(fetch('https://qa.hack.gt/num_questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: resBody,
      }).then((response) =>
        response.json()).then((res) => {
          console.log(res);
          this.setState({score: res.num_done});
        }).catch((error) => {
          console.error(error);
        }));
  }

  handleQRCode = (e) => {
    this.setState({ values: JSON.parse(e.data).question});
    this.setState({qr: false});
    this.setState({submit: true});
  }

  render() {
      return (
              <View>
                <View style={styleguide.card}>
                  <StyledText style={styleguide.score}>Score: {this.state.score}</StyledText>
                </View>
                <View style={styleguide.card}>
                  <StyledText style={{padding: 10}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam euismod dapibus nibh quis porttitor.</StyledText>
                  <TouchableOpacity
                    onPress= {() => {
                      this.setState({qr: true})}}
                    style={styleguide.button}>
                    <StyledText style={{color: "white", paddingRight: 15}}>Found a Clue?</StyledText>
                    <FontAwesomeIcon color="white" icon={faCamera} size={28} />
                  </TouchableOpacity>
                  <View style={{marginTop: 22}}>
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
                          <View style={styleguide.qrView}>
                            <StyledText style={styleguide.qr}>Scan the QR code!</StyledText>
                          </View>
                        }
                        bottomContent={
                          <TouchableOpacity
                            onPress={() => this.setState({qr: false})}
                            style={styleguide.cancelButton}>
                            <FontAwesomeIcon color="red" icon={faTimesCircle} size={30} />
                          </TouchableOpacity>
                        }
                        topViewStyle={{flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", paddingBottom: 50, paddingLeft: 20}}
                      />
                    </Modal>
                  </View>
                    <DialogInput isDialogVisible={this.state.submit}
                      title={"Scavenger Hunt Response"}
                      message={this.state.values}
                      hintInput ={"Response"}
                      submitInput={(inputText) => {
                        this.sendInput(inputText);
                      } }
                      closeDialog={() => {
                        this.setState({submit: false});
                      }}>
                    </DialogInput>
                  </View>
              </View>
      );
  }
}

export default LoggedIn;
