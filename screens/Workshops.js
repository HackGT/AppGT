import React, { Component } from 'react';
import { StyleSheet, Text, View, SectionList } from 'react-native';

export default class Schedule extends Component<Props> {
    static navigationOptions = {
        title: 'Workshops',
        headerLeft: null
    };
    render() {
        return (
            <Text>Workshops Page</Text>
        )
    }
}
