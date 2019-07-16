import React, { Component } from 'react';
import { StyleSheet, Text, View, SectionList, Button, TouchableOpacity } from 'react-native';
import ScheduleCard from "../components/ScheduleCard";
import ButtonControl from "../components/ButtonControl";
// import { SearchBar } from 'react-native-elements';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlusCircle, faStar, faSearch } from '@fortawesome/free-solid-svg-icons';

const makeEvent = (title, description) => {
    return { title: title, desc: description };
}

const eventProps = [
    makeEvent("Event 1", "Really cool event."),
    makeEvent("Event 2", "Even cooler event."),
    makeEvent("Event 3", "This event will blow your socks off.")]


export default class Schedule extends Component<Props> {

    static navigationOptions = {
        title: 'Schedule',
        headerLeft: null
    };

    state = {
        search: {
            isSearching: false,
            text: '',
            filtered: []
        },

        selectedDayIndex: 0,
        selectedScheduleIndex: 0
    };

    onSelectEvent = (item) => {
        this.props.navigation.navigate('Event', {
            event: item 
        })
    }

    onSelectSchedule = (newIndex) => {

    }

    onSelectDay = (newIndex) => {

    }

    updateSearch = (text) => {
        if (text === '') {
            this.setState({ search: { text: text, isSearching: false, filtered: [] } })
        } else {
            this.setState({ search: { text: text, isSearching: true, filtered: eventProps.filter(item => item.title.includes(text)) } })
        }
    }

    render() {
        const { text } = this.state.search;
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
            <View key={index}>
                <ScheduleCard item={item} onClick={this.onSelectEvent} title={item.title}>{item.desc}</ScheduleCard>
                {vSpace}
            </View>
        )

        const searchBar = ({ item, index, section: { title, data } }) => (
            // <SearchBar
            //     platform="android"
            //     placeholder="Search..."
            //     onChangeText={this.updateSearch}
            //     value={text}
            // />
            <Text></Text>
        )

        const data = this.state.search.isSearching ? this.state.search.filtered : eventProps

        return (
            <SectionList
                renderItem={({ item, index, section }) => <Text key={index}>{item}</Text>}
                sections={[
                    { title: '', data: [''], renderItem: searchBar },
                    { title: '', data: [''], renderItem: scheduleType },
                    { title: '', data: [''], renderItem: dayFilter },
                    { title: 'Events', data: data, renderItem: cardEvent },
                ]}
            />
        )
    }
}