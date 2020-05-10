import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import Logo from "../assets/Logo";
export class ContentInfo extends Component {
  render() {
    return (
      <View style={styles.root} flexDirection="column">
        <Logo />
        <Text style={styles.textTitle}>{this.props.title}</Text>
        <Text style={styles.textSubtitle}>{this.props.subtitle}</Text>
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
    top: 32,
    fontSize: 24,
    marginLeft: 20,
    marginRight: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#3F3F3F",
  },

  textSubtitle: {
    top: 44,
    color: "#3F3F3F",
    marginLeft: 20,
    marginRight: 20,
    fontSize: 18,
    textAlign: "center",
  },
});
