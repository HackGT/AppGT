import React, { Component } from "react";
import { HackathonContext, ThemeContext } from "../context";
import { colors } from "../cms/DataHandler";
import { SearchBar } from "react-native-elements";
import { FlatList, Text, View, StyleSheet, StatusBar } from "react-native";
import SearchIcon from "../assets/Search";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { Card, CardItem, List, Button } from "native-base";
import CancelIcon from "../assets/Cancel";
import { authorize } from "react-native-app-auth";
import { getCurrentDayIndex } from "../cms/DataHandler";
import { ScheduleEventCell } from "./ScheduleEventCell";

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
      exitFilter: false,
      showFilterButton: true,
      searchText: "",
    };
  }

  searchEvents = (value) => {
    this.setState({ searchText: value });
  };

  render() {
    <ThemeContext.Consumer>
      {({ dynamicStyles }) => (
        <HackathonContext.Consumer>
          {({ hackathon }) => {
            const filteredEvents = hackathon.events.filter((event) => {
              let eventLowerCase = event.title.toLowerCase();
              return (
                eventLowerCase.indexOf(this.state.searchText.trim().toLowerCase()) > -1
              );
            });
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
                    lightTheme
                    round
                    placeholder="Search..."
                    onChangeText={(value) => this.searchEvents(value)}
                  />

                  {this.backButton()}
                </View>

                <View style={dynamicStyles.backgroundColor}>
                  {/* Filter Button */}
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ showFilterMenu: true }),
                        this.setState({ exitFilter: true }),
                        this.setState({
                          showFilterButton: false,
                        });
                    }}
                    style={styles.filterContainer}
                  >
                    {this.state.showFilterButton && (
                      <View
                        style={[
                          styles.filterStyle,
                          dynamicStyles.searchBackgroundColor,
                        ]}
                      >
                        <Text
                          style={[styles.filterTextStyle, dynamicStyles.text]}
                        >
                          {" "}
                          Filter{" "}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                  {/* Exit Button */}
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ showFilterMenu: false }),
                        this.setState({ exitFilter: false }),
                        this.setState({ showFilterButton: true });
                    }}
                    style={styles.exitContainer}
                  >
                    {this.state.exitFilter && (
                      <View
                        style={[
                          styles.exitStyle,
                          dynamicStyles.searchBackgroundColor,
                        ]}
                      >
                        <Text
                          style={[styles.exitTextStyle, dynamicStyles.text]}
                        >
                          {" "}
                          x{" "}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
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
                    {[
                      "#boba",
                      "#ML",
                      "#facebook",
                      "#coffee",
                      "#facebook",
                      "#boba",
                      "#coffee",
                      "#ML",
                    ].map((value, i) => {
                      return (
                        <TouchableOpacity
                          style={[
                            styles.tagStyle,
                            dynamicStyles.searchBackgroundColor,
                          ]}
                        >
                          <Text style={[styles.textStyle, dynamicStyles.text]}>
                            {" "}
                            {value}{" "}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <FlatList
                    data={filteredEvents}
                    renderItem={({ item, index }) => {
                      return <ScheduleEventCell event={item} />;
                    }}
                    keyExtractor={(item, index) =>
                      item && item.id ? item.id : index
                    }
                  />
                </View>
              </SafeAreaView>
            );
          }}
        </HackathonContext.Consumer>
      )}
    </ThemeContext.Consumer>;
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: "white",
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
    // backgroundColor: "#F2F2F2",
    borderRadius: 50,
    padding: 7,
  },

  exitTextStyle: {
    fontSize: 16,
  },

  filterContainer: {
    flexDirection: "row",
    marginTop: 15,
    marginLeft: 10,
  },

  filterStyle: {
    // backgroundColor: "#F2F2F2",
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
    // backgroundColor: "#F2F2F2",
    borderRadius: 50,
    marginTop: 15,
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
    // backgroundColor: 'white',
    width: "80%",
    borderWidth: 0,
    // borderTopColor: 'white',
    // borderBottomColor: 'white',
  },

  inputContainer: {
    // backgroundColor: "#F2F2F2",
    height: 41,
  },
});
