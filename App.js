import React, { Component } from 'react';
import {Text} from "react-native";
import OneSignal from 'react-native-onesignal'; // Import package from node modules

import Notifications from "./screens/Notifications";
import Home from './screens/Home';
import Schedule from "./screens/Schedule";
import Event from './screens/Event';
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
  Schedule,
  Event
})

const HomeStack = createStackNavigator({
  Home
})

const NotificationStack = createStackNavigator({
  Notifications
})

const TabNavigator = createBottomTabNavigator({
  Home: HomeStack,
  Schedule: ScheduleStack,
  Notifications: NotificationStack
}, {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;

        switch(routeName) {
          case "Home":
            icon = faHome
            break;
          case "Schedule":
            icon = faList
            break;
          case "Notifications":
            icon = faBell
            break;
          default:
            icon = null;
        }

        return <FontAwesomeIcon color={tintColor} icon={icon} />
    }

    })
  });

const AppContainer = createAppContainer(TabNavigator);

export default class App extends Component<Props> {

  constructor(properties) {
      super(properties);
      //TODO: replace with env
      OneSignal.init("d4d45469-e177-4ab7-92f2-42f619fd39b0");

      OneSignal.addEventListener('received', this.onReceived);
      OneSignal.addEventListener('opened', this.onOpened);
      OneSignal.addEventListener('ids', this.onIds);

      // Setting enableVibrate
      OneSignal.enableVibrate(true);

      OneSignal.enableSound(true);
    }

    componentWillUnmount() {
      OneSignal.removeEventListener('received', this.onReceived);
      OneSignal.removeEventListener('opened', this.onOpened);
      OneSignal.removeEventListener('ids', this.onIds);
    }

    onReceived(notification) {
      console.log("Notification received: ", notification);
    }

    onOpened(openResult) {
      console.log('Message: ', openResult.notification.payload.body);
      console.log('Data: ', openResult.notification.payload.additionalData);
      console.log('isActive: ', openResult.notification.isAppInFocus);
      console.log('openResult: ', openResult);
    }

    onIds(device) {
      console.log('Device info: ', device);
    }

  render() {
    return (
      <AppContainer>Hi</AppContainer>
    )
  }
}
