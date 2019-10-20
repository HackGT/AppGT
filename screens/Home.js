import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faSync,
} from "@fortawesome/free-solid-svg-icons";

import { styleguide } from "../styles";
import { InfoCard, StyledText, Spacer } from "../components";

// Select info blocks from CMS to render
export const CARD_KEYS = ["welcome", "app_links", "faq", "social_media"];
import { colors } from "../themes";
import { CMSContext } from "../context";

class Home extends Component {

  static navigationOptions = {
    title: "Home",
    headerLeft: null
  };

  render() {
    return (
      <ScrollView style={styleguide.wrapperView}>
        <CMSContext.Consumer>
          {({ infoBlocks }) => {
            if (infoBlocks.length === 0) {
              return (
                <View style={styleguide.notfound}>
                  <StyledText style={{
                    textAlign: "center"
                  }}>Surfing the interwebs...</StyledText>
                  <FontAwesomeIcon
                    color={colors.darkGrayText}
                    icon={faSync} size={28}
                  />
                </View>
              );
            }
            return CARD_KEYS.map((cardKey) => {
              if (!(cardKey in infoBlocks)) return null;
              const block = infoBlocks[cardKey];
              return (
                <View key={cardKey}>
                  <View style={styleguide.titleView}>
                      <StyledText style={styleguide.title}>{block.title}</StyledText>
                  </View>
                  <InfoCard key={cardKey} content={block.body} />
                </View>
              );
            });
          }}
        </CMSContext.Consumer>
        <Spacer />
      </ScrollView>
    );
  }
}

export default Home;
