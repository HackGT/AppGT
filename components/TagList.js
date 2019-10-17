import React from "react";
import { StyleSheet, View } from "react-native";
import { StyledText } from "./";

import { colors } from "../themes";

export default (TagList = ({ tags }) =>
  tags ? (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap"
      }}
    >
      {tags.map(tag => (
        <StyledText style={styles.tag} key={tag}>
          #{tag}
        </StyledText>
      ))}
    </View>
  ) : null);

const styles = StyleSheet.create({
  tag: {
    backgroundColor: colors.lightGrayBackgroundBehindTagText,
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginRight: 10,
    textDecorationLine: "underline"
  }
});
