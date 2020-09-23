import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React, { Component } from "react";
import { ThemeContext } from "../context";
import { colors } from "../cms/DataHandler";

export default class FilterSelect extends Component {
  constructor() {
    super();
    this.state = {
      showMenu: false,
      filterType: null,
    };
  }

  render() {
    hideFilterMenu = (name) => {
      newFilter = name === "clear" ? null : name;

      this.setState({
        showMenu: false,
        filterType: newFilter,
      });

      if (this.props.onSelectFilter) {
        this.props.onSelectFilter(newFilter);
      }
    };

    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => {
          if (this.state.showMenu) {
            return (
              <View style={styles.cancelContainer}>
                <View style={styles.exitContainer}>
                  <TouchableOpacity
                    style={[
                      styles.exitStyle,
                      dynamicStyles.searchBackgroundColor,
                    ]}
                    onPress={() => {
                      this.setState({ showMenu: false });
                    }}
                  >
                    <Text style={[styles.exitTextStyle, dynamicStyles.text]}>
                      {" "}
                      x{" "}
                    </Text>
                  </TouchableOpacity>
                </View>
                {Object.keys(colors).map(function (name, index) {
                  const color = colors[name];
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        marginTop: 55,
                        top: index * 45,
                        left: 10,
                        position: "absolute",
                        zIndex: 1,
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                      }}
                    >
                      <TouchableOpacity
                        onPress={hideFilterMenu.bind(this, name)}
                        style={{
                          backgroundColor: color,
                          borderRadius: 50,
                        }}
                      >
                        <Text
                          style={{
                            padding: 7,
                            color: "white",
                            fontFamily: "SpaceMono-Regular",
                          }}
                        >
                          {" "}
                          {name}{" "}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            );
          } else {
            if (this.state.filterType) {
              return (
                <View style={styles.exitContainer}>
                  <TouchableOpacity
                    style={[
                      styles.tag,
                      { backgroundColor: colors[this.state.filterType] },
                    ]}
                    onPress={() => {
                      this.setState({
                        showMenu: true,
                      });
                    }}
                  >
                    <Text style={styles.filterText}>
                      {" "}
                      {this.state.filterType}{" "}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            } else {
              return (
                <View style={styles.filterContainer}>
                  <TouchableOpacity
                    style={[
                      styles.filterStyle,
                      dynamicStyles.searchBackgroundColor,
                    ]}
                    onPress={() => {
                      this.setState({
                        showMenu: true,
                      });
                    }}
                  >
                    <Text style={[styles.filterTextStyle, dynamicStyles.text]}>
                      {" "}
                      Filter{" "}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }
          }
        }}
      </ThemeContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  tag: {
    borderRadius: 50,
    padding: 7,
  },

  exitContainer: {
    flexDirection: "row",
    marginLeft: 10,
    marginTop: 15,
  },

  filterText: {
    fontSize: 14,
    color: "white",
    fontFamily: "SpaceMono-Regular",
  },

  exitStyle: {
    borderRadius: 50,
    padding: 7,
  },

  exitTextStyle: {
    fontSize: 16,
  },

  cancelContainer: {
    flexDirection: "row",
    zIndex: 10,
  },

  filterContainer: {
    flexDirection: "row",
    marginTop: 15,
    marginLeft: 10,
  },

  filterStyle: {
    borderRadius: 50,
  },

  filterTextStyle: {
    padding: 7,
    fontFamily: "SpaceMono-Regular",
  },
});
