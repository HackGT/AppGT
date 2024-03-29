import { StyleSheet, View, Text } from "react-native";
import React, { useState, useContext } from "react";
import { HackathonContext } from "../state/hackathon";
import { ThemeContext } from "../contexts/ThemeContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import { EVENT_TYPE_COLOR_MAP } from "../api/api";

export default function FilterSelect(props) {
  const { dynamicStyles } = useContext(ThemeContext);

  const [showMenu, setShowMenu] = useState(false);
  const [filterType, setFilterType] = useState(null);

  const hideFilterMenu = (item) => {
    let newFilter = item.name === "clear" ? null : item;
    setShowMenu(false);
    setFilterType(newFilter);

    props.onFilterMenuChange(false);

    if (props.onSelectFilter) {
      props.onSelectFilter(newFilter);
    }
  };

  if (showMenu) {
    return (
      <View style={styles.cancelContainer}>
        <View style={styles.exitContainer}>
          <TouchableOpacity
            style={[styles.exitStyle, dynamicStyles.searchBackgroundColor]}
            onPress={() => {
              setShowMenu(false);
              props.onFilterMenuChange(false);
            }}
          >
            <Text style={[styles.exitTextStyle, dynamicStyles.text]}> x </Text>
          </TouchableOpacity>
        </View>
        {Object.entries(EVENT_TYPE_COLOR_MAP).map(([name, color], index) => {
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
                onPress={hideFilterMenu.bind(this, { name, color })}
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
    if (filterType) {
      return (
        <View style={styles.exitContainer}>
          <TouchableOpacity
            style={[styles.tag, { backgroundColor: filterType.color }]}
            onPress={() => {
              setShowMenu(true);
              props.onFilterMenuChange(true);
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.filterText}> {filterType.name} </Text>
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
            style={[styles.filterStyle, dynamicStyles.searchBackgroundColor]}
            onPress={() => {
              setShowMenu(true);
              props.onFilterMenuChange(true);
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
