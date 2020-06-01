import React, { Component } from "react";

import { SearchBar } from "react-native-elements";
import { Text, View, StyleSheet, StatusBar } from "react-native";
import SearchIcon from "../assets/Search";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { Card, CardItem, List, Button } from "native-base";
import CancelIcon from "../assets/Cancel";
import { authorize } from "react-native-app-auth";
import { getCurrentDayIndex } from "../cms/DataHandler";

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
          
          {/* Filter Button */}
          <View style={styles.filterContainer}>
            <View style={styles.filterStyle}>
              <Text style={styles.filterTextStyle}> Filter </Text>
            </View>
          </View>
         
          {/* Trending Topics */}
          <Text style={{ fontFamily: 'Space Mono', fontWeight: 'bold', fontSize: 18, marginLeft: 15, marginTop: 10}}>
            Trending Topics
          </Text>
         
          {/*Tags */}
          <View style={styles.container}>
          {["#boba", "#ML", "#facebook", "#coffee"].map((value, i) => {
            return <View style={styles.tagStyle}>
              <Text style={styles.textStyle}> {value} </Text>
            </View>;
          })}
          </View>

          <View style={styles.container}>
            {["#facebook", "#boba", "#coffee", "#ML"].map((value, i) => {
              return <View style={styles.tagStyle}>
                <Text style={styles.textStyle}> {value} </Text>
              </View>;
            })}
          </View>

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

  filterContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 15,
  },

  filterStyle: {
    backgroundColor: '#F9F9F9',
    borderRadius: 50,
  },

  filterTextStyle: {
    padding: 5,
    color: "#C3C3C3",
    fontFamily: "Space Mono",
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },

  textStyle: {
    padding: 10,
  },

  tagStyle: {
    backgroundColor: '#F2F2F2',
    borderRadius: 50,
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
