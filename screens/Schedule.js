import React, { Component } from "react";
import {
  StyleSheet,
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
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";

import Event from "../components/events/Event";
import { ScheduleCard, ButtonControl, StyledText, Spacer } from "../components";
import { StarContext, CMSContext } from "../App";
import { colors } from "../themes";
import { styleguide } from "../styles";

// TODO Star all
// TODO color coding
// TOOD fix scrollbar
// TODO styling fix on button groups (probably going to have to roll own thing)
const DATES = [
  { date: "10/25", day: "Friday" },
  { date: "10/26", day: "Saturday" },
  { date: "10/27", day: "Sunday" }
];

export const populateEvents = data => {
  moment.fn.toJSON = function() {
    return this.format();
  };
  const unsortedEventInfo = data.eventbases;
  unsortedEventInfo.forEach(base => {
    // squash tags
    if (!base.start_time || !base.title) return; // the bare minimum
    if (base.tags) {
      base.tags = base.tags.filter(tag => !!tag).map(tag => tag.name);
    }
    if (base.area) base.area = base.area.name;
    base.type = "core";
    base.startTime = UNSAFE_parseAsLocal(base.start_time);
    base.endTime = UNSAFE_parseAsLocal(base.end_time);
    base.startTime = moment.parseZone(base.start_time); // toCamel
    if (base.end_time) {
      base.endTime = moment.parseZone(base.end_time);
    }
  });
  const eventInfo = unsortedEventInfo.sort((e1, e2) => {
    if (e1.start_time !== e2.start_time)
      return e1.startTime > e2.startTime ? 1 : -1;
    if (e1.end_time !== e2.end_time) return e1.endTime > e2.endTime ? 1 : -1;
    return e1.title > e2.title;
  });
  // Smoosh in additional info where relevant
  data.meals.forEach(meal => {
    if (!meal.base) return;
    const id = meal.base.id;
    const index = eventInfo.findIndex(event => event.id === id);
    if (index === -1) return;
    let dietRestrictionsArr = [];
    meal.menu_items.forEach(item => {
      dietRestrictionsArr.push(item.dietrestrictions);
    });
    eventInfo[index] = {
      ...eventInfo[index],
      restaurantName: meal.restaurant_name,
      restaurantLink: meal.restaurant_link,
      menuItems: meal.menu_items,
      dietRestrictions: dietRestrictionsArr,
      type: "meal"
    };
  });

  data.talks.forEach(talk => {
    if (!talk.base) return;
    const id = talk.base.id;
    const index = eventInfo.findIndex(event => event.id === id);
    if (index === -1) return;
    eventInfo[index] = {
      ...eventInfo[index],
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
      searchText: "",
      searchLower: "",
      isMySchedule: false,
      dayIndex: 0,
      isModalVisible: false,
      modalEvent: null
    };
  }

  updateText = searchText => {
    this.setState({ searchText, searchLower: searchText.toLowerCase() });
  };

  clearText = () => {
    this.setState({ searchText: "" });
    this.updateText("");
  };

  cancelSearch = () => {
    this.setState({ searchText: "" });
    this.updateText("");
    Keyboard.dismiss();
  };

  onSelectEvent = item => {
    this.props.navigation.navigate("Event", {
      event: item
    });
  };

  onSelectSchedule = newIndex =>
    this.setState({ isMySchedule: newIndex === 1 });

  onSelectDay = dayIndex => this.setState({ dayIndex });

  render() {
    const {
      searchText,
      searchLower,
      isMySchedule,
      dayIndex,
      modalEvent,
      isModalVisible
    } = this.state;

    const EventCard = ({
      eventData: item,
      isStarred,
      toggleEvent,
      shouldShowTime
    }) => (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <View
          style={{
            width: 70
          }}
        >
          {shouldShowTime && (
            <StyledText
              style={{
                textAlign: "center"
              }}
            >
              {item.startTime.format("hh:mm A")}
            </StyledText>
          )}
        </View>
        <ScheduleCard
          item={item}
          onClick={() => {
            this.setState({ modalEvent: item, isModalVisible: true });
          }}
          title={item.title}
          area={item.area}
          tags={item.tags}
          id={item.id}
          isStarred={isStarred}
          onPressStar={toggleEvent}
          isOld={moment().diff(item.startTime) > 0}
        >
          {item.description}
        </ScheduleCard>
      </View>
    );

    return (
      <ScrollView
        style={styleguide.wrapperView}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.search}>
          <SearchBar
            searchIcon={
              <FontAwesomeIcon
                color={
                  searchText === "" ? colors.lightGrayText : colors.darkGrayText
                }
                icon={faSearch}
                size={28}
              />
            }
            clearIcon={
              <FontAwesomeIcon
                color={colors.darkGrayText}
                icon={faTimes}
                size={28}
                onPress={this.clearText}
              />
            }
            cancelIcon={
              <FontAwesomeIcon
                color={colors.darkGrayText}
                icon={faArrowLeft}
                size={28}
                onPress={this.cancelSearch}
              />
            }
            ref={search => (this.search = search)}
            platform="android"
            placeholder="Search by title or tag"
            onChangeText={this.updateText}
            value={searchText}
            autoCorrect={false}
          />
        </View>
        <ScheduleSelector
          onSelectSchedule={this.onSelectSchedule}
          selectedIndex={isMySchedule ? 1 : 0}
        />
        <DaySelector onSelectDay={this.onSelectDay} selectedIndex={dayIndex} />
        <StarContext.Consumer>
          {({ starredItems, toggleStarred }) => (
            <CMSContext.Consumer>
              {({ eventData, tags }) => {
                const lowerTags = tags.map(tag => tag.toLowerCase());
                const matchedTags = tags.filter((_, index) =>
                  lowerTags[index].includes(searchLower)
                );
                if (isMySchedule) {
                  eventData = eventData.filter(item => starredItems[item.id]);
                }
                eventData = eventData.filter(
                  item =>
                    item.startTime.format("MM/DD") === DATES[dayIndex].date
                );
                const searchingFiltered = eventData.filter(item => {
                  return (
                    item.title.toLowerCase().includes(searchLower) ||
                    item.tags.some(tag => matchedTags.includes(tag))
                  );
                });
                if (searchingFiltered.length === 0) {
                  return (
                    <View style={styleguide.notfound}>
                      <FontAwesomeIcon
                        color={
                          searchText === ""
                            ? colors.lightGrayText
                            : colors.darkGrayText
                        }
                        icon={faQuestionCircle}
                        size={28}
                      />
                      <StyledText>No events found.</StyledText>
                      {isMySchedule && (
                        <StyledText>
                          {" "}
                          Star some events to get started!{" "}
                        </StyledText>
                      )}
                    </View>
                  );
                }
                const now = moment();
                const oldEvents = searchingFiltered.filter(
                  e => now.diff(e.timeStart) > 0
                ); // pseudo-sort
                const newEvents = searchingFiltered.filter(
                  e => now.diff(e.timeStart) <= 0
                );
                const joinedEvents = newEvents.concat(oldEvents);
                return (
                  <View>
                    <EventModal
                      closeModal={() =>
                        this.setState({ isModalVisible: false })
                      }
                      modalEvent={modalEvent}
                      isModalVisible={isModalVisible}
                    />
                    <FlatList
                      data={joinedEvents}
                      keyExtractor={item => item.id}
                      renderItem={({ item, index }) => {
                        let shouldShowTime = index === 0;
                        if (index !== 0) {
                          if (
                            searchingFiltered[index - 1].startTime.format(
                              "HH:mm"
                            ) !== item.startTime.format("HH:mm")
                          ) {
                            shouldShowTime = true;
                          }
                        }
                        const toggleEvent = () => toggleStarred(item.id);
                        return (
                          <EventCard
                            eventData={item}
                            toggleEvent={toggleEvent}
                            shouldShowTime={shouldShowTime}
                            isStarred={!!starredItems[item.id]}
                          />
                        );
                      }}
                    />
                    <Spacer />
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

const ScheduleSelector = ({ onSelectSchedule, selectedIndex }) => (
  <View style={styles.scheduleSelector}>
    <ButtonControl
      onChangeCallback={onSelectSchedule}
      buttons={["Main Schedule", "My Schedule"]}
      selectedIndex={selectedIndex}
      containerSyle={{
        width: 300
      }}
    />
  </View>
);

const DaySelector = ({ onSelectDay, selectedIndex }) => (
  <View style={styles.daySelector}>
    <ButtonControl
      height={30}
      onChangeCallback={onSelectDay}
      selectedIndex={selectedIndex}
      buttons={DATES.map(time => time.day)}
    />
  </View>
);

const EventModal = ({ closeModal, isModalVisible, modalEvent }) => {
  return (
    <Modal
      isVisible={isModalVisible}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      propagateSwipe
    >
      <Event closeModal={closeModal} eventInfo={modalEvent} />
    </Modal>
  );
};

export const UNSAFE_parseAsLocal = t => {
  // parse iso-formatted string as local time
  if (!t) return "";
  let localString = t;
  if (t.slice(-1).toLowerCase() === "z") {
    localString = t.slice(0, -1);
  }
  return moment(localString);
};

const styles = StyleSheet.create({
  search: {},
  scheduleSelector: {
    marginBottom: 8,
    ...styleguide.elevate
  },
  daySelector: {
    marginBottom: 12
  }
});
