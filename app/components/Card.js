import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemeContext } from "../state/context";

export function Card(props) {
  const createCardStyle = (dynamicStyles) => {
    const style = {
      padding: 17,
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "space-evenly",
      height: props.height,
      borderWidth: 1.3,
      borderRadius: 12,
      borderColor: props.highlighted
        ? dynamicStyles.tintColor.color
        : dynamicStyles.tritaryBackgroundColor.backgroundColor,
      elevation: 1, // android shadow
      shadowColor: "black",
      shadowOffset: { width: 0.5, height: 0.5 },
      shadowOpacity: 0.1,
      shadowRadius: 1.5,
    };

    return style;
  };

  return (
    <ThemeContext.Consumer>
      {({ dynamicStyles }) => (
        <View style={styles.cardParent}>
          <View
            style={[
              dynamicStyles.tritaryBackgroundColor,
              createCardStyle(dynamicStyles),
            ]}
          >
            {props.children}
          </View>
        </View>
      )}
    </ThemeContext.Consumer>
  );
}

const styles = StyleSheet.create({
  cardParent: {
    width: "100%",
    borderRadius: 8,
  },
});
