import React from "react";
import { View, StyleSheet, Linking, Text } from "react-native";
import { StyledText } from "../";
import { styleguide } from "../../styles";
import { colors } from "../../themes";

export default (Meal = ({
  restaurantName,
  restaurantLink,
  menuItems,
  dietRestrictionsArr
}) => {
  return (
    <View style={styles.content}>
      <StyledText style={styles.restaurantNameTitle}>Restaurant:</StyledText>
      <View style={styles.restaurantNames}>
        {makeHyperlinks(restaurantName, restaurantLink)}
      </View>
      <View>
        {menuItems.map((item, index) => {
          return (
            <View style={styles.menuContent}>
              <StyledText key={item.name}>- {item.name}</StyledText>
              <View style={styles.restrictionsView}>
                {makeRestrictions(dietRestrictionsArr[index])}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
});

const makeRestrictions = dietRestrictionsArr => {
  return dietRestrictionsArr.map((item, index) => {
    if (index === 0) {
      if (dietRestrictionsArr.length > 1) {
        return (
          <StyledText style={styles.dietRestrictions} key={item.name}>
            > {item.name},{" "}
          </StyledText>
        );
      } else {
        return (
          <StyledText style={styles.dietRestrictions} key={item.name}>
            > {item.name}
          </StyledText>
        );
      }
    } else if (index === dietRestrictionsArr.length - 1) {
      return (
        <StyledText style={styles.dietRestrictions} key={item.name}>
          {item.name}
        </StyledText>
      );
    } else {
      return (
        <StyledText style={styles.dietRestrictions} key={item.name}>
          {item.name},{" "}
        </StyledText>
      );
    }
  });
};

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
            key={name}
          >
            {name}
          </StyledText>
        );
      } else {
        return (
          <StyledText style={styles.text} key={name}>
            {name}
          </StyledText>
        );
      }
    } else if (index < restaurantLinkArr.length) {
      return (
        <StyledText
          style={styles.link}
          onPress={() => Linking.openURL(restaurantLinkArr[index])}
          key={name}
        >
          {name},
        </StyledText>
      );
    } else {
      return (
        <StyledText style={styles.text} key={name}>
          {name},{" "}
        </StyledText>
      );
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
    marginBottom: 12
  },
  restaurantNames: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  restaurantNameTitle: {
    fontSize: 15,
    fontWeight: "bold"
  },
  restrictionsView: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 20
  },
  dietRestrictions: {
    marginTop: 5
  },
  menuContent: {
    marginLeft: 20,
    marginBottom: 5
  }
});
