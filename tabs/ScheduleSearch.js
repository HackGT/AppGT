import React, { Component } from "react";

import { SearchBar } from "react-native-elements";
import { Text, View, StyleSheet, StatusBar } from "react-native";
import SearchIcon from "../assets/Search";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { Card, CardItem, List } from "native-base";
import BackIcon from "../assets/Back";

export class ScheduleSearch extends Component {
  render() {
    const { navigation } = this.props;

    return (
      <SafeAreaView style={styles.background}>
        <View style={styles.searchHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BackIcon />
          </TouchableOpacity>

          <SearchBar
            searchIcon={SearchIcon}
            containerStyle={styles.searchContainer}
            inputContainerStyle={styles.inputContainer}
            lightTheme
            round
            placeholder="Search..."
          />
        </View>
        <View style={styles.background}>
          <ScrollView>
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
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "white",
  },

  backButton: {
    padding: 10,
  },

  searchHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  searchContainer: {
    backgroundColor: "white",
    width: "90%",
    right: 10,
    borderWidth: 0,
    borderTopColor: "white",
    borderBottomColor: "white",
  },

  inputContainer: {
    backgroundColor: "#F2F2F2",
    height: 41,
  },
});
