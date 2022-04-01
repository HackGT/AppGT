import React from "react";
import { ThemeContext } from "../context";
import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function TagScrollView(props) {
  return (
    <ThemeContext.Consumer>
      {({ dynamicStyles }) => (
        <View style={styles.container}>
          <ScrollView
            scrollEnabled={props.scroll}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {props.tags.map((value, i) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    props.onPress && props.onPress(value)
                  }
                  disabled={props.disabled}
                  style={[
                    styles.tagStyle,
                    props.highlightedTags &&
                    props.highlightedTags.includes(value)
                      ? dynamicStyles.tintBackgroundColor
                      : dynamicStyles.searchBackgroundColor,
                  ]}
                >
                  <Text
                    style={[
                      styles.textStyle,
                      props.highlightedTags &&
                      props.highlightedTags.includes(value)
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
