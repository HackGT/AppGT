import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

export default class Navbar extends Component<Props> {
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.bottom}>
                <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.button}
                        onPress={() => navigate('Home', {})}
                    >
                        <Text style={styles.text}>Schedule</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonView}>
                    <TouchableOpacity style={styles.button}
                        onPress={() => navigate('Workshops', {})}
                    >
                        <Text style={styles.text}>Workshops</Text>
                    </TouchableOpacity>
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
        backgroundColor: 'grey',
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
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 25,
        paddingRight: 25,
        borderRadius: 0,
    }
})
