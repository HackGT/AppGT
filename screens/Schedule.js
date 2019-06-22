import React, { Component } from 'react';
import { StyleSheet, Text, View, SectionList, Button, TouchableOpacity } from 'react-native';
import { DefaultScreen } from './';
import ScheduleCard from "../components/ScheduleCard";
import ButtonControl from "../components/ButtonControl";
import { tsImportEqualsDeclaration } from '@babel/types';

export default class Schedule extends Component<Props> {

    state = {
        selectedDayIndex: 0,
        selectedScheduleIndex: 0
    };

    static navigationOptions = {
        title: 'Schedule',
        headerLeft: null
    };

    makeEvent(title, description) {
        return { title: title, desc: description };
    }

    onSelectSchedule(newIndex) {
        
    }

    onSelectDay(newIndex) {
        
    }

    render() {

        const vSpace = <View style={{ height: 10 }}></View>

        const scheduleType = () => (
            <ButtonControl height={40} onChangeIndex={this.onSelectSchedule} buttons={["Schedule", "Favorites"]} />
        )

        const dayFilter = () => (
            <View>
                <ButtonControl height={30} onChangeIndex={this.onSelectDay} buttons={["Friday", "Saturday", "Sunday"]} />
                {vSpace}
            </View>
        )

        const cardEvent = ({ item, index, section: { title, data } }) => (
            <View>
                <ScheduleCard title={item.title}>{item.desc}</ScheduleCard>
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
                        { title: '', data: [''], renderItem: scheduleType },
                        { title: '', data: [''], renderItem: dayFilter },
                        { title: 'Events', data: eventProps, renderItem: cardEvent },
                    ]}
                />
            </DefaultScreen>
        )
    }
}