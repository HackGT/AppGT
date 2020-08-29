import React, { Component } from "react";
import { HackathonContext, ThemeContext } from "../context";
import { colors, getEventsForDay, getDaysForEvent } from "../cms/DataHandler";
import { SearchBar } from "react-native-elements";
import { FlatList, Text, ScrollView, View, StyleSheet } from "react-native";
import SearchIcon from "../assets/Search";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Card, CardItem, List } from "native-base";
import CancelIcon from "../assets/Cancel";
import { ScheduleEventCell } from "./ScheduleEventCell";
import { EventBottomSheet } from "./EventBottomSheet";

export class ScheduleSearch extends Component {
  filterButton = () => {
    return (
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => navigation.goBack()}
      >
        <Text>Filter</Text>
      </TouchableOpacity>
    );
  };

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

  searchList = () => {
    return (
      <List>
        {new Array(20).fill(null).map((_, i) => (
          <TouchableOpacity key={i}>
            <Card>
              <CardItem>
                <Text>Item {i}</Text>
              </CardItem>
            </Card>
          </TouchableOpacity>
        ))}
      </List>
    );
  };

  constructor() {
    super();
    this.state = {
      showFilterMenu: false,
      showFilterButton: true,
      searchText: "",
      selectedEvent: null,
      filterType: false,
      filterName: "",
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
    hideFilterMenu = (name) => {
      this.setState({
        showFilterMenu: false,
      });
      this.state.filterName = name;
      if (this.state.filterName === "clear") {
        this.setState({
          showFilterButton: true,
          filterType: false,
        });
      } else {
        this.setState({
          filterType: true,
        });
      }
    };
    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <HackathonContext.Consumer>
            {({ hackathon }) => {
              let highlightedTagsCopy = [...this.state.highlightedTags];
              let sortedEvents = [...hackathon.events];
              var days = [
                "sunday",
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
              ];

              sortedEvents = sortedEvents.filter((event) => {
                var date = new Date(event.startDate);
                var dayName = days[date.getDay()];
                let eventNameLowerCase = event.name.toLowerCase();
                let eventDescriptionLowerCase = "";
                let eventTypeLowerCase = "";

                if (event.description != null) {
                  eventDescriptionLowerCase = event.description.toLowerCase();
                }

                if (event.type.name != null) {
                  eventTypeLowerCase = event.type.name.toLowerCase();
                }

                if (event.type.name === this.state.filterName) {
                  return (
                    (eventNameLowerCase.includes(
                      this.state.searchText.trim().toLowerCase()
                    ) &&
                      event.type.name === this.state.filterName) ||
                    (eventDescriptionLowerCase.includes(
                      this.state.searchText.trim().toLowerCase()
                    ) &&
                      event.type.name === this.state.filterName) ||
                    (eventTypeLowerCase.includes(
                      this.state.searchText.trim().toLowerCase()
                    ) &&
                      event.type.name === this.state.filterName) ||
                    (dayName.includes(
                      this.state.searchText.trim().toLowerCase()
                    ) &&
                      event.type.name === this.state.filterName)
                  );
                } else if (
                  this.state.filterName === "" ||
                  this.state.filterName === "clear"
                ) {
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
              tagArr.forEach(function(tag) {
                counter[tag] = (counter[tag] || 0) + 1;
              });
              tagArr.sort(function(x, y) {
                return counter[y] - counter[x];
              });

              let uniquetagArr = [...new Set(tagArr)];

              sortedEvents = sortedEvents.filter((event) => {
                let result = event.tags.map((a) => a.name);
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

              for (const day of getDaysForEvent(sortedEvents)) {
                events.push({ day: day });
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
                      lightTheme
                      round
                      placeholder="Search..."
                      onChangeText={(value) => this.searchEvents(value)}
                      value={this.state.searchText}
                    />

                    {this.backButton()}
                  </View>

                  <View style={dynamicStyles.backgroundColor}>
                    {/* Filter Button */}
                    <View style={styles.filterContainer}>
                      {this.state.showFilterButton && (
                        <TouchableOpacity
                          style={[
                            styles.filterStyle,
                            dynamicStyles.searchBackgroundColor,
                          ]}
                          onPress={() => {
                            this.setState({
                              showFilterMenu: true,
                              showFilterButton: false,
                            });
                          }}
                        >
                          <Text
                            style={[styles.filterTextStyle, dynamicStyles.text]}
                          >
                            {" "}
                            Filter{" "}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    {/* Exit Button */}
                    <View style={styles.exitContainer}>
                      {this.state.showFilterMenu && (
                        <TouchableOpacity
                          style={[
                            styles.exitStyle,
                            dynamicStyles.searchBackgroundColor,
                          ]}
                          onPress={() => {
                            if (
                              this.state.filterName != "clear" &&
                              this.state.filterName != ""
                            ) {
                              this.setState({
                                filterType: true,
                                showFilterMenu: false,
                              });
                            } else {
                              this.setState({
                                showFilterButton: true,
                                showFilterMenu: false,
                              });
                            }
                          }}
                        >
                          <Text
                            style={[styles.exitTextStyle, dynamicStyles.text]}
                          >
                            {" "}
                            x{" "}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    {/* Filter Type */}
                    <View style={styles.exitContainer}>
                      {this.state.filterType && (
                        <TouchableOpacity
                          style={[
                            this.state.filterName === "important"
                              ? styles.important
                              : this.state.filterName === "food"
                              ? styles.food
                              : this.state.filterName === "speaker"
                              ? styles.speaker
                              : this.state.filterName === "mini-event"
                              ? styles.minievent
                              : this.state.filterName === "workshop"
                              ? styles.workshop
                              : styles.none,
                          ]}
                          onPress={() => {
                            this.setState({
                              showFilterMenu: true,
                              filterType: false,
                            });
                          }}
                        >
                          <Text style={styles.filterText}>
                            {" "}
                            {this.state.filterName}{" "}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    {/* Filter Menu */}
                    {this.state.showFilterMenu &&
                      Object.keys(colors).map(function(name, index) {
                        const color = colors[name];
                        return (
                          <View
                            style={{
                              flexDirection: "row",
                              marginTop: 55,
                              top: index * 45,
                              left: 10,
                              position: "absolute",
                              zIndex: 1,
                              shadowColor: "#000",
                              shadowOffset: {
                                width: 0,
                                height: 2,
                              },
                              shadowOpacity: 0.25,
                            }}
                          >
                            <TouchableOpacity
                              onPress={this.hideFilterMenu.bind(this, name)}
                              style={{
                                backgroundColor: color,
                                borderRadius: 50,
                              }}
                            >
                              <Text
                                style={{
                                  padding: 7,
                                  color: "white",
                                  fontFamily: "Space Mono",
                                }}
                              >
                                {" "}
                                {name}{" "}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    {/* Trending Topics */}
                    <Text style={[dynamicStyles.text, styles.trendingTopics]}>
                      Trending Topics
                    </Text>
                    {/*Tags */}
                    <View style={styles.container}>
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                      >
                        {uniquetagArr.map((value, i) => {
                          return (
                            <TouchableOpacity
                              onPress={() =>
                                this.state.highlightedTags.includes(value)
                                  ? [
                                      highlightedTagsCopy.splice(
                                        highlightedTagsCopy.indexOf(value),
                                        1
                                      ),
                                      this.setState({
                                        highlightedTags: highlightedTagsCopy,
                                      }),
                                    ]
                                  : [
                                      highlightedTagsCopy.push(value),
                                      this.setState({
                                        highlightedTags: highlightedTagsCopy,
                                      }),
                                    ]
                              }
                              style={[
                                styles.tagStyle,
                                this.state.highlightedTags.includes(value)
                                  ? dynamicStyles.tintBackgroundColor
                                  : dynamicStyles.searchBackgroundColor,
                              ]}
                            >
                              <Text
                                style={[styles.textStyle, dynamicStyles.text]}
                              >
                                {" "}
                                {value}{" "}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
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
                          paddingBottom: 220,
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
    fontFamily: "Space Mono",
    fontSize: 14,
  },

  important: {
    borderRadius: 50,
    padding: 7,
    backgroundColor: "#2CDACF",
  },

  food: {
    borderRadius: 50,
    padding: 7,
    backgroundColor: "#C866F5",
  },
  speaker: {
    borderRadius: 50,
    padding: 7,
    backgroundColor: "#FF586C",
  },
  minievent: {
    borderRadius: 50,
    padding: 7,
    backgroundColor: "#FF8D28",
  },
  workshop: {
    borderRadius: 50,
    padding: 7,
    backgroundColor: "#786CEB",
  },

  flatList: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
  },

  divider: {
    borderBottomWidth: 1,
    marginTop: 25,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
  },

  trendingTopics: {
    fontFamily: "Space Mono",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 15,
    marginTop: 15,
  },

  exitContainer: {
    flexDirection: "row",
    marginLeft: 10,
  },

  exitStyle: {
    borderRadius: 50,
    padding: 7,
  },

  exitTextStyle: {
    fontSize: 16,
  },

  filterText: {
    fontSize: 14,
    color: "white",
    fontFamily: "Space Mono",
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
    fontFamily: "Space Mono",
  },

  filterContainer: {
    flexDirection: "row",
    marginTop: 15,
    marginLeft: 10,
  },

  filterStyle: {
    borderRadius: 50,
  },

  filterTextStyle: {
    padding: 7,
    fontFamily: "Space Mono",
  },

  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },

  textStyle: {
    padding: 7,
    fontFamily: "Space Mono",
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
