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
import moment from "moment-timezone";

import ScheduleCard from "../components/ScheduleCard";
import ButtonControl from "../components/ButtonControl";
import Event from "../components/events/Event";
import { StarContext, CMSContext } from "../App";
import { colors } from "../themes";
import { styleguide } from "../styles";


// TODO modal trigger refactor
// TODO Star all
// TODO color coding
// TOOD fix scrollbar
// TODO styling fix on button groups (probably going to have to roll own thing)
const DATES = [
  {date: "10/25", day: "Friday"},
  {date: "10/26", day: "Saturday"},
  {date: "10/27", day: "Sunday"}
];

export const populateEvents = (data) => {
  const now = moment();
  const unsortedEventInfo = data.eventbases;
  unsortedEventInfo.forEach((base) => { // squash tags
    if (!base.start_time) return;
    if (base.tags) {
      base.tags = base.tags.filter(tag => !!tag).map(tag => tag.name);
    }
    if (base.area)
      base.area = base.area.name;
    base.type = "core";
    base.startTime = moment.parseZone(base.start_time); // toCamel
    if (base.end_time) {
      base.endTime = moment.parseZone(base.end_time);
    }
    base.isOld = now > base.startTime;
  });
  const eventInfo = unsortedEventInfo.sort((e1, e2) => {
    if (e1.isOld && !e2.isOld) return 1;
    if (e1.start_time === e2.start_time) // compare strings
      return e1.title > e2.title;
    if (e1.startTime > e2.startTime) return 1;
    return -1;
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

export default class Schedule extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      isMySchedule: false,
      dayIndex: 0,
      searchText: "",
      searchLower: "",
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
  }

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

  onSelectSchedule = (newIndex) => this.setState({ isMySchedule: newIndex === 1 });

  onSelectDay = dayIndex => this.setState({ dayIndex });

  render() {
    const { searchText, searchLower, isMySchedule, dayIndex } = this.state;
    const SearchComponent = () => (
      <View style={styles.search}>
        <SearchBar
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
          onChangeText={(searchText) => this.setState({ searchText, searchLower: searchText.toLowerCase() })}
          value={searchText}
          autoCorrect={false}
        />
      </View>
    );

    const ScheduleSelector = () => (
      <View style={styles.scheduleSelector}>
        <ButtonControl
          onChangeCallback={this.onSelectSchedule}
          buttons={["Main Schedule", "My Schedule"]}
          selectedIndex={ this.state.isMySchedule ? 1 : 0}
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
          onChangeCallback={this.onSelectDay}
          selectedIndex={this.state.dayIndex}
          buttons={DATES.map(time => time.day)}
        />
      </View>
    );

    const EventCard = ({ eventData: item, isStarred, toggleEvent, shouldShowTime }) => (
      <View style={{
        flexDirection: "row",
        alignItems: "center",
      }}>
        <View style={{
          width: 70,
        }}>
          { shouldShowTime && (

            <Text style={{
              textAlign: "center"
            }}>
              {item.startTime.format("hh:mm A")}
            </Text>
          )}
        </View>
        <ScheduleCard
          item={item}
          onClick={() =>
            this.toggleModal(
              item.title,
              item.eventType,
              item.desc,
              item.tags,
              item.startTime,
              item.endTime,
              item.restaurantName,
              item.restaurantLink,
              item.menu
            )
          }
          title={item.title}
          area={item.area}
          tags={item.tags}
          id={item.id}
          isStarred={isStarred}
          onPressStar={toggleEvent}
          isOld={item.isOld}
        >
          {item.desc}
        </ScheduleCard>
      </View>
    );

    return (
      <ScrollView
        style={styleguide.wrapperView}
        keyboardShouldPersistTaps='always'
        keyboardDismissMode='on-drag'
      >
        <SearchComponent />
        <ScheduleSelector />
        <DaySelector />
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
        <StarContext.Consumer>
          {({ starredItems, toggleStarred }) => (
            <CMSContext.Consumer>
              {({ eventData, tags }) => {
                console.log("In schedule")
                console.log(eventData);
                const lowerTags = tags.map(tag => tag.toLowerCase());
                const matchedTags = tags.filter((_, index) => lowerTags[index].includes(searchLower));
                if (isMySchedule) {
                  eventData = eventData.filter(item => starredItems[item.id]);
                }
                eventData = eventData.filter(item => item.startTime.format('MM/DD') === DATES[dayIndex].date);
                const searchingFiltered = eventData.filter(item => {
                  return item.title.toLowerCase().includes(searchLower) || item.tags.some(tag => matchedTags.includes(tag));
                });
                if (searchingFiltered.length === 0) {
                  return (<View style={styleguide.notfound}>
                    <FontAwesomeIcon
                      color={searchText === "" ? colors.lightGrayText : colors.darkGrayText}
                      icon={faQuestionCircle} size={28}
                      />
                    <Text>No events found.</Text>
                    { isMySchedule && <Text> Star some events to get started! </Text>}
                  </View>);
                }
                return (
                  <View>
                    <FlatList
                      data={searchingFiltered}
                      keyExtractor={item => item.id}
                      renderItem={({ item, index }) => {
                        let shouldShowTime = index === 0;
                        if (index !== 0) {
                          if (searchingFiltered[index - 1].startTime.format('HH:mm') !== item.startTime.format('HH:mm')) {
                            shouldShowTime = true;
                          }
                        }
                        const toggleEvent = () => toggleStarred(item.id);
                        return (<EventCard
                          eventData={item}
                          toggleEvent={toggleEvent}
                          shouldShowTime={shouldShowTime}
                          isStarred={!!starredItems[item.id]}
                          />);
                        }}
                    />
                    <View style={{
                      height: 40
                    }}/>
                  </View>
                );
            }}
          </CMSContext.Consumer>
          )}
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
    marginBottom: 12,
  }
});

