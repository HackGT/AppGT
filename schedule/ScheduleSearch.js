import React, { Component } from "react";
import { HackathonContext, ThemeContext } from "../context";
import { getEventsForDay, getDaysForEvent } from "../cms/DataHandler";
import { SearchBar } from "react-native-elements";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import SearchIcon from "../assets/Search";
import { SafeAreaView } from "react-native-safe-area-context";
import CancelIcon from "../assets/Cancel";
import X from "../assets/X";
import { ScheduleEventCell } from "./ScheduleEventCell";
import { EventBottomSheet } from "./EventBottomSheet";
import FilterSelect from "../components/FilterSelect";
import TagScrollView from "../components/TagScrollView";

export class ScheduleSearch extends Component {
  backButton = () => {
    const { navigation } = this.props;

    return (
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <CancelIcon />
      </TouchableOpacity>
    );
  };

  constructor() {
    super();
    this.state = {
      searchText: "",
      selectedEvent: null,
      filterItem: null,
      highlightedTags: [],
    };
  }

  setSelectedEvent = (event) => {
    if (event) {
      this.setState({ selectedEvent: event });
      this.RBSheet.open();
    } else {
      this.setState({ selectedEvent: null });
      this.RBSheet.close();
    }
  };

  searchEvents = (value) => {
    this.setState({ searchText: value });
  };

  render() {
    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <HackathonContext.Consumer>
            {({ hackathon }) => {
              let highlightedTagsCopy = [...this.state.highlightedTags];
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
                const name =
                  event.type && event.type.name ? event.type.name : null;

                if (event.description != null) {
                  eventDescriptionLowerCase = event.description.toLowerCase();
                }

                if (name != null) {
                  eventTypeLowerCase = name.toLowerCase();
                }

                const filterName =
                  this.state.filterItem == null
                    ? null
                    : this.state.filterItem.name;
                if (name === filterName) {
                  return (
                    (eventNameLowerCase.includes(
                      this.state.searchText.trim().toLowerCase()
                    ) &&
                      name === filterName) ||
                    (eventDescriptionLowerCase.includes(
                      this.state.searchText.trim().toLowerCase()
                    ) &&
                      name === filterName) ||
                    (eventTypeLowerCase.includes(
                      this.state.searchText.trim().toLowerCase()
                    ) &&
                      name === filterName) ||
                    (dayName.includes(
                      this.state.searchText.trim().toLowerCase()
                    ) &&
                      name === filterName)
                  );
                } else if (filterName === null) {
                  return (
                    eventNameLowerCase.includes(
                      this.state.searchText.trim().toLowerCase()
                    ) ||
                    eventDescriptionLowerCase.includes(
                      this.state.searchText.trim().toLowerCase()
                    ) ||
                    dayName.includes(
                      this.state.searchText.trim().toLowerCase()
                    ) ||
                    eventTypeLowerCase.includes(
                      this.state.searchText.trim().toLowerCase()
                    )
                  );
                }
              });

              let tagArr = [];
              for (event of sortedEvents) {
                for (var { name } of event.tags) {
                  tagArr.push(name);
                }
              }

              counter = Object.create(null);
              tagArr.forEach(function (tag) {
                counter[tag] = (counter[tag] || 0) + 1;
              });
              tagArr.sort(function (x, y) {
                return counter[y] - counter[x];
              });

              let uniquetagArr = [...new Set(tagArr)];

              sortedEvents = sortedEvents.filter((event) => {
                let result = event.tags && event.tags.map((a) => a.name);
                let found = result.some((r) =>
                  this.state.highlightedTags.includes(r)
                );

                if (this.state.highlightedTags.length != 0) {
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
                            dynamicStyles.secondaryBackgroundColor
                              .backgroundColor
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
                      lightTheme
                      round
                      placeholder="Search..."
                      onChangeText={(value) => this.searchEvents(value)}
                      value={this.state.searchText}
                    />

                    {this.backButton()}
                  </View>

                  <View style={dynamicStyles.backgroundColor}>
                    <FilterSelect
                      onSelectFilter={(newFilter) =>
                        this.setState({
                          filterItem: newFilter,
                          highlightedTags: [],
                        })
                      }
                    />
                    {/* Trending Topics */}
                    {uniquetagArr.length > 0 && (
                      <View style={{ flexDirection: "row", display: "flex" }}>
                        <Text
                          style={[dynamicStyles.text, styles.trendingTopics]}
                        >
                          Trending Topics
                        </Text>
                        {this.state.highlightedTags.length > 0 && (
                          <TouchableOpacity
                            onPress={() =>
                              this.setState({
                                highlightedTags: [],
                              })
                            }
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
                        style={{ padding: 10 }}
                        tags={uniquetagArr}
                        highlightedTags={this.state.highlightedTags}
                        onPress={(tag) => {
                          if (this.state.highlightedTags.includes(tag)) {
                            highlightedTagsCopy.splice(
                              highlightedTagsCopy.indexOf(tag),
                              1
                            );
                            this.setState({
                              highlightedTags: highlightedTagsCopy,
                            });
                          } else {
                            highlightedTagsCopy.push(tag),
                              this.setState({
                                highlightedTags: highlightedTagsCopy,
                              });
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
                                  <Text
                                    style={[styles.dayText, dynamicStyles.text]}
                                  >
                                    {item.day}
                                  </Text>
                                </View>
                              </View>
                            );
                          } else {
                            return (
                              <TouchableOpacity
                                style={styles.flatList}
                                onPress={() => {
                                  this.setSelectedEvent(item);
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
                    <EventBottomSheet
                      reference={(ref) => (this.RBSheet = ref)}
                      event={this.state.selectedEvent}
                    />
                  </View>
                </SafeAreaView>
              );
            }}
          </HackathonContext.Consumer>
        )}
      </ThemeContext.Consumer>
    );
  }
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
    width: "80%",
    borderWidth: 0,
  },

  inputContainer: {
    height: 41,
  },
});
