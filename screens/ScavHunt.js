import React, { Component } from "react";
import { View, Text, Button, Alert, Modal, TouchableOpacity, Image } from "react-native";
import { AuthContext } from "../App";
import QRCodeScanner from 'react-native-qrcode-scanner';
import DialogInput from 'react-native-dialog-input';
import AsyncStorage from "@react-native-community/async-storage";
import { styleguide } from '../styles'
import { colors } from "../themes";
import { StyledText, LoggedIn, LoggedOut } from "../components";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";


class ScavHunt extends Component<Props> {
    static navigationOptions = {
        title: "ScavHunt",
        headerLeft: null
    };

    // static context = React.createContext(AuthContext);
    //
    state = {
      login: false,
    };
    //
    // sendInput = (user, inputText) => {
    //   this.state.submit = false;
    //   this.forceUpdate();
    //   var details = {
    //     "question": this.state.values,
    //     "answer": inputText,
    //     "uuid": user.uuid
    //   };
    //
    //   var resBody = []
    //   for (property in details) {
    //     var encodedKey = encodeURIComponent(property);
    //     var encodedValue = encodeURIComponent(details[property]);
    //     resBody.push(encodedKey + "=" + encodedValue);
    //   }
    //   resBody = resBody.join("&");
    //
    //   return fetch('https://qa.hack.gt/check', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    //     },
    //     body: resBody,
    //   }).then((response) => response.json())
    //     .then((responseJson) => {
    //       console.log(responseJson);
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // }
    //
    // handleQRCode = (e) => {
    //   this.setState({ values: JSON.parse(e.data).title});
    //   this.state.qr = false;
    //   this.state.submit = true;
    //   this.forceUpdate();
    // }



    render() {
        return (
            <View style={styleguide.wrapperView}>
              <View style={styleguide.titleView}>
                <StyledText style={styleguide.title}>HackGT6: Scavenger Hunt</StyledText>
              </View>
                <AuthContext.Consumer>
                    {({ user, login, logout }) => {
                        if (!user) {
                          return(
                            <View>
                              <LoggedOut user={user} login={login} logout={logout} />
                            </View>
                          )
                        } else {
                          return(
                            <View>
                              <LoggedIn user={user} login={login} logout={logout} />
                            </View>
                          );
                        }
                    }}
                </AuthContext.Consumer>
            </View>
        );
    }
}

export default ScavHunt;
