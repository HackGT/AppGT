import React, { Component } from "react";

import { SearchBar } from "react-native-elements";
import { Text, View, StyleSheet } from "react-native";
import SearchIcon from "../assets/Search";

export class ScheduleSearch extends Component {
  render() {
    return (
      <View style={styles.background}>
        <SearchBar
          searchIcon={SearchIcon}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.inputContainer}
          lightTheme
          round
          placeholder="Search..."
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flexDirection: "row-reverse",
    height: "110%", // TODO: hacky way to set background, should be set in stack in App.js
    backgroundColor: "white",
  },

  searchContainer: {
    backgroundColor: "white",
    width: "90%",
    borderWidth: 0,
    borderTopColor: "white",
    borderBottomColor: "white",
  },

  inputContainer: {
    backgroundColor: "#F2F2F2",
    height: 41,
  },
});
