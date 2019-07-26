import React, { Component } from 'react';
import { StyleSheet, Text, View, SectionList } from 'react-native';

export default class Schedule extends Component<Props> {
    static navigationOptions = {
        title: 'Notifications',
        headerLeft: null
    };

    render() {
        return (
            <Text>Notifications Page</Text>
        )
    }
}
