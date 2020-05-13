import React, { Component } from "react";

import { SearchBar } from "react-native-elements";
import { Text, View, StyleSheet, StatusBar } from "react-native";
import SearchIcon from "../assets/Search";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { Card, CardItem, List } from "native-base";
import CancelIcon from "../assets/Cancel";

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

  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.searchHeader}>
          <SearchBar
            searchIcon={SearchIcon}
            containerStyle={styles.searchContainer}
            inputContainerStyle={styles.inputContainer}
            lightTheme
            round
            placeholder="Search..."
          />

          {this.backButton()}
        </View>
        <View style={styles.background}>
          {/* {this.filterButton()} */}

          <ScrollView>
            {/* <Text style={{ fontSize: 24, left: 10 }}>Trending Topics</Text> */}
            {this.searchList()}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
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
    backgroundColor: "white",
    width: "80%",
    borderWidth: 0,
    borderTopColor: "white",
    borderBottomColor: "white",
  },

  inputContainer: {
    backgroundColor: "#F2F2F2",
    height: 41,
  },
});
