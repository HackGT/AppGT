import React, { Component } from "react";
import { View, ScrollView } from "react-native";
import { styleguide } from "../styles";
import { InfoCard, StyledText } from "../components";
import { fetchInfoBlocks } from "../cms";
// Select info blocks from CMS to render
const CARD_KEYS = ["welcome", "app_links", "faq", "social_media"];

// TODO store a lot of this information in app resources so we have default
// TODO better loading state
class Home extends Component {

  static navigationOptions = {
    title: "Home",
    headerLeft: null
  };

  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      infoBlocks: {},
    };
    const infoBlocks = {};
    fetchInfoBlocks()
      .then(payload => {
        const infoArray = payload.data.infoblocks;
        infoArray.forEach( block => {
          if (CARD_KEYS.includes(block.slug))
            infoBlocks[block.slug] = block;
        });
        this.setState({ infoBlocks, fetching: false });
      });
  }

  render() {
    const { infoBlocks, fetching } = this.state;
    if (fetching) {
      return (
        <ScrollView>
          <StyledText> Surfing the interwebs </StyledText>
        </ScrollView>
      );
    }
    return (
      <ScrollView style={styleguide.wrapperView}>
        {CARD_KEYS.map((cardKey) => {
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
        })}
      </ScrollView>
    );
  }
}

export default Home;