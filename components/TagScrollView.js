import React, { Component } from "react";
import { ThemeContext } from "../context";
import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default class TagScrollView extends Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <View style={styles.container}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {this.props.tags.map((value, i) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.onPress && this.props.onPress(value)
                    }
                    disabled={!this.props.onPress}
                    style={[
                      styles.tagStyle,
                      this.props.highlightedTags &&
                      this.props.highlightedTags.includes(value)
                        ? dynamicStyles.tintBackgroundColor
                        : dynamicStyles.searchBackgroundColor,
                    ]}
                  >
                    <Text
                      style={[
                        styles.textStyle,
                        this.props.highlightedTags &&
                        this.props.highlightedTags.includes(value)
                          ? { color: "white" }
                          : dynamicStyles.text,
                      ]}
                    >
                      {" "}
                      {value}{" "}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </ThemeContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginLeft: -10,
  },

  textStyle: {
    padding: 7,
    fontFamily: "SpaceMono-Regular",
  },

  tagStyle: {
    borderRadius: 50,
    marginTop: 10,
    marginLeft: 10,
  },
});
