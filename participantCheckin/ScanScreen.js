import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { ThemeContext } from "../context";
import { Card } from "../components/Card";

export class ScanScreen extends Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {({ dynamicStyles }) => ((
            <View style={styles.card}>
                <Card >
                    <Text
                        numberOfLines={this.props.truncateText ? 1 : null}
                        style={styles.flexWrap}
                        ellipsizeMode={"tail"}
                        style={[dynamicStyles.secondaryText, styles.subtitleFont]}
                    >
                        {this.props.location}
                        {this.props.startTime} - {this.props.endTime}
                    </Text>
                    <Text>
                        {this.props.description}
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