import { StyleSheet } from "react-native";
import React from "react";
import Markdown from "react-native-markdown-renderer";
import { ThemeContext } from "../contexts/ThemeContext";

export default function FontMarkdown(props) {
  const createStyles = (dynamicStyles) => {
    return StyleSheet.create({
      em: {
        fontStyle: "italic",
        color: dynamicStyles.text.color,
        fontFamily: `${props.fontFamily}-Italic`,
      },
      heading1: {
        fontSize: 32,
        color: dynamicStyles.text.color,
        fontFamily: `${props.fontFamily}-Regular`,
      },
      heading2: {
        fontSize: 24,
        color: dynamicStyles.text.color,
        fontFamily: `${props.fontFamily}-Regular`,
      },
      heading3: {
        fontSize: 18,
        color: dynamicStyles.text.color,
        fontFamily: `${props.fontFamily}-Regular`,
      },
      heading4: {
        fontSize: 16,
        color: dynamicStyles.text.color,
        fontFamily: `${props.fontFamily}-Regular`,
      },
      heading5: {
        fontSize: 13,
        color: dynamicStyles.text.color,
        fontFamily: `${props.fontFamily}-Regular`,
      },
      heading6: {
        fontSize: 11,
        color: dynamicStyles.text.color,
        fontFamily: `${props.fontFamily}-Regular`,
      },
      hr: {
        backgroundColor: "#000000",
        height: 1,
        color: dynamicStyles.text.color,
        fontFamily: `${props.fontFamily}-Regular`,
      },
      listItem: {
        flex: 1,
        flexWrap: "wrap",
        color: dynamicStyles.text.color,
        fontFamily: `${props.fontFamily}-Regular`,
      },
      listUnordered: {},

      listUnorderedItem: {
        flexDirection: "row",
        justifyContent: "flex-start",
        color: dynamicStyles.text.color,
        fontFamily: `${props.fontFamily}-Regular`,
      },
      listUnorderedItemText: {
        fontSize: 20,
        lineHeight: 20,
        color: dynamicStyles.text.color,
        fontFamily: `${props.fontFamily}-Regular`,
      },
      listOrderedItem: {
        flexDirection: "row",
        color: dynamicStyles.text.color,
        fontFamily: `${props.fontFamily}-Regular`,
      },
      listOrderedItemText: {
        lineHeight: 20,
        color: dynamicStyles.text.color,
        fontFamily: `${props.fontFamily}-Bold`,
      },
      paragraph: {
        marginTop: 10,
        marginBottom: 10,
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        color: dynamicStyles.text.color,
        fontFamily: `${props.fontFamily}-Regular`,
      },
      strong: {
        color: dynamicStyles.text.color,
        fontFamily: `${props.fontFamily}-Bold`,
      },
      text: {
        color: dynamicStyles.text.color,
        fontFamily: `${props.fontFamily}-Regular`,
      },
      strikethrough: {
        color: dynamicStyles.text.color,
        textDecorationLine: "line-through",
        fontFamily: `${props.fontFamily}-Regular`,
      },
      link: {
        color: dynamicStyles.text.color,
        textDecorationLine: "underline",
        fontFamily: `${props.fontFamily}-Regular`,
      },
      blocklink: {
        flex: 1,
        color: dynamicStyles.text.color,
        borderColor: "#000000",
        borderBottomWidth: 1,
        fontFamily: `${props.fontFamily}-Regular`,
      },
      u: {
        color: dynamicStyles.text.color,
        borderColor: "#000000",
        borderBottomWidth: 1,
        fontFamily: `${props.fontFamily}-Regular`,
      },
    });
  };

  return (
    <ThemeContext.Consumer>
      {({ dynamicStyles }) => (
        <Markdown style={createStyles(dynamicStyles)}>
          {props.children}
        </Markdown>
      )}
    </ThemeContext.Consumer>
  );
}
