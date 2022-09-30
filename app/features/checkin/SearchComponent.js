import React, { useState, useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { SearchBar } from "react-native-elements";
import { View, StyleSheet } from "react-native";
import SearchIcon from "../../assets/images/Search";

export function SearchComponent(props) {
  const { dynamicStyles } = useContext(ThemeContext);
  const [searchText, setSearchText] = useState("");

  const searchEvents = (value) => {
    setSearchText(value);
  };

  return (
    <View style={styles.searchHeader}>
      <SearchBar
        searchIcon={
          <SearchIcon
            fill={dynamicStyles.secondaryBackgroundColor.backgroundColor}
          />
        }
        containerStyle={[
          styles.searchContainer,
          dynamicStyles.backgroundColor,
          dynamicStyles.searchBorderTopColor,
          dynamicStyles.searchBorderBottomColor,
        ]}
        inputContainerStyle={[
          styles.inputContainer,
          dynamicStyles.searchBackgroundColor,
        ]}
        clearIcon={null}
        lightTheme
        round
        placeholder="Search..."
        onChangeText={(value) => searchEvents(value)}
        value={searchText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontFamily: "SpaceMono-Bold",
    textAlign: "center",
    fontSize: 22,
    marginTop: 34,
    marginBottom: 10,
    backgroundColor: "#ADD8E6",
  },
  searchHeader: {
    marginTop: 34,
    flexDirection: "row",
    alignItems: "center",
  },

  searchContainer: {
    width: Platform.OS === "ios" ? "80%" : "100%",
    borderWidth: 0,
  },

  inputContainer: {
    height: 41,
  },
});
