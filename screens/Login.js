import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default class Login extends Component<Props> {    

    static navigationOptions = {
        title: 'Login',
        headerLeft: null
      };

    render() {
        
        return (
            <View>
                <Text>
                    Login!
                </Text>
            </View>
        )
    }
}