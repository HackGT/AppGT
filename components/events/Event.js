import React from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { StyledText } from "../";
import TagList from "../TagList";
import Meal from "./Meal";
import Talk from "./Talk";
import { styleguide } from "../../styles";
import { colors } from "../../themes";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

// TODO meals (later) - diet restrictions
// TODO talks - @Meha
// TODO (later) exit animation is no bueno
export default Event = ({
  closeModal,
  eventInfo
}) => {
  const {
    startTime,
    endTime,
    area,
    title,
    description,
    tags,
    type,
    restaurantName,
    restaurantLink,
    menuItems,
    people
  } = eventInfo;
  const exitButton = (
    <TouchableOpacity
      style={{
        width: 30,
        margin: 8
      }}
      onPress={closeModal}
    >
      <FontAwesomeIcon
        color={colors.red}
        icon={faTimesCircle}
        size={28}
      />
    </TouchableOpacity>
  );
  let timeString = startTime.format("ddd hh:mm");
  if (!!endTime) {
    timeString += ` - ${endTime.format("hh:mm")}`
  }

  return (
    <View style={styles.content}>
      <View style={styles.headerRow}>
        <StyledText style={{
          ...styleguide.title,
          flex: 1
        }}>{title}</StyledText>
        {exitButton}
      </View>
      <ScrollView style={{
        paddingHorizontal: 8
      }}>
        { // time and area block
          <View style={styles.timeAndArea}>
            <StyledText style={styleguide.text}>
              {timeString}
            </StyledText>
            <StyledText style={styleguide.text}>
              {area}
            </StyledText>
          </View>
        }
        <StyledText style={ styleguide.text }>{description || "No description provided. It's all in the title."}</StyledText>
        {type === "meal" && (
          <Meal
            restaurantName={restaurantName}
            restaurantLink={restaurantLink}
            menuItems={menuItems}
          />
        )}
        {type === "talk" && <Talk people={people} />}
      </ScrollView>
      <View style={styles.tagArea}>
        <TagList tags={tags} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: colors.darkGrayText,
    borderBottomWidth: 2,
    paddingBottom: 12,
    marginBottom: 8
  },
  tagArea: {
    borderTopColor: colors.darkGrayText,
    borderTopWidth: 2,
    paddingTop: 12,
    marginTop: 8
  },
  content: {
    backgroundColor: "white",
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 18,
    borderRadius: 8,
    borderColor: "rgba(0, 0, 0, 0.1)",
    maxHeight: 600
  },
  timeAndArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap"
  }
});
