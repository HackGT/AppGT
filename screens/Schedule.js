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

const makeEvent = (title, description, tags, eventType) => {
  return { title: title, desc: description, tags: tags, eventType: eventType };
};

const eventProps = [
  makeEvent(
    "Event 1",
    "Really cool event.",
    [{ key: "Tag1" }, { key: "Tag2" }, { key: "Tag3" }],
    "meal"
  ),
  makeEvent(
    "Event 2",
    "Even cooler event.",
    [{ key: "Tag4" }, { key: "Tag5" }, { key: "Tag6" }],
    "workshop"
  ),
  makeEvent(
    "Event 3",
    "This event will blow your socks off.",
    [{ key: "Tag7" }, { key: "Tag8" }, { key: "Tag9" }],
    "meal"
  )
];

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

    selectedDayIndex: 0,
    selectedScheduleIndex: 0,
    isModalVisible: false,
    modalTitle: "",
    modalType: "",
    modalDesc: "",
    modalTags: []
  };

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
          filtered: eventProps.filter(item => item.title.includes(text))
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
      : eventProps;

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
