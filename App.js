/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { Workshops, Schedule } from './screens';
import { createStackNavigator, createAppContainer} from 'react-navigation';

const MainNavigator = createStackNavigator({
    Home: {screen: Schedule},
    Workshops: {screen: Workshops},
});

const AppContainer = createAppContainer(MainNavigator);

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <AppContainer />
    );
  }
}
