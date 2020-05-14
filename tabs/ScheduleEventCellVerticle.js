import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";
import moment from "moment";
import Svg, { Circle } from "react-native-svg";
import StarOff from "../assets/StarOff";
import { TouchableOpacity } from "react-native-gesture-handler";

export class ScheduleEventCellVerticle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isStarred: false,
    };
  }

  parseDate = (date) => {
    // parse iso-formatted string as local time
    if (!date) return "";
    let localString = date;
    if (date.slice(-1).toLowerCase() === "z") {
      localString = date.slice(0, -1);
    }
    return moment(localString);
  };

  topicLabel = () => {
    const radius = 6;
    const size = radius * 2;

    return (
      <View flexDirection="row" style={styles.footer}>
        <Svg height={size} width={size} style={styles.footerTopic}>
          <Circle cx={radius} cy={radius} r={radius} fill={"#C866F5"} />
        </Svg>
        <Text style={styles.footerTopicText}>food</Text>
        <View flexDirection="row" style={styles.footerTags}>
          {["#tag1", "#tag2", "#tag3"].map((tag) => {
            return <Text style={{ color: "#C3C3C3", margin: 5 }}>{tag}</Text>;
          })}
        </View>
      </View>
    );
  };

  render() {
    const event = this.props.event;

    const title = event.title;
    const location = event.area != null ? event.area.name + " • " : "";
    const start = this.parseDate(event.start_time).format("hh:mm A");
    const end = this.parseDate(event.end_time).format("hh:mm A");

    return (
      <View style={styles.cardParent}>
        <View style={styles.cardItem}>
          <View style={styles.titleHeader}>
            <Text style={styles.titleFont}>{title}</Text>
            <TouchableOpacity onPress={() => alert("star")}>
              <StarOff />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitleFont}>
            {location}
            {start} - {end}
          </Text>
          {this.topicLabel()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardParent: {
    width: "100%",
    borderRadius: 8,
  },

  titleHeader: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  titleFont: {
    fontSize: 16,
    fontWeight: "bold",
  },

  subtitleFont: {
    marginTop: 2,
  },

  footer: {
    top: 6,
  },

  footerTopic: {
    top: 2.5,
  },

  footerTopicText: {
    marginLeft: 7,
    color: "#C866F5",
  },
  footerTags: {
    marginLeft: 7,
    top: -5,
  },

  cardItem: {
    padding: 17,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    backgroundColor: "white",
    height: 100,
    borderColor: "#41D1FF",
    borderWidth: 1.2,
    borderRadius: 8,
    elevation: 1, // android shadow
    shadowColor: "black",
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});
