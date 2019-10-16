import React, { Component } from "react";
import {
  View,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { StyledText, TagList } from "./";

import { colors } from "../themes";
import { styleguide } from "../styles";

// TODO enable onClick
// TODO make sure long names render properly

export default ScheduleCard = ({ title, area, onClick, onPressStar, isStarred, tags, isOld }) => {
//      {/*onClick  noop */}
  const areaBlock = area && (<StyledText style={{
      color: colors.lightGrayText,
      paddingLeft: 8,
    }} >
      {area}
    </StyledText>);
  let styleWrap = {
    ...styleguide.card,
    paddingHorizontal: 6,
    paddingVertical: 4,
    flex: 1,
  };

  if (isOld) {
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
            flex: 1,
            marginBottom: 4,
          }}>
            <StyledText style={{
              marginBottom: 4,
              ...styleguide.title
            }}>
              {title}
            </StyledText>
            { areaBlock }
          </View>
          <TouchableOpacity
            style={{
              width: 40
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