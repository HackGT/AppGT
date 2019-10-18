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
        //this.getScores();
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

export default LoggedIn;
