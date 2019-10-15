import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  Keyboard,
  TouchableOpacity
} from "react-native";
import Modal from "react-native-modal";
import { SearchBar } from "react-native-elements";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faSearch,
  faQuestionCircle,
  faTimes,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

import ScheduleCard from "../components/ScheduleCard";
import ButtonControl from "../components/ButtonControl";
import Event from "../components/events/Event";
import { StarContext } from "../App";
import { colors } from "../themes";
import { styleguide } from "../styles";

// TODO fix general appearance
// TODO get timings displayed on event
// TODO day filter
// TODO color coding
// TOOD fix scrollbar
// TODO styling fix on button groups (probably going to have to roll own)
export default class Schedule extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      isMySchedule: false,
      searchText: "",
      allData: null,
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
      starDict: {}
    };
    this.eventProps = this.populateEvents(props.screenProps.eventData);
    this.tags = props.screenProps.eventData.tags.map(tag => tag.name);
    this.lowerTags = this.tags.map(tag => tag.toLowerCase());
  }

  populateEvents = (data) => {
    const eventInfo = data.eventbases;
    eventInfo.forEach((base) => { // squash tags
      if (base.tags) {
        base.tags = base.tags.filter(tag => !!tag).map(tag => tag.name);
      }
      if (base.area)
        base.area = base.area.name;
      base.type = "core";
      base.startTime = base.start_time; // toCamel
      base.endTime = base.end_time;
    });
    // Smoosh in additional info where relevant
    data.meals.forEach((meal) => {
      if (!meal.base) return;
      const id = meal.base.id;
      if (!(id in eventInfo)) return;
      eventInfo[id] = {
        ...eventInfo[id],
        restaurantName: meal.restaurant_name,
        restaurantLink: meal.restaurant_link,
        menuItems: meal.menu_items,
        type: "meal"
      };
    });

    data.talks.forEach((talk) => {
      if (!talk.base) return;
      const id = talk.base.id;
      if (!(id in eventInfo)) return;
      eventInfo[id] = {
        ...eventInfo[id],
        people: talk.people.map(p => p.name),
        type: "talk"
      };
    });
    return eventInfo;
  };

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

  onSelectSchedule = (newIndex) => {
    this.setState({
      isMySchedule: newIndex === 1
    });
  };

  // TODO - test search and cancel
  onSelectDay = newIndex => {};

  render() {
    const { searchText, isMySchedule } = this.state;
    const SearchComponent = () => (
      <View style={styles.search}>
        <SearchBar
          icon = {{type: 'material-community', color: '#86939e', name: 'share' }}
          searchIcon={
            <FontAwesomeIcon
              color={searchText === "" ? colors.lightGrayText : colors.darkGrayText}
              icon={faSearch} size={28}
            />
          }
          clearIcon = {
            <FontAwesomeIcon
              color={colors.darkGrayText}
              icon={faTimes} size={28}
            />
          }
          cancelIcon = {
            <FontAwesomeIcon
              color={colors.darkGrayText}
              icon={faArrowLeft} size={28}
            />
          }
          platform="android"
          placeholder="Search by title or tag"
          onChangeText={(searchText) => this.setState({ searchText })}
          value={searchText}
          autoCorrect={false}
        />
      </View>
    );

    const ScheduleSelector = () => (
      <View style={styles.scheduleSelector}>
        <ButtonControl
          onChangeListener={this.onSelectSchedule}
          buttons={["Main Schedule", "My Schedule"]}
          containerSyle={{
            width: 300
          }}
        />
      </View>
    );

    const DaySelector = () => (
      <View style={styles.daySelector}>
        <ButtonControl
          height={30}
          onChangeIndex={this.onSelectDay}
          buttons={["Friday", "Saturday", "Sunday"]}
        />
      </View>
    );

    const EventCard = ({ eventData: item, isStarred, toggleEvent }) => (
      <View>
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
            area={item.area}
            tags={item.tags}
            id={item.id}
            isStarred={isStarred}
            onPressStar={toggleEvent}
          >
            {item.desc}
          </ScheduleCard>
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
      </View>
    );

    const matchedTags = this.tags.filter((_, index) => this.lowerTags[index].includes(searchText));
    console.log(matchedTags);
    return (
      <ScrollView
        style={styleguide.wrapperView}
        keyboardShouldPersistTaps='always'
        keyboardDismissMode='on-drag'
      >
        <SearchComponent />
        <ScheduleSelector />
        <DaySelector />
        <StarContext.Consumer>
          {({ starredItems, toggleStarred }) => {
            let eventData = this.eventProps;
            if (isMySchedule) {
              eventData = eventData.filter(item => starredItems[item.id]);
            }
            const searchingFiltered = eventData.filter(item => {
              return item.title.includes(searchText) || item.tags.some(tag => matchedTags.includes(tag));
            });
            if (searchingFiltered.length === 0) {
              return (<View style={styles.notfound}>
                <FontAwesomeIcon
                  color={searchText === "" ? colors.lightGrayText : colors.darkGrayText}
                  icon={faQuestionCircle} size={28}
                />
                <Text>No events found.</Text>
              </View>);
            }
            return (
              <View>
                <FlatList
                  data={searchingFiltered}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => {
                    const startTime = item.start
                    const toggleEvent = () => toggleStarred(item.id);
                    return <EventCard eventData={item} toggleEvent={toggleEvent} isStarred={!!starredItems[item.id]} />;
                  }}
                />
                <View style={{
                  height: 40
                }}/>
              </View>
            );
          }}
        </StarContext.Consumer>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  search: {
  },
  scheduleSelector: {
    marginBottom: 8,
    ...styleguide.elevate,
  },
  daySelector: {
    marginBottom: 4,
  },
  notfound: {
    margin: 40,
    flex: 1,
    textAlign: 'center',
    // height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

