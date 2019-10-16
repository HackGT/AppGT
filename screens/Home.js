import React, { Component } from "react";
import { Text, View, ScrollView } from "react-native";

import { styleguide } from "../styles";
import { colors } from "../themes";
import { InfoCard } from "../components";
import { CMSContext } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faSync,
} from "@fortawesome/free-solid-svg-icons";

// TODO better loading state
export const CARD_KEYS = ["welcome", "app_links", "faq", "social_media"];
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
                  <Text style={{
                    textAlign: "center"
                  }}>Surfing the interwebs...</Text>
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
                      <Text style={styleguide.title}>{block.title}</Text>
                  </View>
                  <InfoCard key={cardKey} content={block.body} />
                </View>
              );
            });
          }}
        </CMSContext.Consumer>
      </ScrollView>
    );
  }
}

export default Home;