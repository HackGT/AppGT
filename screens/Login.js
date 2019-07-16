import React, { Component } from 'react';
import { Text, Button } from 'react-native';
import { authorize } from 'react-native-app-auth';


/*
        const config = {
            issuer: '<YOUR_ISSUER_URL>',
            clientId: '<YOUR_CLIENT_ID>',
            redirectUrl: '<YOUR_REDIRECT_URL>',
            scopes: ['<YOUR_SCOPES_ARRAY>'],
        };

*/

const config = {
    issuer: 'https://demo.identityserver.io',
    clientId: 'native.code',
    redirectUrl: 'io.identityserver.demo:/oauthredirect',
    additionalParameters: {},
    scopes: ['openid', 'profile', 'email', 'offline_access']
  
    // serviceConfiguration: {
    //   authorizationEndpoint: 'https://demo.identityserver.io/connect/authorize',
    //   tokenEndpoint: 'https://demo.identityserver.io/connect/token',
    //   revocationEndpoint: 'https://demo.identityserver.io/connect/revoke'
    // }
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