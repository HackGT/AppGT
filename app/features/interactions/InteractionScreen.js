import React, { useContext } from 'react';
import { ScrollView, Text, Pressable, View, StyleSheet } from 'react-native';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { ThemeContext } from "../../contexts/ThemeContext";
import { ScanScreen } from "./ScanScreen";
import { getStartEndTime } from "../../util"

export function InteractionScreen(props) {
  const selectedEvent = props.route.params.selectedEvent;
  const { dynamicStyles } = useContext(ThemeContext);
  console.log('selevent: ', selectedEvent)
  const { startTime, endTime } = getStartEndTime(selectedEvent.startDate, selectedEvent.endDate)
  return (
      <ScrollView style={dynamicStyles.backgroundColor}>
        <View style={styles.eventContainer}>
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
            {selectedEvent.name}
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
            {selectedEvent != null &&
            selectedEvent.location != null &&
            selectedEvent.location[0] != null &&
            selectedEvent.location[0].name != null
              ? selectedEvent.location[0].name + " • "
              : ""}
            {startTime + " - " + endTime}
          </Text>
          <ScanScreen
            eventID={selectedEvent.id}
            startTime={selectedEvent.startTime}
            endTime={selectedEvent.endTime}
            location={
              selectedEvent != null &&
              selectedEvent.location != null &&
              selectedEvent.location[0] != null &&
              selectedEvent.location[0].name != null
                ? selectedEvent.location[0].name + " • "
                : ""
            }
            type={
              selectedEvent != null && selectedEvent.type != null
                ? selectedEvent.type
                : { name: "none", color: "gray" }
            }
            description={selectedEvent.description}
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

  eventContainer: {
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
