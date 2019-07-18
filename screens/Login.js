import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { authorize } from 'react-native-app-auth';

const config = {
    clientId: '440020cd46e82fb1373d0f6ba814f755ed53d69bef28a4ea86d0473af9bc840c',
    clientSecret: '',
    redirectUrl: 'gt.hack.live://redirect',
    serviceConfiguration: {
        authorizationEndpoint: 'https://login.hack.gt/oauth/authorize',
        tokenEndpoint: 'https://login.hack.gt/oauth/token'
    }
};

export default class Login extends Component<Props> {

    static navigationOptions = {
        title: 'Login',
        headerLeft: null
    };

    state = {
        accessToken: '',
        user: null
    }

    isSignedIn() {
        return this.state.accessToken;
    }

    fetchUserDetails = (accessToken) => {
        fetch('https://login.hack.gt/api/user', {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + accessToken
            },
        }).then(response => response.json()).then(userData => {
            const name = userData.nameParts;
            this.setState({ user: {email: userData.email, name: userData.name, firstName: name.first, preferredName: name.preferred, lastName: name.last, uuid: userData.uuid} })
        });
    }

    onClickLogin = async () => {
        try {
            const result = await authorize(config);
            this.setState({ accessToken: result.accessToken })
            this.fetchUserDetails(result.accessToken)
        } catch (error) {
            console.log(error);
        }
    }

    onClickLogout = async () => {
        fetch('https://login.hack.gt/api/user/logout', {
            method: 'POST',
            headers: {
                Authorization: "Bearer " + this.state.accessToken
            },
        }).then((response) => this.setState({ accessToken: '', user: null }));
    }

    render() {
        const toggledTitle = this.isSignedIn() ? "Logout" : "Login";
        const toggledOnPress = this.isSignedIn() ? this.onClickLogout : this.onClickLogin;
        const { user } = this.state;

        return (
            <View>
                <Button onPress={toggledOnPress} title={toggledTitle} />
                {user && Object.keys(user).map(key => <Text>{key} - {user[key]}</Text>)}
            </View>

        )
    }
}