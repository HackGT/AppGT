import React, { Component } from "react";
import {
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import TagList from "./TagList";

import { colors } from "../themes";
import { styleguide } from "../styles";

// TODO enable onClick
// TODO make sure long names render properly

export default ScheduleCard = ({ title, area, onClick, onPressStar, isStarred, tags, isOld }) => {
//      {/*onClick  noop */}
  const areaBlock = area && (<Text style={{
      color: colors.lightGrayText,
      paddingLeft: 8,
    }} >
      {area}
    </Text>);
  let styleWrap = {
    ...styleguide.card,
    paddingHorizontal: 6,
    paddingVertical: 4,
  };
  if (isOld) { //
    styleWrap = {...styleWrap, ...styleguide.noShadow }
  }
  return (
    <TouchableHighlight
      style={styleWrap}
      underlayColor="gray"
      onPress={() => {}}
    >
      <View>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap"
        }}>
          <View style={{
            flex: 60,
            marginBottom: 4,
          }}>
            <Text style={{
              marginBottom: 4,
              ...styleguide.title
            }}>
              {title}
            </Text>
            { areaBlock }
          </View>
          <TouchableOpacity
            style={{
              flex: 20
            }}
            onPress={onPressStar}
          >
            {
              isStarred ? (
                <FontAwesomeIcon
                  color={colors.primaryStar}
                  icon={faStar} size={28}
                />) : (
                <FontAwesomeIcon
                  color={colors.lightGrayText}
                  icon={faStarRegular} size={28}
                />
              )
            }
          </TouchableOpacity>
        </View>
        <TagList tags={tags} />
      </View>
    </TouchableHighlight>
  );
}