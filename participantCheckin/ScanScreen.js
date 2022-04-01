import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemeContext } from "../context";
import QRScan from "./QRScan"

export function ScanScreen(props) {
  return (
    <ThemeContext.Consumer>
      {({ dynamicStyles }) => ((
          <View style={styles.card}>
              <QRScan eventID={props.eventID} />
          </View>

      ))}
    </ThemeContext.Consumer>
  );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
    },

    titleFont: {
        fontSize: 16,
        width: "90%",
        fontWeight: "bold",
        fontFamily: "SpaceMono-Regular",
        letterSpacing: 0.005,
        marginRight: 10,
    },

    subtitleFont: {
        marginTop: 2,
        fontFamily: "SpaceMono-Regular",
        letterSpacing: 0.005,
    },

    wrappable: {
        flexWrap: "wrap",
    },
});
