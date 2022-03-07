import React, { Component } from "react";
import { Text, View, StyleSheet,ScrollView, FlatList, TouchableOpacity, Button } from "react-native";
import { ThemeContext } from "../context";
import { EventSel } from "./EventSel";
import { ScanScreen } from "./ScanScreen";
import SearchIcon from "../assets/Search";
import { SearchBar } from "react-native-elements";

export class SelectionScreen extends Component {

  state = {
    events: null,
    selectedEvent: null,
    searchText: "", 
    searchResults: null
  }
  
  async componentDidMount() {
    this.refreshEventState();

    AppState.addEventListener("change", (state) => {
        if (state == "active") {
          this.refreshEventState();
        }
      });
  }

  async refreshEventState() {
    const response = await fetch("https://keystone.dev.hack.gt/admin/api", {
        method: "POST",
        headers: {
        "Content-Type": `application/json`,
        Accept: `application/json`,
        },
        body: JSON.stringify({
        query: `query {
            allEvents  (orderBy: "name") {
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
      var events = this.state.searchResults != null ? this.state.searchResults : this.state.events;
      events.forEach((event)=>{
        const eventType = event != null && event.type != null
            ? event.type
            : { name: "none", color: "gray" };
        const loc = event != null && event.location != null && event.location[0] != null && event.location[0].name != null
            ? event.location[0].name + " • "
            : "";
        formattedEvents.push(
            <TouchableOpacity
                style={styles.cardHorizontalParent}
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
                />
            </TouchableOpacity>
        );
      })
        if(this.state.selectedEvent == null) {
            return (
              <ScrollView>
                <View style={[styles.eventContainer]}>
                  <ThemeContext.Consumer>
                      {({ dynamicStyles }) => (
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
                    )} 
                    </ThemeContext.Consumer>
                    {formattedEvents}
                </View>
              </ScrollView>);
        } else {
            return ( 
            <ScrollView>
                  <View style={[styles.eventContainer]}>
                        <Text style={[styles.header]}> {this.state.selectedEvent.name} </Text>
                        <Button title="< Back" onPress={() => {
                            this.setSelectedEvent(null);
                        }}/>
                        <ScanScreen 
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
            </ScrollView>);

        }
      
    } else { return (<View/>); }
  }
}


const styles = StyleSheet.create({

  header: {
    fontFamily: "SpaceMono-Bold",
    textAlign: "center",
    fontSize: 22,
    marginTop: 34,
    marginBottom: 10, 
    flexDirection: "row",
    alignItems: "center", 
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

