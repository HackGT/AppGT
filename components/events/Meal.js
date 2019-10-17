import React from "react";
import { View, StyleSheet, Linking } from "react-native";
import { StyledText } from "../";
import { styleguide } from "../../styles";

export default (Meal = ({ restaurantName, restaurantLink, menuItems }) => {
  return (
    <View style={styles.content}>
      <View style={styles.restaurantNames}>
        <StyledText style={styles.restaurantNameTitle}>
          Restaurant Name:
        </StyledText>
        {makeHyperlinks(restaurantName, restaurantLink)}
      </View>
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

const makeHyperlinks = (restaurantName, restaurantLink) => {
  console.log("in makeHyperlinks");
  restaurantNameArr = restaurantName.split(", ");
  restaurantLinkArr = restaurantLink.split(", ");
  return restaurantNameArr.map((name, index) => {
    if (index === restaurantNameArr.length - 1) {
      if (index < restaurantLinkArr.length) {
        return (
          <StyledText
            style={styles.link}
            onPress={() => Linking.openURL(restaurantLinkArr[index])}
          >
            {name}
          </StyledText>
        );
      } else {
        return <StyledText style={styles.text}>{name}</StyledText>;
      }
    } else if (index < restaurantLinkArr.length) {
      return (
        <StyledText
          style={styles.link}
          onPress={() => Linking.openURL(restaurantLinkArr[index])}
        >
          {name},
        </StyledText>
      );
    } else {
      return <StyledText style={styles.text}>{name}, </StyledText>;
    }
  });
  return restaurantName;
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  link: {
    fontSize: 15,
    marginBottom: 12,
    marginLeft: 5,
    color: "blue"
  },
  text: {
    fontSize: 15,
    marginLeft: 5,
    marginBottom: 12
  },
  restaurantNames: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  restaurantNameTitle: {
    fontSize: 15,
    fontWeight: "bold"
  }
});
