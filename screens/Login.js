import React, { Component } from 'react';
import { Text, Button } from 'react-native';
import { authorize } from 'react-native-app-auth';


const config = {
    clientId: '440020cd46e82fb1373d0f6ba814f755ed53d69bef28a4ea86d0473af9bc840c',
    clientSecret: '',
    redirectUrl: 'gt.hack.live://redirect',
    serviceConfiguration: {
      authorizationEndpoint: 'https://login.hack.gt/oauth/authorize',
      tokenEndpoint: 'https://login.hack.gt/oauth/token',
      revocationEndpoint: 'https://login.hack.gt/oauth/revoke'
    }
};
  
export default class Login extends Component<Props> {

    static navigationOptions = {
        title: 'Login',
        headerLeft: null
    };

    onClickLogin = async () => {
        console.log("test")
        // use the client to make the auth request and receive the authState
        try {
            const result = await authorize(config);
            // result includes accessToken, accessTokenExpirationDate and refreshToken
            console.log(result)
        } catch (error) {
            console.log(error);
        }
    }

    render() {

        return (
            <Button onPress={this.onClickLogin} title="Login" />
        )
    }
}