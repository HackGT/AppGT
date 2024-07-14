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
import { SwagItemCard } from "./SwagItemCard";
import { ScanScreen } from "./ScanScreen";
import SearchIcon from "../../../assets/images/Search";
import { SearchBar } from "react-native-elements";
import { getStartEndTime } from "../../util";
import { AuthContext } from "../../contexts/AuthContext";
import { HackathonContext } from "../../state/hackathon";

export function SwagTab(props) {
  const { dynamicStyles } = useContext(ThemeContext);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const hackathonContext = useContext(HackathonContext);
  const hackathon = hackathonContext.state.hackathon;
  const swagItems = hackathon.swag;

  const searchSwagItems = (value) => {
    var newSwagItems = swagItems.filter((s) => s.name.includes(searchText));
    setSearchResults(newSwagItems);
    setSearchText(value);
  };

  const onPressSwagItem = (swagItem) => {
    props.navigation.navigate("InteractionScreen", {
      selectedEvent: swagItem,
    });
  };

  const formattedSwagItems = !swagItems
    ? []
    : swagItems
        .filter((s) => s.name.includes(searchText))
        .map((item) => {
          // const eventType = event.type ?? "none";
          // const loc =
          //   event != null &&
          //   event.location != null &&
          //   event.location[0] != null &&
          //   event.location[0].name != null
          //     ? event.location[0].name + " • "
          //     : "";

          // const { startTime, endTime } = getStartEndTime(
          //   event.startDate,
          //   event.endDate
          // );
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                onPressSwagItem(item);
              }}
            >
              <SwagItemCard
                key={item.id}
                name={item.name}
                cost={item.points}
                description={item.description}
                dynamicStyles={dynamicStyles}
              />
            </TouchableOpacity>
          );
        });

  return (
    <View style={[dynamicStyles.backgroundColor, { flex: 1 }]}>
      <View style={styles.header}>
        <Text style={[dynamicStyles.text, styles.headerText]}>
          Swag Checkout
        </Text>
        <Text style={[styles.headerHelpText, dynamicStyles.secondaryText]}>
          Use this page to checkout participant's swag items. Click on the desired swag item and then scan their badge or scan their QR code from the profile tab.
        </Text>
        <View style={styles.searchBarWrapper}>
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
            onChangeText={(value) => searchSwagItems(value)}
            value={searchText}
          />
        </View>
      </View>

      <ScrollView>
        <View style={styles.swagCardContainer}>{formattedSwagItems}</View>
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
    marginTop: 10,
    marginBottom: 5,
  },

  headerText: {
    fontFamily: "SpaceMono-Bold",
    fontSize: 22,
    marginHorizontal: 15,
  },

  headerHelpText: {
    marginHorizontal: 15,
    fontFamily: "SpaceMono-Bold",
    marginTop: 5,
  },

  searchBarWrapper: {
    fontFamily: "SpaceMono-Bold",
    textAlign: "center",
    fontSize: 22,
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

  swagCardContainer: {
    marginHorizontal: 15,
    flex: 1,
    paddingTop: 5,
  },
  inputContainer: {
    height: 41,
  },
  searchContainer: {
    width: Platform.OS === "ios" ? "80%" : "100%",
    borderWidth: 0,
  },
});
