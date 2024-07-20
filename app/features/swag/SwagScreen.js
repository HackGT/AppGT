import React, { useContext } from "react";
import { ScrollView, Text, Pressable, View, StyleSheet } from "react-native";
import { createIconSetFromFontello } from "react-native-vector-icons";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ScanScreen } from "./ScanScreen";
import { getStartEndTime } from "../../util";

export function SwagScreen(props) {
  const selectedSwagItem = props.route.params.selectedSwagItem;
  const { dynamicStyles } = useContext(ThemeContext);

  return (
    <ScrollView style={dynamicStyles.backgroundColor}>
      <View style={styles.swagContainer}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            props.navigation.goBack();
          }}
        >
          <Text style={[styles.backButtontext, dynamicStyles.text]}>
            {"< Back"}
          </Text>
        </Pressable>

        <Text style={[styles.title, dynamicStyles.text]}>
          {selectedSwagItem.name}
        </Text>
        <Text
          numberOfLines={props.truncateText ? 1 : null}
          ellipsizeMode={"tail"}
          style={[
            dynamicStyles.secondaryText,
            {
              fontFamily: "SpaceMono-Bold",
              marginLeft: 0,
              textAlign: "center",
              fontSize: 14,
            },
          ]}
        >
          Cost: {selectedSwagItem.points} points
        </Text>
        <ScanScreen
          swagID={selectedSwagItem.id}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "flex-start",
  },

  backButtontext: {
    fontFamily: "SpaceMono-Bold",
    fontSize: 17,
    marginTop: 10,
  },

  header: {
    fontFamily: "SpaceMono-Bold",
    textAlign: "center",
    fontSize: 22,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    fontFamily: "SpaceMono-Bold",
    fontSize: 22,
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center",
  },

  swagContainer: {
    marginHorizontal: 15,
    flex: 1,
  },
  inputContainer: {
    height: 41,
  },
  searchContainer: {
    width: Platform.OS === "ios" ? "80%" : "100%",
    borderWidth: 0,
  },
});
