import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import Logo from "../assets/Logo";

export class ContentInfo extends Component {
  render() {
    return (
      <View style={styles.root} flexDirection="column">
        {this.props.image ? this.props.image : <Logo />}
        <Text style={styles.textTitle}>{this.props.title}</Text>
        {this.props.subtitles.map((subtitle) => (
          <Text style={styles.textSubtitle}>{subtitle}</Text>
        ))}
        {this.props.button ? this.props.button : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    alignContent: "center",
  },

  titleImage: {
    backgroundColor: "tomato",
    width: 200,
    height: 200,
  },

  textTitle: {
    marginTop: 32,
    fontSize: 24,
    marginLeft: 20,
    marginRight: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "black",
  },

  textSubtitle: {
    marginTop: 12,
    color: "black",
    marginLeft: 20,
    marginRight: 20,
    fontSize: 18,
    textAlign: "center",
  },
});
