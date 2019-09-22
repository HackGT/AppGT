import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  Button,
  TouchableOpacity
} from "react-native";
import ScheduleCard from "../components/ScheduleCard";
import ButtonControl from "../components/ButtonControl";
import { SearchBar } from "react-native-elements";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Modal from "react-native-modal";
import Event from "../components/events/Event";
import {
  faPlusCircle,
  faStar,
  faSearch
} from "@fortawesome/free-solid-svg-icons";

export default class Schedule extends Component<Props> {
  static navigationOptions = {
    title: "Schedule",
    headerLeft: null
  };

  state = {
    search: {
      isSearching: false,
      text: "",
      filtered: []
    },
    allData: null,
    selectedDayIndex: 0,
    selectedScheduleIndex: 0,
    isModalVisible: false,
    modalTitle: "",
    modalType: "",
    modalDesc: "",
    modalTags: []
  };

  makeEvent = (
    title,
    description,
    tags,
    start_time,
    end_time,
    restaurant,
    menu_items,
    eventType
  ) => {
    return {
      title: title,
      desc: description,
      tags: tags,
      start: start_time,
      end: end_time,
      restaurant: restaurant,
      menu: menu_items,
      eventType: eventType
    };
  };

  populateEvents = () => {
    let eventProps = [];
    eventData = this.props.screenProps.allData.data.events;
    for (let i = 0; i < eventData.length; i++) {
      curEvent = eventData[i];
      eventProps.push(
        this.makeEvent(
          curEvent.title,
          curEvent.description,
          curEvent.tags,
          curEvent.start_time,
          curEvent.end_time,
          null,
          null,
          "event"
        )
      );
    }

    mealData = this.props.screenProps.allData.data.meals;
    for (let i = 0; i < mealData.length; i++) {
      curMeal = mealData[i];
      eventProps.push(
        this.makeEvent(
          "no meal title",
          curMeal.description,
          curMeal.tags,
          curMeal.start_time,
          curMeal.end_time,
          curMeal.restaurant,
          curMeal.menu_items,
          "meal"
        )
      );
    }

    return eventProps;
  };

  eventProps = this.populateEvents();

  toggleModal = (title, type, desc, tags) => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      modalTitle: title,
      modalType: type,
      modalDesc: desc,
      modalTags: tags
    });
  };

  onSelectEvent = item => {
    this.props.navigation.navigate("Event", {
      event: item
    });
  };

  onSelectSchedule = newIndex => {};

  onSelectDay = newIndex => {};

  updateSearch = text => {
    if (text === "") {
      this.setState({
        search: { text: text, isSearching: false, filtered: [] }
      });
    } else {
      this.setState({
        search: {
          text: text,
          isSearching: true,
          filtered: this.eventProps.filter(item => item.title.includes(text))
        }
      });
    }
  };
  render() {
    const { text } = this.state.search;
    const vSpace = <View style={{ height: 10 }} />;

    const scheduleType = () => (
      <ButtonControl
        height={40}
        onChangeIndex={this.onSelectSchedule}
        buttons={["Main Schedule", "My Schedule"]}
      />
    );

    const dayFilter = () => (
      <View>
        <ButtonControl
          height={30}
          onChangeIndex={this.onSelectDay}
          buttons={["Friday", "Saturday", "Sunday"]}
        />
        {vSpace}
      </View>
    );
    const cardEvent = ({ item, index, section: { title, data } }) => (
      <View key={index}>
        <ScheduleCard
          item={item}
          onClick={() =>
            this.toggleModal(item.title, item.eventType, item.desc, item.tags)
          }
          title={item.title}
          tags={item.tags}
        >
          {item.desc}
        </ScheduleCard>
        <Modal isVisible={this.state.isModalVisible}>
          <Event
            isModalVisible={() => this.toggleModal(null, null, null, null)}
            title={this.state.modalTitle}
            desc={this.state.modalDesc}
            tags={this.state.modalTags}
            eventType={this.state.modalType}
          />
        </Modal>
        {vSpace}
      </View>
    );

    const searchBar = ({ item, index, section: { title, data } }) => (
      <SearchBar
        platform="android"
        placeholder="Search..."
        onChangeText={this.updateSearch}
        value={text}
      />
    );

    const data = this.state.search.isSearching
      ? this.state.search.filtered
      : this.eventProps;

    console.log(this.props.screenProps);
    return (
      <SectionList
        renderItem={({ item, index, section }) => (
          <Text key={index}>{item}</Text>
        )}
        sections={[
          { title: "", data: [""], renderItem: searchBar },
          { title: "", data: [""], renderItem: scheduleType },
          { title: "", data: [""], renderItem: dayFilter },
          { title: "Events", data: data, renderItem: cardEvent }
        ]}
      />
    );
  }
}
