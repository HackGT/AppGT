import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlusCircle, faStar } from '@fortawesome/free-solid-svg-icons'
import { thisExpression } from '@babel/types';
import Tag from './Tag';
import TagList from './TagList';

export default class ScheduleCard extends Component<Props> {

  onClick = () => {
    this.props.onClick(this.props.item);
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
          </View>

          {title}
          <Text style={styles.text}>{this.props.children}</Text>
		  <TagList tagList={this.props.tags} />
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
