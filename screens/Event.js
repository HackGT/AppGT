import React, { Component } from 'react';
import { Text, View } from 'react-native';

export default class Event extends Component<Props> {    
    render() {
        const event = this.props.navigation.getParam('event', '');

        if (event === '') {
            this.props.navigation.goBack();
        }

        return (
            <View>
                <Text>
                    {event.title}
                </Text>
                <Text>
                    {event.desc}
                </Text>
            </View>
        )
    }
}