import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight, Switch } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlusCircle, faStar } from '@fortawesome/free-solid-svg-icons'
import { thisExpression } from '@babel/types';
import OneSignal from 'react-native-onesignal';

export default class ScheduleCard extends Component<Props> {

  state = {
    switchValue: false,
  }

  onClick = () => {
    this.props.onClick(this.props.item);
  }

  onSwitchToggle = () => {

  }

  render() {
    let title = this.props.title ? <Text style={styles.title}>{this.props.title}</Text> : null;

    return (
      <TouchableHighlight style={styles.card} underlayColor="gray" onPress={this.props.onClick}>
        <View>

          <View style={{
            position: "absolute", alignSelf: "flex-end",
            flex: 1, padding: 8
          }}>
            <Text>Subscribe to Event?</Text>
            <Switch
            value={this.state.switchValue}
            onValueChange ={(switchValue)=> {
              this.setState({switchValue});
              if (switchValue) OneSignal.sendTag(this.props.title + "eventid", "subscribed");
              else OneSignal.deleteTag(this.props.title + "eventid");
              OneSignal.getTags((receivedTags) => {
                  console.log(receivedTags);
              });
              console.log(switchValue);
            }}/>

          </View>

          {title}
          <Text style={styles.text}>{this.props.children}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    paddingLeft: 10,
    paddingTop: 10
  },
  text: {
    padding: 10
  },
  card: {
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: 'grey',
    borderRadius: 10,
    marginLeft: 25,
    marginRight: 25,
  }
});
