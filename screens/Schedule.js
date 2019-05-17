import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { DefaultScreen } from './';

export default class Schedule extends Component<Props> {
    static navigationOptions = {
        title: 'Schedule',
        headerLeft: null
    };
    render() {
        return (
            <DefaultScreen>
                <Text>Schedule Page</Text>
            </DefaultScreen>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
