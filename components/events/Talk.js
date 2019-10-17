import React from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { StyledText } from "../";
import { styleguide } from "../../styles";

export default (Talk = ({ people }) => {
  console.log(people);
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap"
      }}
    >
      {people.map(person => (
        <StyledText style={{ ...styleguide.text }} key={person}>
          {person}
        </StyledText>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  content: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12
  }
});
