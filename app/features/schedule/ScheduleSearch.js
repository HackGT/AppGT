import React, { useState, useContext, useRef } from "react";
import { HackathonContext } from "../../state/context";
import { getEventsForDay, getDaysForEvent } from "../../cms/DataHandler";
import { SearchBar } from "react-native-elements";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import SearchIcon from "../../../assets/images/Search";
import { SafeAreaView } from "react-native-safe-area-context";
import CancelIcon from "../../../assets/images/Cancel";
import { ScheduleEventCell } from "./ScheduleEventCell";
import { EventBottomSheet } from "./EventBottomSheet";
import FilterSelect from "../../components/FilterSelect";
import TagScrollView from "../../components/TagScrollView";
import { ThemeContext } from "../../contexts/ThemeContext";

export function ScheduleSearch(props) {
  const { state } = useContext(HackathonContext);
  const hackathon = state.hackathon;

  const [searchText, setSearchText] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterItem, setFilterItem] = useState(null);
  const [highlightedTags, setHighlightedTags] = useState([]);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const sheetRef = useRef(null);

  const backButton = () => {
    const { navigation } = props;

    return (
      <TouchableOpacity
        disabled={filterMenuOpen}
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <CancelIcon />
      </TouchableOpacity>
    );
  };

  const onPressEvent = (event) => {
    if (event) {
      setSelectedEvent(event);
      sheetRef.current.open();
    } else {
      setSelectedEvent(null);
      sheetRef.current.close();
    }
  };

  const searchEvents = (value) => {
    setSearchText(value);
  };

  return (
    <ThemeContext.Consumer>
      {({ dynamicStyles }) => {
        let highlightedTagsCopy = [...highlightedTags];
        let sortedEvents = [...hackathon.events];
        var days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];

        sortedEvents = sortedEvents.filter((event) => {
          var date = new Date(event.startDate);
          var dayName = days[date.getDay()];
          let eventNameLowerCase = event.name.toLowerCase();
          let eventDescriptionLowerCase = "";
          let eventTypeLowerCase = "";
          const name = event.type && event.type.name ? event.type.name : null;

          if (event.description != null) {
            eventDescriptionLowerCase = event.description.toLowerCase();
          }

          if (name != null) {
            eventTypeLowerCase = name.toLowerCase();
          }

          const filterName = filterItem == null ? null : filterItem.name;
          if (name === filterName) {
            return (
              (eventNameLowerCase.includes(searchText.trim().toLowerCase()) &&
                name === filterName) ||
              (eventDescriptionLowerCase.includes(
                searchText.trim().toLowerCase()
              ) &&
                name === filterName) ||
              (eventTypeLowerCase.includes(searchText.trim().toLowerCase()) &&
                name === filterName) ||
              (dayName.includes(searchText.trim().toLowerCase()) &&
                name === filterName)
            );
          } else if (filterName === null) {
            return (
              eventNameLowerCase.includes(searchText.trim().toLowerCase()) ||
              eventDescriptionLowerCase.includes(
                searchText.trim().toLowerCase()
              ) ||
              dayName.includes(searchText.trim().toLowerCase()) ||
              eventTypeLowerCase.includes(searchText.trim().toLowerCase())
            );
          }
        });

        let tagArr = [];
        for (event of sortedEvents) {
          for (var { name } of event.tags) {
            tagArr.push(name);
          }
        }

        const counter = Object.create(null);
        tagArr.forEach(function (tag) {
          counter[tag] = (counter[tag] || 0) + 1;
        });
        tagArr.sort(function (x, y) {
          return counter[y] - counter[x];
        });

        let uniquetagArr = [...new Set(tagArr)];

        sortedEvents = sortedEvents.filter((event) => {
          let result = event.tags && event.tags.map((a) => a.name);
          let found = result.some((r) => highlightedTags.includes(r));

          if (highlightedTags.length != 0) {
            if (!found) {
              return false;
            }
          }
          return true;
        });

        const events = [];
        let eventDays = ["Friday", "Saturday", "Sunday"];

        for (let day of getDaysForEvent(sortedEvents)) {
          if (day == "friday") {
            events.push({ day: eventDays[0] });
          }
          if (day == "saturday") {
            events.push({ day: eventDays[1] });
          }
          if (day == "sunday") {
            events.push({ day: eventDays[2] });
          }
          for (const event of getEventsForDay(sortedEvents, day)) {
            events.push(event);
          }
        }

        return (
          <SafeAreaView
            style={[dynamicStyles.backgroundColor, styles.safeArea]}
          >
            <View style={styles.searchHeader}>
              <SearchBar
                searchIcon={
                  <SearchIcon
                    fill={
                      dynamicStyles.secondaryBackgroundColor.backgroundColor
                    }
                  />
                }
                containerStyle={[
                  styles.searchContainer,
                  dynamicStyles.backgroundColor,
                  dynamicStyles.searchBorderTopColor,
                  dynamicStyles.searchBorderBottomColor,
                ]}
                inputContainerStyle={[
                  styles.inputContainer,
                  dynamicStyles.searchBackgroundColor,
                ]}
                clearIcon={null}
                disabled={filterMenuOpen}
                lightTheme
                round
                placeholder="Search..."
                onChangeText={(value) => searchEvents(value)}
                value={searchText}
              />

              {backButton()}
            </View>

            <View style={dynamicStyles.backgroundColor}>
              <FilterSelect
                onSelectFilter={(newFilter) => {
                  setFilterItem(newFilter);
                  setHighlightedTags([]);
                }}
                onFilterMenuChange={(isOpen) => setFilterMenuOpen(isOpen)}
              />

              {/* Trending Topics */}
              {uniquetagArr.length > 0 && (
                <View style={{ flexDirection: "row", display: "flex" }}>
                  <Text style={[dynamicStyles.text, styles.trendingTopics]}>
                    Trending Topics
                  </Text>
                  {highlightedTags.length > 0 && (
                    <TouchableOpacity
                      disabled={filterMenuOpen}
                      onPress={() => setHighlightedTags([])}
                      style={[
                        styles.clearButtonStyle,
                        dynamicStyles.borderColor,
                      ]}
                    >
                      <Text style={[dynamicStyles.text, styles.clear]}>
                        clear
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              {/*Tags */}
              <View style={{ marginLeft: 10 }}>
                <TagScrollView
                  scroll={!filterMenuOpen}
                  disabled={filterMenuOpen}
                  style={{ padding: 10 }}
                  tags={uniquetagArr}
                  highlightedTags={highlightedTags}
                  onPress={(tag) => {
                    if (highlightedTags.includes(tag)) {
                      highlightedTagsCopy.splice(
                        highlightedTagsCopy.indexOf(tag),
                        1
                      );
                      setHighlightedTags(highlightedTagsCopy);
                    } else {
                      highlightedTagsCopy.push(tag),
                        setHighlightedTags(highlightedTagsCopy);
                    }
                  }}
                />
              </View>
              <View
                style={[styles.divider, dynamicStyles.searchDividerColor]}
              />
              {events.length == 0 ? (
                <Text style={[styles.noEvents, dynamicStyles.text]}>
                  {" "}
                  No Events Found{" "}
                </Text>
              ) : (
                <FlatList
                  data={events}
                  scrollEnabled={!filterMenuOpen}
                  renderItem={({ item, index }) => {
                    if (item.day) {
                      return (
                        <View style={styles.dayContainer}>
                          <View
                            style={[
                              styles.dayStyle,
                              dynamicStyles.secondaryBackgroundColor,
                            ]}
                          >
                            <Text style={[styles.dayText, dynamicStyles.text]}>
                              {item.day}
                            </Text>
                          </View>
                        </View>
                      );
                    } else {
                      return (
                        <TouchableOpacity
                          disabled={filterMenuOpen}
                          style={styles.flatList}
                          onPress={() => {
                            onPressEvent(item);
                          }}
                        >
                          <ScheduleEventCell event={item} />
                        </TouchableOpacity>
                      );
                    }
                  }}
                  contentContainerStyle={{
                    paddingBottom: 200,
                  }}
                  keyExtractor={(item, index) =>
                    item && item.id ? item.id : index
                  }
                />
              )}
              <EventBottomSheet reference={sheetRef} event={selectedEvent} />
            </View>
          </SafeAreaView>
        );
      }}
    </ThemeContext.Consumer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  noEvents: {
    marginLeft: 10,
    marginTop: 10,
    fontFamily: "SpaceMono-Regular",
    fontSize: 14,
  },

  flatList: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
  },

  divider: {
    borderBottomWidth: 1,
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
  },

  trendingTopics: {
    fontFamily: "SpaceMono-Bold",
    fontSize: 18,
    marginLeft: 15,
    marginTop: 10,
    flex: 1,
  },

  clear: {
    fontFamily: "SpaceMono-Regular",
    textAlign: "center",
    paddingRight: 7,
    paddingLeft: 7,
  },

  clearButtonStyle: {
    marginRight: 15,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 50,
  },

  dayContainer: {
    flexDirection: "row",
    marginTop: 15,
    marginLeft: 15,
  },

  dayStyle: {
    borderRadius: 8,
  },

  dayText: {
    padding: 7,
    fontFamily: "SpaceMono-Regular",
  },

  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },

  textStyle: {
    padding: 7,
    fontFamily: "SpaceMono-Regular",
  },

  tagStyle: {
    borderRadius: 50,
    marginTop: 15,
    marginLeft: 10,
  },

  background: {
    backgroundColor: "white",
  },

  cancelButton: {
    padding: 10,
  },

  filterButton: {
    height: 22,
    width: 63,
    left: 10,
    backgroundColor: "#C866F5",
    borderRadius: 10,
  },

  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  searchContainer: {
    width: Platform.OS === "ios" ? "80%" : "100%",
    // width: "80%",
    borderWidth: 0,
  },

  inputContainer: {
    height: 41,
  },
});
