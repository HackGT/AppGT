import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Button} from 'react-native';

export default class Navbar extends Component<Props> {
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.bottom}>
                <View style={styles.buttonView}>
                    <Button
                        title='Schedule'
                        style={styles.button}
                        onPress={() => navigate('Home', {})}
                    />
                </View>

                <View style={styles.buttonView}>
                    <Button
                        title='Workshops'
                        style={styles.button}
                        onPress={() => navigate('Workshops', {})}
                    />
                </View>
            </View>
        );
    }
}

const styles= StyleSheet.create({
    bottom: {
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
        // backgroundColor: 'grey',
    },

    buttonView: {
        flex: 1,
    },

    text: {
        color: 'white',
    },

    button: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // paddingTop: 20,
        // paddingBottom: 20,
        // paddingLeft: 25,
        // paddingRight: 25,
        // borderRadius: 0,
    }
})
