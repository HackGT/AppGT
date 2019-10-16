import React, { Component } from "react";
import { View, Text, Button, Alert, Modal } from "react-native";
import { AuthContext } from "../App";
import QRCodeScanner from 'react-native-qrcode-scanner';
import DialogInput from 'react-native-dialog-input';
import AsyncStorage from "@react-native-community/async-storage";
import { styleguide } from '../styles'
import { colors } from "../themes";

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
      score: 0,
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
      if (user) {
        this.state.user = user;
        return(
          <Button
            title="Found a clue?"
            onPress= {() => {
              this.state.qr = true;
              this.forceUpdate();
            }
            }
            color={colors.primaryBlue}
          />
        );
      }
    }

    renderScores = (user) => {
      if (user) {
        return(<Text style={styleguide.score}>Score: TEST</Text>);
      }
    }

    static getDerivedStateFromProps(nextProps, state) {
      console.log("Doesn't work rn");
    }

    render() {
        return (
            <View style={styleguide.wrapperView}>
                <AuthContext.Consumer>
                    {({ user, login, logout }) => {
                        if (!user && !this.state.login) {
                          this.loginAlert(login)
                        }
                        return(
                          <View>
                            <View style={styleguide.titleView}>
                              <Text style={styleguide.title}>HackGT6: Into the Scavenger Hunt!</Text>
                            </View>
                            <View style={styleguide.card}>
                              <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam euismod dapibus nibh quis porttitor.</Text>
                              {this.renderScores(user)}
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
                              <Button
                                title={user ? "Logout" : "Login"}
                                onPress= {user ? logout : login}
                                color={colors.primaryBlue}
                              />
                          </View>
                        )
                    }}
                </AuthContext.Consumer>
            </View>
        );
    }
}

export default ScavHunt;
