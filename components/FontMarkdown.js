import { StyleSheet } from "react-native";
import React, { Component } from "react";
import Markdown from "react-native-markdown-renderer";
import { ThemeContext } from "../context";

export default class FontMarkdown extends Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => (
          <Markdown style={[dynamicStyles.text, this.markdownStyles]}>
            {this.props.children}
          </Markdown>
        )}
      </ThemeContext.Consumer>
    );
  }

  markdownStyles = StyleSheet.create({
    em: {
      fontStyle: "italic",
      fontFamily: `${this.props.fontFamily}-Italics`,
    },
    heading1: {
      fontSize: 32,
      fontFamily: `${this.props.fontFamily}-Regular`,
    },
    heading2: {
      fontSize: 24,
      fontFamily: `${this.props.fontFamily}-Regular`,
    },
    heading3: {
      fontSize: 18,
      fontFamily: `${this.props.fontFamily}-Regular`,
    },
    heading4: {
      fontSize: 16,
      fontFamily: `${this.props.fontFamily}-Regular`,
    },
    heading5: {
      fontSize: 13,
      fontFamily: `${this.props.fontFamily}-Regular`,
    },
    heading6: {
      fontSize: 11,
      fontFamily: `${this.props.fontFamily}-Regular`,
    },
    hr: {
      backgroundColor: "#000000",
      height: 1,
      fontFamily: `${this.props.fontFamily}-Regular`,
    },
    listItem: {
      flex: 1,
      flexWrap: "wrap",
      fontFamily: `${this.props.fontFamily}-Regular`,
    },
    listUnordered: {},

    listUnorderedItem: {
      flexDirection: "row",
      justifyContent: "flex-start",
      fontFamily: `${this.props.fontFamily}-Regular`,
    },
    listUnorderedItemText: {
      fontSize: 20,
      lineHeight: 20,
      fontFamily: `${this.props.fontFamily}-Regular`,
    },
    listOrderedItem: {
      flexDirection: "row",
      fontFamily: `${this.props.fontFamily}-Regular`,
    },
    listOrderedItemText: {
      lineHeight: 20,
      fontFamily: `${this.props.fontFamily}-Bold`,
    },
    paragraph: {
      marginTop: 10,
      marginBottom: 10,
      flexWrap: "wrap",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      fontFamily: `${this.props.fontFamily}-Regular`,
    },
    strong: {
      fontFamily: `${this.props.fontFamily}-Bold`,
    },
    text: {
      fontFamily: `${this.props.fontFamily}-Regular`,
    },
    strikethrough: {
      textDecorationLine: "line-through",
      fontFamily: `${this.props.fontFamily}-Regular`,
    },
    link: {
      textDecorationLine: "underline",
      fontFamily: `${this.props.fontFamily}-Regular`,
    },
    blocklink: {
      flex: 1,
      borderColor: "#000000",
      borderBottomWidth: 1,
      fontFamily: `${this.props.fontFamily}-Regular`,
    },
    u: {
      borderColor: "#000000",
      borderBottomWidth: 1,
      fontFamily: `${this.props.fontFamily}-Regular`,
    },
  });
}
