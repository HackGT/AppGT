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

class LoggedOut extends Component<Props> {
  constructor(props) {
    super(props);
    this.loginAlert();
  }

  loginAlert = (login) => {
    Alert.alert(
      'Login with HackGT',
      'Please Login to Continue!',
      [
        { text : 'Dismiss', onPress: () => console.log("Dismissed") },
        { text : 'Login', onPress: this.props.login }
      ],
      {cancelable: true},
    );
    this.setState({login: true});
  }

  state = {
    login: false
  }

  // loginAlert = (login) => {
  //   Alert.alert(
  //     'Login with HackGT',
  //     'Please Login to Continue!',
  //     [
  //       { text : 'Dismiss', onPress: () => console.log("Dismissed") },
  //       { text : 'Login', onPress: login }
  //     ],
  //     {cancelable: true},
  //   );
  //   this.state.login = true
  // }

  render() {
    return(
      <View>
        <View style={styleguide.card}>
          <StyledText>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam euismod dapibus nibh quis porttitor.</StyledText>
        </View>
        <TouchableOpacity
          onPress= {this.props.user ? this.props.logout : this.props.login}
          style={styleguide.button}
        >
          <StyledText style={{color: "white"}}>{this.props.user ? "Logout" : "Login"}</StyledText>
        </TouchableOpacity>
      </View>
    )
  }

}

export default LoggedOut;
