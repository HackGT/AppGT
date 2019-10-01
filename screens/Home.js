import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import getAllData from "../getCMS";

class Home extends Component<Props> {
  static navigationOptions = {
    title: "Home",
    headerLeft: null
  };

  state = {
    allData: null
  };

  render() {
    const headerProps = [
      { header: "Contact Information" },
      { header: "Important! Links" },
      { header: "Social Media" }
    ];

    const contactProps = [
      [
        { title: "HackGT Staff: ", tag: "678-870-4225" },
        { title: "Campus Police: ", tag: "404-894-2500" }
      ],
      [
        { title: "Slack: ", tag: "hellohackgt.slack.come" },
        { title: "Live Site: ", tag: "info.hack.gt" },
        { title: "Devpost: ", tag: "hackgt.devpost.com" }
      ],
      [
        { title: "Facebook: ", tag: "TheHackGT" },
        { title: "Instagram: ", tag: "@thehackgt" },
        { title: "Twitter: ", tag: "@thehackgt" },
        { title: "Github: ", tag: "@hackgt" }
      ]
    ];
    return (
      <View>
        {headerProps.map((props, i) => (
          <View key={i}>
            <View style={styles.titleView}>
              <Text>{props.header}</Text>
            </View>
            <View style={styles.card}>
              {contactProps.map((desProps, k) => (
                <Text key={k}>
                  <Text style={styles.title}>{desProps[k].title}</Text>
                  <Text>{desProps[k].tag}</Text>
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold"
  },
  card: {
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: "grey",
    borderRadius: 10,
    padding: 25,
    marginLeft: 25,
    marginRight: 25
  },
  titleView: {
    marginLeft: 25,
    marginTop: 25
  }
});

export default Home;
