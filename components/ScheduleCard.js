import React, { Component } from "react";
import { View, TouchableHighlight, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { StyledText, TagList } from "./";

import { colors } from "../themes";
import { styleguide } from "../styles";

export default (ScheduleCard = ({
  title,
  area,
  onClick,
  onPressStar,
  isStarred,
  tags,
  isOld
}) => {
  const areaBlock = area && (
    <StyledText
      style={{
        color: colors.lightGrayText,
        paddingLeft: 8,
        marginBottom: 4
      }}
    >
      {area}
    </StyledText>
  );
  let styleWrap = {
    ...styleguide.card,
    paddingHorizontal: 6,
    paddingVertical: 4,
    flex: 1
  };

  if (isOld) {
    styleWrap = { ...styleWrap, ...styleguide.noShadow };
  }
  return (
    <TouchableHighlight
      style={styleWrap}
      underlayColor="gray"
      onPress={onClick}
    >
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap"
          }}
        >
          <StyledText
            style={{
              marginBottom: 2,
              flex: 1,
              ...styleguide.title
            }}
          >
            {title}
          </StyledText>
          <TouchableOpacity
            style={{
              width: 40
            }}
            onPress={onPressStar}
          >
            {isStarred ? (
              <FontAwesomeIcon
                color={colors.primaryStar}
                icon={faStar}
                size={28}
              />
            ) : (
              <FontAwesomeIcon
                color={colors.lightGrayText}
                icon={faStarRegular}
                size={28}
              />
            )}
          </TouchableOpacity>
        </View>
        {areaBlock}
        <TagList tags={tags} />
      </View>
    </TouchableHighlight>
  );
});
