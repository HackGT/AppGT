import React from "react";
import { View, StyleSheet } from "react-native";
import { StyledText } from "../";
import { styleguide } from "../../styles";

export default (Meal = ({ restaurantName, restaurantLink, menuItems }) => {
  console.log(menuItems);
  return (
    <View style={styles.content}>
      <StyledText style={{ ...styleguide.text }}>{restaurantName}</StyledText>
      <StyledText style={{ ...styleguide.text }}>{restaurantLink}</StyledText>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap"
        }}
      >
        {menuItems.map(item => (
          <StyledText style={{ ...styleguide.text }} key={item}>
            {item.name}
          </StyledText>
        ))}
      </View>
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
  }
});
