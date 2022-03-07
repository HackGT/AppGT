import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { ThemeContext } from "../context";
import { Card } from "../components/Card";

export class EventSel extends Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => ((
            <View style={styles.card}>
                <Card >
                    <View style={styles.titleHeader}>
                        <Text
                        numberOfLines={this.props.truncateText ? 1 : null}
                        style={styles.flexWrap}
                        ellipsizeMode={"tail"}
                        style={[dynamicStyles.text, styles.titleFont]}
                        >
                        {this.props.name}
                        </Text>
                    </View>

                    <Text
                        numberOfLines={this.props.truncateText ? 1 : null}
                        style={styles.flexWrap}
                        ellipsizeMode={"tail"}
                        style={[dynamicStyles.secondaryText, styles.subtitleFont]}
                    >
                        {this.props.location}
                        {this.props.startTime} - {this.props.endTime}
                    </Text>

                </Card>
            </View>
            
        ))}
      </ThemeContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 10
    }, 
    titleHeader: {
        flexDirection: "row",
        width: "100%",
        letterSpacing: 0.005,
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

    tagFont: {
        marginTop: 2,
        fontFamily: "SpaceMono-Regular",
        letterSpacing: 0.005,
        marginTop: -0.2,
        marginLeft: 8,
    },

    wrappable: {
        flexWrap: "wrap",
    },
});