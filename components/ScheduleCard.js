import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
  TouchableOpacity
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlusCircle, faStar } from "@fortawesome/free-solid-svg-icons";
import { thisExpression } from "@babel/types";
import TagList from "./TagList";

import { colors } from "../themes";
import { styleguide } from "../styles";

export default ScheduleCard = ({ title, onClick, onPressStar, isStarred, tags }) => {
//   <View
//   style={{
//     position: "absolute",
//     alignSelf: "flex-end",
//     flex: 1,
//     padding: 8
//   }}
// />
  return (
    <TouchableHighlight
      style={styles.card}
      underlayColor="gray"
      onPress={onClick}
    >
      <View>
        <Text style={styleguide.title}>
          {title}
        </Text>
        <TouchableOpacity onPress={onPressStar}>
          <FontAwesomeIcon
            color={isStarred ? colors.primaryStar : colors.lightGrayText}
            icon={faStar} size={28}
          />
        </TouchableOpacity>
        <TagList tags={tags} />
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    paddingLeft: 10,
    paddingTop: 10
  },
  text: {
    padding: 10
  },
  card: {
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: "grey",
    borderRadius: 10,
    marginLeft: 25,
    marginRight: 25
  }
});
