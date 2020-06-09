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

  state = {
    showFilterMenu: false,
    exitFilter: false,
    showFilterButton: true,
  }

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
          <TouchableOpacity
            onPress={() => {
              this.setState({ showFilterMenu: true }),
                this.setState({ exitFilter: true }),
                this.setState({ showFilterButton: false });
            }}
            style={styles.filterContainer}
          >
            {this.state.showFilterButton && (
              <View style={styles.filterStyle}>
                <Text style={styles.filterTextStyle}> Filter </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.setState({ showFilterMenu: false }),
                this.setState({ exitFilter: false }),
                this.setState({ showFilterButton: true });
            }}
            style={styles.exitContainer}
          >
            {this.state.exitFilter && (
              <View style={styles.exitStyle}>
                <Text style={styles.exitTextStyle}> x </Text>
              </View>
            )}
          </TouchableOpacity>

          {this.state.showFilterMenu && (
            <View
              style={{
                flexDirection: 'row',
                top: 60,
                left: 10,
                position: 'absolute',
                zIndex: 1,
              }}
            >
              <TouchableOpacity
                style={{ backgroundColor: '#2CDACF', borderRadius: 50 }}
              >
                <Text
                  style={{
                    padding: 7,
                    color: 'white',
                    fontFamily: 'Space Mono',
                  }}
                >
                  {' '}
                  important{' '}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {this.state.showFilterMenu && (
            <View
              style={{
                flexDirection: 'row',
                top: 105,
                left: 10,
                position: 'absolute',
                zIndex: 1,
              }}
            >
              <TouchableOpacity
                style={{ backgroundColor: '#C866F5', borderRadius: 50 }}
              >
                <Text
                  style={{
                    padding: 7,
                    color: 'white',
                    fontFamily: 'Space Mono',
                  }}
                >
                  {' '}
                  food{' '}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {this.state.showFilterMenu && (
            <View
              style={{
                flexDirection: 'row',
                top: 150,
                left: 10,
                position: 'absolute',
                zIndex: 1,
              }}
            >
              <TouchableOpacity
                style={{ backgroundColor: '#FF586C', borderRadius: 50 }}
              >
                <Text
                  style={{
                    padding: 7,
                    color: 'white',
                    fontFamily: 'Space Mono',
                  }}
                >
                  {' '}
                  speaker{' '}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {this.state.showFilterMenu && (
            <View
              style={{
                flexDirection: 'row',
                top: 195,
                left: 10,
                position: 'absolute',
                zIndex: 1,
              }}
            >
              <TouchableOpacity
                style={{ backgroundColor: '#FF8D28', borderRadius: 50 }}
              >
                <Text
                  style={{
                    padding: 7,
                    color: 'white',
                    fontFamily: 'Space Mono',
                  }}
                >
                  {' '}
                  mini-event{' '}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {this.state.showFilterMenu && (
            <View
              style={{
                flexDirection: 'row',
                top: 240,
                left: 10,
                position: 'absolute',
                zIndex: 1,
              }}
            >
              <TouchableOpacity
                style={{ backgroundColor: '#786CEB', borderRadius: 50 }}
              >
                <Text
                  style={{
                    padding: 7,
                    color: 'white',
                    fontFamily: 'Space Mono',
                  }}
                >
                  {' '}
                  workshop{' '}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {this.state.showFilterMenu && (
            <View
              style={{
                flexDirection: 'row',
                top: 285,
                left: 10,
                position: 'absolute',
                zIndex: 1,
              }}
            >
              <TouchableOpacity
                style={{ backgroundColor: '#C3C3C3', borderRadius: 50 }}
              >
                <Text
                  style={{
                    padding: 7,
                    color: 'white',
                    fontFamily: 'Space Mono',
                  }}
                >
                  {' '}
                  clear{' '}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Trending Topics */}
          <Text
            style={{
              fontFamily: 'Space Mono',
              fontWeight: 'bold',
              fontSize: 18,
              marginLeft: 15,
              marginTop: 15,
            }}
          >
            Trending Topics
          </Text>
          
          {/*Tags */}
          <View style={styles.container}>
            {['#boba', '#ML', '#facebook', '#coffee'].map((value, i) => {
              return (
                <TouchableOpacity style={styles.tagStyle}>
                  <Text style={styles.textStyle}> {value} </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.container}>
            {['#facebook', '#boba', '#coffee', '#ML'].map((value, i) => {
              return (
                <TouchableOpacity style={styles.tagStyle}>
                  <Text style={styles.textStyle}> {value} </Text>
                </TouchableOpacity>
              );
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
    backgroundColor: 'white',
  },

  exitContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },

  exitStyle: {
    backgroundColor: '#F2F2F2',
    borderRadius: 50,
    padding: 7,
  },

  exitTextStyle: {
    fontSize: 16,
  },

  filterContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginLeft: 10,
  },

  filterStyle: {
    backgroundColor: '#F2F2F2',
    borderRadius: 50,
  },

  filterTextStyle: {
    padding: 7,
    fontFamily: 'Space Mono',
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },

  textStyle: {
    padding: 7,
    fontFamily: 'Space Mono',
  },

  tagStyle: {
    backgroundColor: '#F2F2F2',
    borderRadius: 50,
  },

  background: {
    backgroundColor: 'white',
  },

  cancelButton: {
    padding: 10,
  },

  filterButton: {
    height: 22,
    width: 63,
    left: 10,
    backgroundColor: '#C866F5',
    borderRadius: 10,
  },

  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchContainer: {
    backgroundColor: 'white',
    width: '80%',
    borderWidth: 0,
    borderTopColor: 'white',
    borderBottomColor: 'white',
  },

  inputContainer: {
    backgroundColor: '#F2F2F2',
    height: 41,
  },
});
