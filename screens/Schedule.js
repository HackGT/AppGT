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
import AsyncStorage from "@react-native-community/async-storage";
import { StarContext } from "../App";
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
    modalTags: [],
    modalStart: "",
    modalEnd: "",
    modalRestaurantName: "",
    modalRestaurantLink: "",
    modalMenu: "",
    schedule: {
      isMySchedule: false,
      filtered: []
    }
  };

  makeEvent = (
    id,
    title,
    description,
    tags,
    start_time,
    end_time,
    restaurant_name,
    restaurant_link,
    menu_items,
    eventType
  ) => {
    return {
      id: id,
      title: title,
      desc: description,
      tags: tags,
      start: start_time,
      end: end_time,
      restaurant_name: restaurant_name,
      restaurant_link: restaurant_link,
      menu: menu_items,
      eventType: eventType
    };
  };

  populateEvents = () => {
    let eventProps = [];

    mealData = this.props.screenProps.allData.data.meals;
    for (let i = 0; i < mealData.length; i++) {
      curMeal = mealData[i];
      if (curMeal.base != null) {
        eventProps.push(
          this.makeEvent(
            curMeal.id,
            curMeal.base.title,
            curMeal.base.description,
            curMeal.base.tags,
            curMeal.base.start_time,
            curMeal.base.end_time,
            curMeal.restaurant_name,
            curMeal.restaurant_link,
            curMeal.menu_items,
            "meal"
          )
        );
        this.starDict[curMeal.id] = false;
      }
    }

    talkData = this.props.screenProps.allData.data.talks;
    for (let i = 0; i < talkData.length; i++) {
      curTalk = talkData[i];
      if (curTalk.base != null) {
        eventProps.push(
          this.makeEvent(
            curTalk.id,
            curTalk.base.title,
            curTalk.base.description,
            curTalk.base.tags,
            curTalk.base.start_time,
            curTalk.base.end_time,
            null,
            null,
            null,
            "talk"
          )
        );
        this.starDict[curTalk.id] = false;
      }
    }
    return eventProps;
  };

  starDict = {};
  eventProps = this.populateEvents();

  toggleModal = (
    title,
    type,
    desc,
    tags,
    start,
    end,
    restaurant_name,
    restaurant_link,
    menu
  ) => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      modalTitle: title,
      modalType: type,
      modalDesc: desc,
      modalTags: tags,
      modalStart: start,
      modalEnd: end,
      modalRestaurantName: restaurant_name,
      modalRestaurantLink: restaurant_link,
      modalMenu: menu
    });
  };

  onSelectEvent = item => {
    this.props.navigation.navigate("Event", {
      event: item
    });
  };

  onSelectSchedule = (newIndex, starredItems) => {
    if (newIndex === 1) {
      this.setState({
        schedule: {
          isMySchedule: true,
          filtered: this.eventProps.filter(function(item) {
            console.log(starredItems);
            if (starredItems[item.id] === true) {
              return item;
            }
          })
        }
      });
    } else {
      this.setState({ schedule: { isMySchedule: false, filtered: [] } });
    }
    console.log(this.state.schedule.isMySchedule);
  };

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
    console.log(this.state.search.isSearching);
  };

  render() {
    const { text } = this.state.search;
    const vSpace = <View style={{ height: 10 }} />;

    const scheduleType = () => (
      <StarContext.Consumer>
        {({ toggleStarred, starredItems }) => (
          <ButtonControl
            height={40}
            onChangeIndex={this.onSelectSchedule}
            buttons={["Main Schedule", "My Schedule"]}
            starredItems={starredItems}
          />
        )}
      </StarContext.Consumer>
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
        <StarContext.Consumer>
          {({ toggleStarred, starredItems }) => (
            <ScheduleCard
              item={item}
              onClick={() =>
                this.toggleModal(
                  item.title,
                  item.eventType,
                  item.desc,
                  item.tags,
                  item.start,
                  item.end,
                  item.restaurant_name,
                  item.restaurant_link,
                  item.menu
                )
              }
              title={item.title}
              tags={item.tags}
              id={item.id}
              onPressStar={() => toggleStarred(item.id, this.starDict)}
            >
              {item.desc}
            </ScheduleCard>
          )}
        </StarContext.Consumer>
        <Modal isVisible={this.state.isModalVisible}>
          <Event
            isModalVisible={() =>
              this.toggleModal(null, null, null, null, null, null, null, null)
            }
            title={this.state.modalTitle}
            desc={this.state.modalDesc}
            tags={this.state.modalTags}
            startTime={this.state.modalStart}
            endTime={this.state.modalEnd}
            restaurantName={this.state.modalRestaurantName}
            restaurantLink={this.state.modalRestaurantLink}
            menuItems={this.state.modalMenu}
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

    let data;
    if (this.state.search.isSearching) {
      data = this.state.search.isSearching
        ? this.state.search.filtered
        : this.eventProps;
    } else {
      data = this.state.schedule.isMySchedule
        ? this.state.schedule.filtered
        : this.eventProps;
    }
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
