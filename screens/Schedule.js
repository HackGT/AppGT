import React, { Component } from 'react';
import { StyleSheet, Text, View, SectionList, Button, TouchableOpacity } from 'react-native';
import { DefaultScreen } from './';
import ScheduleCard from "../components/ScheduleCard";

export default class Schedule extends Component<Props> {
    static navigationOptions = {
        title: 'Schedule',
        headerLeft: null
    };

    makeEvent(title, description) {
        return { title: title, desc: description };
    }

    render() {

        const vSpace = <View style={{ height: 20 }}></View>
        const hSpace = <View style={{ width: 20 }}></View>;

        const scheduleType = ({ item, index, section: { title, data } }) => (
            <View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.selectedButton} onPress={0}>
                        <Button color="white" title="Schedule"></Button>
                    </TouchableOpacity>
                    <View style={{ width: 20 }}></View>
                    <TouchableOpacity style={styles.button}>
                        <Button color="#8A8A8A" onPress={0} title={"Favorites"} ></Button>
                    </TouchableOpacity>
                </View>
                {vSpace}
            </View>
        )

        const dayFilter = ({ item, index, section: { title, data } }) => (
            <View>
                <View style={styles.dayButtonContainer}>

                    <TouchableOpacity style={styles.dayButton} onPress={0}>
                        <Button color="#8A8A8A" title="Friday"></Button>
                    </TouchableOpacity>
                    {hSpace}
                    <TouchableOpacity style={styles.dayButton}>
                        <Button color="#8A8A8A" onPress={0} title={"Saturday"} ></Button>
                    </TouchableOpacity>
                    {hSpace}
                    <TouchableOpacity style={styles.dayButton}>
                        <Button color="#8A8A8A" onPress={0} title={"Sunday"} ></Button>
                    </TouchableOpacity>
                </View>

                {vSpace}
            </View>
        )

        const cardEvent = ({ item, index, section: { title, data } }) => (
            <View>
                <ScheduleCard title={item.title}><Text>{item.desc}</Text></ScheduleCard>
                {vSpace}
            </View>
        )

        const eventProps = [
            this.makeEvent("Event 1", "Really cool event."),
            this.makeEvent("Event 2", "Even cooler event."),
            this.makeEvent("Event 3", "This event will blow your socks off.")]

        return (
            <DefaultScreen navigation={this.props.navigation}>
                {vSpace}

                <SectionList
                    renderItem={({ item, index, section }) => <Text key={index}>{item}</Text>}
                    sections={[
                        { title: '', data: ['item1'], renderItem: scheduleType },
                        { title: '', data: ['item1'], renderItem: dayFilter },
                        { title: 'Events', data: eventProps, renderItem: cardEvent },
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
    },

    dayButtonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 50
    },

    dayButton: {
        borderRadius: 10,
        borderColor: '#75BACF',
        borderWidth: 3,
        width: '25%',
    },

});
