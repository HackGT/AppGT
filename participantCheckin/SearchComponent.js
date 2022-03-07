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
import { SafeAreaView } from "react-native-safe-area-context";

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
  safeArea: {
    flex: 1,
  },
  header: {
    fontFamily: "SpaceMono-Bold",
    textAlign: "center",
    fontSize: 22,
    marginTop: 34,
    marginBottom: 10, 
    backgroundColor: "#ADD8E6"   
  },

  noEvents: {
    marginLeft: 10,
    marginTop: 10,
    fontFamily: "SpaceMono-Regular",
    fontSize: 14,
  },

  flatList: {
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
  },

  divider: {
    borderBottomWidth: 1,
    marginTop: 15,
    marginLeft: 15,
    marginRight: 15,
  },

  trendingTopics: {
    fontFamily: "SpaceMono-Bold",
    fontSize: 18,
    marginLeft: 15,
    marginTop: 10,
    flex: 1,
  },

  clear: {
    fontFamily: "SpaceMono-Regular",
    textAlign: "center",
    paddingRight: 7,
    paddingLeft: 7,
  },

  clearButtonStyle: {
    marginRight: 15,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 50,
  },
  dayStyle: {
    borderRadius: 8,
  },

  dayText: {
    padding: 7,
    fontFamily: "SpaceMono-Regular",
  },

  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
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
    marginTop: 34,
    flexDirection: "row",
    alignItems: "center",
  },

  searchContainer: {
    width: Platform.OS === "ios" ? "80%" : "100%",
    // width: "80%",
    borderWidth: 0,
  },

  inputContainer: {
    height: 41,
  },
});
