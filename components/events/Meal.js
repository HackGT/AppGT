import React from "react";
import { View, StyleSheet, Linking } from "react-native";
import { StyledText } from "../";
import { styleguide } from "../../styles";
import { colors } from "../../themes";

export default (Meal = ({ restaurantName, restaurantLink, menuItems }) => {
  return (
    <View style={styles.content}>
      <StyledText style={styles.restaurantNameTitle}>Restaurant:</StyledText>
      <View style={styles.restaurantNames}>
        {makeHyperlinks(restaurantName, restaurantLink)}
      </View>
      <View>
        {menuItems.map(item => (
          <StyledText style={{ ...styleguide.text }} key={item.name}>
            - {item.name}
          </StyledText>
        ))}
      </View>
    </View>
  );
});

const makeHyperlinks = (restaurantName, restaurantLink) => {
  restaurantNameArr = restaurantName.split(",").map(s => s.trim());
  restaurantLinkArr = restaurantLink.split(",").map(s => s.trim());
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
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: "white",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  link: {
    fontSize: 15,
    marginBottom: 12,
    marginRight: 5,
    color: colors.primaryBlue
  },
  text: {
    fontSize: 15,
    marginRight: 5,
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
