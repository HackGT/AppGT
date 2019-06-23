import React, { Component } from 'react';
import { StyleSheet, Text, View, SectionList } from 'react-native';

export default class Event extends Component<Props> {
    static navigationOptions = {
        title: 'Event',
        headerLeft: null
    };
    
    render() {
        return (
            <Text>
                {this.props.title}
            </Text>
        )
    }
}
