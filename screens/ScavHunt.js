import React, { Component } from "react";
import { View, Text, Button, Alert, Modal, TouchableOpacity, Image } from "react-native";
import { AuthContext } from "../App";
import QRCodeScanner from 'react-native-qrcode-scanner';
import DialogInput from 'react-native-dialog-input';
import AsyncStorage from "@react-native-community/async-storage";
import { styleguide } from '../styles'
import { colors } from "../themes";
import { StyledText } from "../components";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";


class ScavHunt extends Component<Props> {
    static navigationOptions = {
        title: "ScavHunt",
        headerLeft: null
    };

    static context = React.createContext(AuthContext);

    state = {
      login: false,
      isDialogVisible: true,
      qr: false,
      submit: false,
      user: null
    };

    displayUserData = user => {
        return (
            user &&
            Object.keys(user).map((key, index) => (
                <Text key={index}>
                    {key} - {user[key]}
                </Text>
            ))
        );
    };

    sendInput = (user, inputText) => {
      this.state.submit = false;
      this.forceUpdate();
      var details = {
        "question": this.state.values,
        "answer": inputText,
        "uuid": user.uuid
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
        })
        .catch((error) => {
          console.error(error);
        });
    }

    handleQRCode = (e) => {
      this.setState({ values: JSON.parse(e.data).title});
      this.state.qr = false;
      this.state.submit = true;
      this.forceUpdate();
    }

    loginAlert = (login) => {
      Alert.alert(
        'Login with HackGT',
        'Please Login to Continue!',
        [
          { text : 'Dismiss', onPress: () => console.log("Dismissed") },
          { text : 'Login', onPress: login }
        ],
        {cancelable: true},
      );
      this.state.login = true
    }

    renderQRButton = (user) => {
      if (!user) return null;

      this.state.user = user;
      return(
        <TouchableOpacity
          onPress= {() => {
            this.state.qr = true;
            this.forceUpdate();}}
          style={styleguide.button}>
          <Text style={{color: "white", paddingRight: 15}}>Found a Clue?</Text>
          <FontAwesomeIcon color="white" icon={faCamera} size={28} />
        </TouchableOpacity>
      );
    }

    renderScores = (user) => {
      if (user) {
        this.getScores(user);
        return(<Text style={styleguide.score}>Score: {this.state.score}</Text>);
      }
    }

    getScores = (user) => {
      if (user) {
        var details = {
          "uuid": user.uuid
        };
        console.log("**********************UUID: " + user.uuid)

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
    }

    render() {
        return (
            <View style={styleguide.wrapperView}>
                <AuthContext.Consumer>
                    {({ user, login, logout }) => {
                        if (!user && !this.state.login) {
                          this.loginAlert(login);
                        }
                        return(
                          <View>
                            <View style={styleguide.titleView}>
                              <StyledText style={styleguide.title}>HackGT6: Scavenger Hunt!</StyledText>
                            </View>
                            <View style={styleguide.card}>
                              {this.renderScores(user)}
                            </View>
                            <View style={styleguide.card}>
                              <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam euismod dapibus nibh quis porttitor.</Text>
                              {this.renderQRButton(user)}
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
                                      <Text style={styleguide.qr}>Scan the QR code!</Text>
                                    }
                                  />
                                </Modal>
                              </View>
                                <DialogInput isDialogVisible={this.state.submit}
                                  title={"Scavenger Hunt Response"}
                                  message={this.state.values}
                                  hintInput ={"Response"}
                                  submitInput={ (user, inputText) => {
                                    this.sendInput(user, inputText);
                                  } }
                                  closeDialog={() => {
                                    this.state.submit = false;
                                    this.forceUpdate();
                                  }}>
                                </DialogInput>
                              </View>
                              <TouchableOpacity
                                onPress= {user ? logout : login}
                                style={styleguide.button}
                              >
                                <Text style={{color: "white"}}>{user ? "Logout" : "Login"}</Text>
                              </TouchableOpacity>
                          </View>
                        )
                    }}
                </AuthContext.Consumer>
            </View>
        );
    }
}

export default ScavHunt;
