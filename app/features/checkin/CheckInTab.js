import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Button,
  Pressable,
} from "react-native";
import { ThemeContext } from "../../state/context";
import { EventSel } from "./EventSel";
import { ScanScreen } from "./ScanScreen";
import SearchIcon from "../../../assets/images/Search";
import { SearchBar } from "react-native-elements";
import { dynamicStyles } from "../../theme";

export function CheckInTab(props) {
  const [events, setEvents] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    async function refreshEventState() {
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
      setEvents(data.data.allEvents);
    }

    refreshEventState();
  }, []);

  const searchEvents = (value) => {
    var newEvents = events.filter((e) => e.name.includes(searchText));
    setSearchResults(newEvents);
    setSearchText(value);
  };

  const onPressEvent = (event) => {
    if (event) {
      setSelectedEvent(event);
    } else {
      setSelectedEvent(null);
    }
  };

  if (events != null) {
    // there are no events getting properly populated
    var formattedEvents = [];
    var shownEvents = searchText.length != 0 ? searchResults : events;
    shownEvents.forEach((event) => {
      const eventType =
        event != null && event.type != null
          ? event.type
          : { name: "none", color: "gray" };
      const loc =
        event != null &&
        event.location != null &&
        event.location[0] != null &&
        event.location[0].name != null
          ? event.location[0].name + " • "
          : "";
      formattedEvents.push(
        <TouchableOpacity
          key={event.id}
          onPress={() => {
            onPressEvent(event);
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
    });
    if (selectedEvent == null) {
      return (
        <ThemeContext.Consumer>
          {({ dynamicStyles }) => (
            <View style={dynamicStyles.backgroundColor}>
              <View style={styles.header}>
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
                    { flex: 1 },
                  ]}
                  inputContainerStyle={[
                    styles.inputContainer,
                    dynamicStyles.searchBackgroundColor,
                  ]}
                  clearIcon={null}
                  lightTheme
                  round
                  placeholder="Search..."
                  onChangeText={(value) => searchEvents(value)}
                  value={searchText}
                />
              </View>

              <ScrollView>
                <View>
                  <View style={styles.eventContainer}>{formattedEvents}</View>
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
                <Pressable
                  style={styles.backButton}
                  onPress={() => {
                    onPressEvent(null);
                  }}
                >
                  <Text style={[styles.backButtontext, dynamicStyles.text]}>
                    {"< Back"}
                  </Text>
                </Pressable>

                <Text style={[styles.title, dynamicStyles.text]}>
                  {selectedEvent.name}
                </Text>
                <Text
                  numberOfLines={props.truncateText ? 1 : null}
                  ellipsizeMode={"tail"}
                  style={[
                    dynamicStyles.secondaryText,
                    {
                      fontFamily: "SpaceMono-Bold",
                      marginLeft: 0,
                      textAlign: "center",
                      fontSize: 14,
                    },
                  ]}
                >
                  {selectedEvent != null &&
                  selectedEvent.location != null &&
                  selectedEvent.location[0] != null &&
                  selectedEvent.location[0].name != null
                    ? selectedEvent.location[0].name + " • "
                    : ""}
                  {selectedEvent.startTime + " - " + selectedEvent.endTime}
                </Text>
                <ScanScreen
                  eventID={selectedEvent.id}
                  startTime={selectedEvent.startTime}
                  endTime={selectedEvent.endTime}
                  location={
                    selectedEvent != null &&
                    selectedEvent.location != null &&
                    selectedEvent.location[0] != null &&
                    selectedEvent.location[0].name != null
                      ? selectedEvent.location[0].name + " • "
                      : ""
                  }
                  type={
                    selectedEvent != null && selectedEvent.type != null
                      ? selectedEvent.type
                      : { name: "none", color: "gray" }
                  }
                  description={selectedEvent.description}
                />
              </View>
            </ScrollView>
          )}
        </ThemeContext.Consumer>
      );
    }
  } else {
    return <View />;
  }
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "flex-start",
  },

  backButtontext: {
    fontFamily: "SpaceMono-Bold",
    fontSize: 17,
    marginTop: 10,
  },

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
    marginTop: 10,
    textAlign: "center",
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
