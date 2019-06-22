import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlusCircle, faStar } from '@fortawesome/free-solid-svg-icons'

export default class ScheduleCard extends Component<Props> {

  onClick() {
    // TODO: present card 
  }

  render() {
    let title = null;

    if (this.props.title) {
      title = <Text style={styles.title}>{this.props.title}</Text>
    }

    return (
      <TouchableHighlight style={styles.card} underlayColor="gray" onPress={this.onClick}>
        <View>

          <View style={{
            position: "absolute", alignSelf: "flex-end",
            flex: 1, padding: 8
          }}>
            {/* <FontAwesomeIcon color="#75BACF" size="20" icon={faStar} /> */}
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