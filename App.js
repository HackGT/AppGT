import React, { Component } from 'react';
import {Text, Alert} from "react-native";
import { Notifications, Event, Home, Schedule } from './screens';
import { NotificationsComp } from './components';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faList, faBell } from '@fortawesome/free-solid-svg-icons';
import firebase from 'react-native-firebase';
import type { Notification } from 'react-native-firebase';
import BackgroundFetch from "react-native-background-fetch";

// a StackNavgiator will give the ability to "push a screen"
// for instance, when a user clicks a event cell it will push a detailed view on the stack
const ScheduleStack = createStackNavigator({
  Schedule,
  Event
})

const HomeStack = createStackNavigator({
  Home
})

const NotificationsStack = createStackNavigator({
  Notifications
})

const TabNavigator = createBottomTabNavigator({
  Home: HomeStack,
  Schedule: ScheduleStack,
  Notifications: NotificationsStack
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
  constructor(props) {
    super(props);
    Notif = new NotificationsComp;
  }

  componentDidMount() {
    Notif.runNotifications();
  }

  componentWillUnmount() {
    Notif.listener();
  }
  render() {
    return (
        <AppContainer>Hi</AppContainer>
    )
  }
}
