import React, { Component } from "react";
import { Text, View, StyleSheet,ScrollView, FlatList, TouchableOpacity, Button } from "react-native";
import { ThemeContext } from "../context";
import { EventSel } from "./EventSel";
import { ScanScreen } from "./ScanScreen";
import SearchIcon from "../assets/Search";
import { SearchBar } from "react-native-elements";
import { dynamicStyles } from "../themes";

export class CheckInTab extends Component {

  state = {
    events: null,
    selectedEvent: null,
    searchText: "",
    searchResults: null
  }

  async componentDidMount() {
    this.refreshEventState();

    // AppState.addEventListener("change", (state) => {
    //     if (state == "active") {
    //       this.refreshEventState();
    //     }
    //   });
  }

  async refreshEventState() {
    // const response = await fetch("https://keystone.dev.hack.gt/admin/api", {
    const response = await fetch("https://cms.hack.gt/admin/api", {
        method: "POST",
        headers: {
        "Content-Type": `application/json`,
        Accept: `application/json`,
        },
        body: JSON.stringify({
        query: `query {
            allEvents  (orderBy: "name", where: { hackathon: { isUsedForMobileApp:true } }) {
                name
                endTime
                startTime
                startDate
                url
                tags {
                    name
                }
                description
                location {
                    name
                }
                id
            }
          }`,
        }),
    });
    const data = await response.json();
    this.setState({events: data.data.allEvents})

  }

  searchEvents = (value) => {
      var newEvents = this.state.events.filter(e => e.name.includes(this.state.searchText));
      this.setState({ searchText: value, searchResults: newEvents });
  };

  setSelectedEvent = (event) => {
    if (event) {
      this.setState({ selectedEvent: event });
    } else {
      this.setState({ selectedEvent: null });
    }
  };



  render() {

    if(this.state.events != null) { // there are no events getting properly populated
      var formattedEvents = [];
      var events = this.state.searchText.length != 0 ? this.state.searchResults : this.state.events;
      events.forEach((event)=>{
        const eventType = event != null && event.type != null
            ? event.type
            : { name: "none", color: "gray" };
        const loc = event != null && event.location != null && event.location[0] != null && event.location[0].name != null
            ? event.location[0].name + " • "
            : "";
        formattedEvents.push(
            <TouchableOpacity
            key={event.id}
                onPress={() => {
                    this.setSelectedEvent(event);
                }}
                >
                <EventSel
                    key={event.id}
                    name={event.name}
                    startTime={event.startTime}
                    endTime={event.endTime}
                    location={loc}
                    type={eventType}
                    dynamicStyles={dynamicStyles}
                />
            </TouchableOpacity>
        );
      })
        if(this.state.selectedEvent == null) {
            return (
              <ThemeContext.Consumer>
                {({ dynamicStyles }) => (
                  <View style={dynamicStyles.backgroundColor}>
                      <View style={styles.header}>
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
                            { flex: 1 }
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
                      </View>

                    <ScrollView>
                      <View>
                        <View style={styles.eventContainer}>
                        {formattedEvents}
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                )}
              </ThemeContext.Consumer>
              );
        } else {
            return (
              <ThemeContext.Consumer>
                {({ dynamicStyles }) => (
                  <ScrollView style={dynamicStyles.backgroundColor}>
                        <View style={styles.eventContainer}>
                          <Text style={[styles.title, { paddingLeft: 0 }]}>{this.state.selectedEvent.name}</Text>
                          <Text
                            numberOfLines={this.props.truncateText ? 1 : null}
                            ellipsizeMode={"tail"}
                            style={[dynamicStyles.secondaryText, { fontFamily: "SpaceMono-Bold", marginLeft: 0 }]}
                          >
                            {this.state.selectedEvent != null && this.state.selectedEvent.location != null && this.state.selectedEvent.location[0] != null && this.state.selectedEvent.location[0].name != null
                              ? this.state.selectedEvent.location[0].name + " • "
                              : ""}
                            {this.state.selectedEvent.startTime + ' - ' + this.state.selectedEvent.endTime}
                          </Text>
                            <Button title="< Back" onPress={() => {
                                this.setSelectedEvent(null);
                            }}/>
                            <ScanScreen
                                eventID = {this.state.selectedEvent.id}
                                startTime={this.state.selectedEvent.startTime}
                                endTime={this.state.selectedEvent.endTime}
                                location={this.state.selectedEvent != null && this.state.selectedEvent.location != null && this.state.selectedEvent.location[0] != null && this.state.selectedEvent.location[0].name != null
                                    ? this.state.selectedEvent.location[0].name + " • "
                                    : ""}
                                type={this.state.selectedEvent != null && this.state.selectedEvent.type != null
                                    ? this.state.selectedEvent.type
                                    : { name: "none", color: "gray" }}
                                description={this.state.selectedEvent.description}
                            />
                      </View>
                  </ScrollView>
                )}
              </ThemeContext.Consumer>
            );

        }

    } else { return (<View/>); }
  }
}


const styles = StyleSheet.create({

  header: {
    fontFamily: "SpaceMono-Bold",
    textAlign: "center",
    fontSize: 22,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    fontFamily: "SpaceMono-Bold",
    fontSize: 22,
    marginBottom: 10,
    marginTop: 10
  },

  eventContainer: {
    marginHorizontal: 15,
    flex: 1,
  },
  inputContainer: {
    height: 41,
  },
  searchContainer: {
    width: Platform.OS === "ios" ? "80%" : "100%",
    borderWidth: 0,
  },
});
