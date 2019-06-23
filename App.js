/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Workshops, Schedule, Home, Event } from './screens';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';
import { Text, View } from 'react-native';
import { Button } from 'react-native-elements';

// a StackNavgiator will give the ability to "push a screen"
// for instance, when a user clicks a event cell it will push a detailed view on the stack
const ScheduleStack = createStackNavigator({
  Schedule: Schedule,
  Event: Event 
})

const HomeStack = createStackNavigator({
  Home: Home 
})

const WorkshopStack = createStackNavigator({
  Workshops: Workshops
})

const TabNavigator = createBottomTabNavigator({
  Home: HomeStack,
  Schedule: ScheduleStack,
  Workshops: WorkshopStack
});

const AppContainer = createAppContainer(TabNavigator);

export default class App extends Component<Props> {

  render() {
    return (
      <AppContainer />
    )
  }
}
