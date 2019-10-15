import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native";

import { colors } from "../themes";

export default TagList = ({ tags }) => tags ? (
  <View style={{
    flexDirection: "row"
  }}>
    {
      tags.map((tag) => (
        <Text style={styles.tag} key={tag}>#{tag}</Text>
      ))
    }
  </View>
) : null;

const styles = StyleSheet.create({
  list: {
    paddingBottom: 0,
    marginBottom: 0,
    height: 40
  },
  tag: {
    backgroundColor: colors.lightGrayBackgroundBehindTagText,
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginLeft: 10,
    marginBottom: 10,
    textDecorationLine: "underline"
  }
});
