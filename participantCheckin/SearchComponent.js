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

export class SearchComponent extends Component {

  constructor() {
    super();
    this.state = {
      searchText: ""
    };
  }

  searchEvents = (value) => {
    console.log(value)
    this.setState({ searchText: value });
  };

  render() {
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
                    onChangeText={(value) => this.searchEvents(value)}
                    value={this.state.searchText}
                />
            </View>
    )} 
    </ThemeContext.Consumer> );
  }
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
