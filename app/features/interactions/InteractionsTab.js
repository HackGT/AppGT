import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { ThemeContext } from "../../contexts/ThemeContext";
import { EventSel } from "./EventSel";
import { ScanScreen } from "./ScanScreen";
import SearchIcon from "../../../assets/images/Search";
import { SearchBar } from "react-native-elements";

export function InteractionsTab(props) {
  const { dynamicStyles } = useContext(ThemeContext);
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
    props.navigation.navigate("InteractionScreen", {
      selectedEvent: event
    });
    // if (event) {
    //   setSelectedEvent(event);
    // } else {
    //   setSelectedEvent(null);
    // }
  };

    // there are no events getting properly populated
    // var formattedEvents = [];
    // var shownEvents = searchText.length != 0 ? searchResults : events;

    const formattedEvents = !events ? [] : events.filter(e => e.name.includes(searchText)).map(event => {
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
      return <TouchableOpacity
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
    })

    // shownEvents.forEach((event) => {
    //   const eventType =
    //     event != null && event.type != null
    //       ? event.type
    //       : { name: "none", color: "gray" };
    //   const loc =
    //     event != null &&
    //     event.location != null &&
    //     event.location[0] != null &&
    //     event.location[0].name != null
    //       ? event.location[0].name + " • "
    //       : "";
    //   formattedEvents.push(
    //     <TouchableOpacity
    //       key={event.id}
    //       onPress={() => {
    //         onPressEvent(event);
    //       }}
    //     >
    //       <EventSel
    //         key={event.id}
    //         name={event.name}
    //         startTime={event.startTime}
    //         endTime={event.endTime}
    //         location={loc}
    //         type={eventType}
    //         dynamicStyles={dynamicStyles}
    //       />
    //     </TouchableOpacity>
    //   );
    // });

    return (
      <View style={[dynamicStyles.backgroundColor, { flex: 1 }]}>
        <View style={styles.header}>
          <SearchBar
            searchIcon={
              <SearchIcon
                fill={dynamicStyles.secondaryBackgroundColor.backgroundColor}
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
    );
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