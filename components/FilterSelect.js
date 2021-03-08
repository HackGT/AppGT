import { StyleSheet, View, Text } from "react-native";
import React, { Component } from "react";
import { ThemeContext, HackathonContext } from "../context";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class FilterSelect extends Component {
  constructor() {
    super();
    this.state = {
      showMenu: false,
      filterType: null,
    };
  }

  render() {
    hideFilterMenu = (item) => {
      let newFilter = item.name === "clear" ? null : item;

      this.setState({
        showMenu: false,
        filterType: newFilter,
      });

      this.props.onFilterMenuChange(false);

      if (this.props.onSelectFilter) {
        this.props.onSelectFilter(newFilter);
      }
    };

    return (
      <HackathonContext.Consumer>
        {({ eventTypes }) => (
          <ThemeContext.Consumer>
            {({ dynamicStyles }) => {
              const filterList = [...eventTypes];
              // filterList.push({ name: "clear", color: "#C3C3C3" });

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
                          this.props.onFilterMenuChange(false);
                        }}
                      >
                        <Text
                          style={[styles.exitTextStyle, dynamicStyles.text]}
                        >
                          {" "}
                          x{" "}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {filterList.map(function (item, index) {
                      const name = item.name ?? "unknown";
                      const color = item.color ?? "white";

                      return (
                        <View
                          style={{
                            flexDirection: "row",
                            marginTop: 55,
                            top: index * 40,
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
                            onPress={hideFilterMenu.bind(this, item)}
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
                          { backgroundColor: this.state.filterType.color },
                        ]}
                        onPress={() => {
                          this.setState({
                            showMenu: true,
                          });
                          this.props.onFilterMenuChange(true);
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text style={styles.filterText}>
                            {" "}
                            {this.state.filterType.name}{" "}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              hideFilterMenu({ name: "clear" });
                            }}
                          >
                            <Text style={[dynamicStyles.filterText]}>x</Text>
                          </TouchableOpacity>
                        </View>
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
                          this.props.onFilterMenuChange(true);
                        }}
                      >
                        <Text
                          style={[styles.filterTextStyle, dynamicStyles.text]}
                        >
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
        )}
      </HackathonContext.Consumer>
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
