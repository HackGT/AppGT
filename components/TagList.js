import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Text } from "react-native";

export default (TagList = ({ tagList }) => {
  tags = [];
  if (tagList != null) {
    for (let i = 0; i < tagList.length; i++) {
      tags.push(<Text style={styles.tag}>{tagList[i].name}</Text>);
    }
  }
  return <View style={{ flexDirection: "row" }}>{tags}</View>;
});

const styles = StyleSheet.create({
  list: {
    paddingBottom: 0,
    marginBottom: 0,
    height: 40
  },
  tag: {
    backgroundColor: "#E0E0E0",
    borderRadius: 18,
    padding: 10,
    marginLeft: 10,
    marginBottom: 10
  }
});
