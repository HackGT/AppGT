import React, { useState } from "react";
import { ThemeContext } from "../context";
import { SearchBar } from "react-native-elements";
import {
  View,
  StyleSheet,
} from "react-native";
import SearchIcon from "../assets/Search";

export function SearchComponent(props) {

  const [searchText, setSearchText] = useState("")

  const searchEvents = (value) => {
    setSearchText(value)
  };

  return (
    <ThemeContext.Consumer>
      {({ dynamicStyles }) => (
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
            onChangeText={(value) => searchEvents(value)}
            value={searchText}
          />
        </View>
      )}
    </ThemeContext.Consumer>
  );
}

const styles = StyleSheet.create({
  header: {
    fontFamily: "SpaceMono-Bold",
    textAlign: "center",
    fontSize: 22,
    marginTop: 34,
    marginBottom: 10,
    backgroundColor: "#ADD8E6"
  },
  searchHeader: {
    marginTop: 34,
    flexDirection: "row",
    alignItems: "center",
  },

  searchContainer: {
    width: Platform.OS === "ios" ? "80%" : "100%",
    borderWidth: 0,
  },

  inputContainer: {
    height: 41,
  },
});
