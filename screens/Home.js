import React, {Component} from 'react';
import {Text} from 'react-native';
import { DefaultScreen } from './';

export default class Home extends Component<Props> {
  static navigationOptions = {
    title: 'Home',
    headerLeft: null
  };
  render() {
    return (
      <DefaultScreen navigation={this.props.navigation}>
        <Text>Home Page</Text>
      </DefaultScreen>
    )
  }
}
