import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import { DefaultScreen } from './';

export default class Home extends Component<Props> {
  static navigationOptions = {
    title: 'Home',
    headerLeft: null
  };
  render() {
    return (
      <DefaultScreen navigation={this.props.navigation}>
        <View style={styles.titleView}>
          <Text>Contact Information</Text>
        </View>
        <View style={styles.card}>
          <Text>
            <Text style={styles.title}>HackGT Staff: </Text> <Text>678-870-4225</Text>
          </Text>
          <Text>
            <Text style={styles.title}>Campus Police: </Text> <Text>404-894-2500</Text>
          </Text>
        </View>

        <View style={styles.titleView}>
          <Text>Important! Links</Text>
        </View>
        <View style={styles.card}>
          <Text>
            <Text style={styles.title}>Slack: </Text> <Text>hellohackgt.slack.com</Text>
          </Text>
          <Text>
            <Text style={styles.title}>Live Site: </Text> <Text>info.hack.gt</Text>
          </Text>
          <Text>
            <Text style={styles.title}>Devpost: </Text> <Text>hackgt.devpost.com</Text>
          </Text>
        </View>

        <View style={styles.titleView}>
          <Text>Social Media</Text>
        </View>
        <View style={styles.card}>
          <Text>
            <Text style={styles.title}>Facebook: </Text> <Text>TheHackGT</Text>
          </Text>
          <Text>
            <Text style={styles.title}>Instagram: </Text> <Text>@thehackgt</Text>
          </Text>
          <Text>
            <Text style={styles.title}>Twitter: </Text> <Text>@thehackgt</Text>
          </Text>
          <Text>
            <Text style={styles.title}>GitHub: </Text> <Text>@hackgt</Text>
          </Text>
        </View>
      </DefaultScreen>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: 'grey',
    borderRadius: 10,
    padding: 25,
    marginLeft: 25,
    marginRight: 25,
  },
  titleView: {
    marginLeft: 25,
    marginTop: 25,
  }
});
