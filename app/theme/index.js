import { StyleSheet, useColorScheme } from "react-native";

const makeStyles = (dark) =>
  StyleSheet.create({
    backgroundColor: {
      backgroundColor: dark ? "#0F0F0F" : "white",
    },
    secondaryBackgroundColor: {
      backgroundColor: dark ? "#35383D" : "#F2F2F2",
    },

    text: {
      color: dark ? "white" : "#3F3F3F",
    },

    italicText: {
      color: dark ? "white" : "#3F3F3F",
      fontStyle: "italic",
    },

    toggleText: {
      color: dark ? "white" : "black",
    },

    trackBarBackground: {
      color: dark ? "#4a5568" : "#d3d3d3",
    },

    toggleThumbBackgroundColor: {
      color: dark ? "black" : "white",
    },

    filterText: {
      color: dark ? "#0F0F0F" : "white",
      fontSize: 15,
      paddingRight: 5,
    },

    borderColor: {
      borderColor: dark ? "white" : "#3F3F3F",
    },

    secondaryText: {
      color: dark ? "#C2C2C2" : "#4F4F4F",
    },

    tintColor: {
      color: dark ? "#2C8DDB" : "#41D1FF",
    },
    tintBackgroundColor: {
      backgroundColor: dark ? "#2C8DDB" : "#41D1FF",
    },

    secondaryTintColor: {
      color: "#2C8DDB",
    },
    secondaryTintBackgroundColor: {
      backgroundColor: dark ? "#2C8DDB" : "#41D1FF",
    },

    primaryButtonBackground: {
      backgroundColor: dark ? "#35383D" : "#666666",
    },

    tritaryBackgroundColor: {
      backgroundColor: dark ? "#1A1919" : "white",
    },

    tabBarBackgroundColor: {
      backgroundColor: dark ? "#171717" : "white",
      shadowColor: dark ? "#666666" : "#D3D3D3",
      borderTopColor: dark ? "#666666" : "#D3D3D3",
    },

    searchBorderTopColor: {
      borderTopColor: dark ? "#0F0F0F" : "white",
    },

    searchBorderBottomColor: {
      borderBottomColor: dark ? "#0F0F0F" : "white",
    },

    searchBackgroundColor: {
      backgroundColor: dark ? "#1A1919" : "#F2F2F2",
    },

    searchDividerColor: {
      borderBottomColor: dark ? "#35383D" : "#C3C3C3",
    },
  });

export const lightStyles = makeStyles(false);
export const darkStyles = makeStyles(true);

export function useTheme() {
  return useColorScheme() === "dark" ? darkStyles : lightStyles;
}
