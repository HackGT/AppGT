import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import moment from "moment";
import Svg, { Circle } from "react-native-svg";
import StarOff from "../assets/StarOff";
import StarOn from "../assets/StarOn";
import { CMSContext } from "../context";

export class ScheduleEventCellVerticle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isStarred: false,
    };
  }

  createCardStyle = () => {
    const style = {
      padding: 17,
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "space-evenly",
      backgroundColor: "white",
      height: 100,
      borderColor: this.props.highlighted ? "#41D1FF" : "white",
      borderWidth: 1.2,
      borderRadius: 12,
      elevation: 1, // android shadow
      shadowColor: "black",
      shadowOffset: { width: 0.5, height: 0.5 },
      shadowOpacity: 0.1,
      shadowRadius: 1.5,
    };

    return style;
  };

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
    // to be put into a class enum
    const colors = ["#2CDACF", "#C866F5", "#786CEB", "#FF586C", "#FF8D28"];
    const radius = 6;
    const size = radius * 2;
    const categoryColor = colors[Math.floor(Math.random() * colors.length)];

    return (
      <View flexDirection="row" style={styles.footer}>
        <Svg height={size} width={size} style={styles.footerTopic}>
          <Circle cx={radius} cy={radius} r={radius} fill={categoryColor} />
        </Svg>
        <Text
          style={{
            marginLeft: 7,
            color: categoryColor,
          }}
        >
          food
        </Text>
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
    const isStarred = event.isStarred;

    return (
      <CMSContext.Consumer>
        {({ toggleStar }) => {
          return (
            <View style={styles.cardParent}>
              <View style={this.createCardStyle()}>
                <View style={styles.titleHeader}>
                  <Text style={styles.titleFont}>{title}</Text>
                  <TouchableOpacity onPress={() => toggleStar(event)}>
                    {isStarred ? <StarOn /> : <StarOff />}
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
        }}
      </CMSContext.Consumer>
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
    color: "#4F4F4F",
  },

  subtitleFont: {
    marginTop: 2,
    color: "#4F4F4F",
  },

  footer: {
    top: 6,
  },

  footerTopic: {
    top: 2.5,
  },

  footerTags: {
    marginLeft: 7,
    top: -5,
  },
});
