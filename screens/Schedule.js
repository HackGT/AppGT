import React, {Component} from 'react';
import {StyleSheet, Text, View, SectionList, Button, TouchableOpacity } from 'react-native';
import { DefaultScreen } from './';

export default class Schedule extends Component<Props> {
    static navigationOptions = {
        title: 'Schedule',
        headerLeft: null
    };
    render() {
        const overrideRenderItem = ({ item, index, section: { title, data } }) => (
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.selectedButton} onPress={0}>
                    <Button color="white" title="Schedule"></Button>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Button color="#8A8A8A" onPress={0} title={"Favorites"} ></Button>
                </TouchableOpacity>
            </View>
        )

        return (
            <DefaultScreen navigation={this.props.navigation}>
                <SectionList
                renderItem={({ item, index, section }) => <Text key={index}>{item}</Text>}
                sections={[
                    { title: 'Title1', data: ['item1'], renderItem: overrideRenderItem },
                    { title: 'Title2', data: ['item3'] },
                    { title: 'Title3', data: ['item5', 'item6'] },
                ]}
                />
            </DefaultScreen>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
      },

    button: {
        borderRadius: 20,
        borderColor: '#75BACF',
        borderWidth: 3,
        width: '40%'
    },

    selectedButton: {
        borderRadius: 20,
        borderColor: '#75BACF',
        borderWidth: 3,
        width: '40%',

        backgroundColor: "#75BACF",
        color: "#000000"

    }

});
