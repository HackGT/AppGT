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
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faList, faBell } from '@fortawesome/free-solid-svg-icons';

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
  Notifications: WorkshopStack
}, {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;

        if (routeName === 'Home') {
          icon = faHome
        } else if (routeName === 'Schedule') {
          icon = faList
        } else if (routeName === 'Notifications') {
          icon = faBell 
        }

        return <FontAwesomeIcon color={tintColor} icon={icon}></FontAwesomeIcon>
    }

    })
  });

const AppContainer = createAppContainer(TabNavigator);

export default class App extends Component<Props> {

  render() {
    return (
      <AppContainer />
    )
  }
}
