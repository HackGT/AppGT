import React, { Component } from "react";
import { Text, View } from "react-native";

import { styleguide } from "../styles";
import { InfoCard } from "../components";
import { fetchInfoBlocks } from "../cms";
// Select info blocks from CMS to render
const CARD_KEYS = ["welcome", "app_links", "faq", "social_media", "loading"];

// TODO store a lot of this information in app resources so we have default
class Home extends Component {

  static navigationOptions = {
    title: "Home",
    headerLeft: null
  };

  constructor(props) {
    super(props);
    this.state = {
      infoBlocks: {
        loading: {
          title: "Welcome to HackGT 6!",
          body: "Scanning the interwebs",
        }
      },
    };
  }

  // componentDidMount() {
  //   // query cms
  //   const infoBlocks = {};
  //   console.log("hello\n\n")
  //   fetchInfoBlocks()
  //     .then(payload => {
  //       // console.log(payload)
  //       const infoArray = payload.data.infoblocks;
  //       // console.log(infoArray);
  //       infoArray.forEach( block => {
  //         if (block.slug in CARD_KEYS)
  //           infoBlocks[block.slug] = block;
  //       });
  //       this.setState({ infoBlocks });
  //     });
  // }

  render() {
    const { infoBlocks } = this.state;
    console.log("this is running");
    return (
      <View>
        <Text>Hello</Text>
      </View>
    );
    //     {CARD_KEYS.map((cardKey) => {
    //       if (!(cardKey in infoBlocks)) return null;
    //       console.log("we're past it all")
    //       const block = infoBlocks[cardKey];
    //       return (
    //         <View key={cardKey}>
    //           <View style={styleguide.titleView}>
    //               <Text>{block.title}</Text>
    //           </View>
    //           <InfoCard key={cardKey} content={block.body} />
    //         </View>
    //       );
    //     })}
    //   </View>
    // );
  }
}

export default Home;