import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { Navbar } from './../components';

export default class Schedule extends Component<Props> {
    static navigationOptions = {
        title: 'Workshops',
        headerLeft: null
    };
    render() {
        return (
            <View style={styles.container}>
                <Text>Workshops Page</Text>
                <Navbar navigation={this.props.navigation}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
