import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { authorize } from 'react-native-app-auth';
import AsyncStorage from '@react-native-community/async-storage';

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

    componentWillMount() {
        AsyncStorage.getItem('userData', (error, result) => result && this.setState({ user: JSON.parse(result) }));
        AsyncStorage.getItem('accessToken', (error, result) => result && this.setState({ accessToken: result }));
    }

    isSignedIn() {
        return this.state.user;
    }

    fetchUserDetails = async (accessToken) => {
        fetch('https://login.hack.gt/api/user', {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + accessToken
            },
        }).then(response => response.json()).then(userData => {
            const name = userData.nameParts;
            const user = { email: userData.email, name: userData.name, firstName: name.first, preferredName: name.preferred, lastName: name.last, uuid: userData.uuid };

            AsyncStorage.setItem('userData', JSON.stringify(user));

            this.setState({ user: user })
        });
    }

    onClickLogin = async () => {
        try {
            const result = await authorize(config);

            this.setState({ accessToken: result.accessToken })
            this.fetchUserDetails(result.accessToken)

            AsyncStorage.setItem('accessToken', accessToken);
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
        }).then((response) => {
            AsyncStorage.removeItem('accessToken')
            AsyncStorage.removeItem('userData')
            this.setState({ accessToken: '', user: null })
        });
    }

    render() {
        const toggledTitle = this.isSignedIn() ? "Logout" : "Login";
        const toggledOnPress = this.isSignedIn() ? this.onClickLogout : this.onClickLogin;
        const { user } = this.state;

        return (
            <View>
                {user && Object.keys(user).map((key, index) => <Text key={index}>{key} - {user[key]}</Text>)}
                <Button onPress={toggledOnPress} title={toggledTitle} />
            </View>

        )
    }
}