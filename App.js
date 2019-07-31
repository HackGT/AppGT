import React, { Component } from 'react';
import {Text, Alert} from "react-native";

import { Notifications, Event, Home, Schedule } from './screens'
import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faList, faBell } from '@fortawesome/free-solid-svg-icons';
import firebase from 'react-native-firebase';
import type { Notification } from 'react-native-firebase';

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
    super(props)
    firebase.messaging().subscribeToTopic("all");
    console.log("Subscribed to topic");
  }

  events = {"event 2": {
              "id": 0,
              "name": "event 2",
              "date": new Date().getDate(),
              "time start": new Date().getTime(),
              "time end": new Date().getTime() + 1000
            },
            "event 4": {
              "id": 1,
              "name": "event 4",
              "date": new Date().getDate(),
              "time start": new Date().getTime() + 1000,
              "time end": new Date().getTime() + 2000
            },
            "event 5": {
              "id": 2,
              "name": "event 5",
              "date": new Date().getDate(),
              "time start": new Date().getTime() + 2000,
              "time end": new Date().getTime() + 3000
            }
          };

  async checkPermissions() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      console.log("Permissions Enabled");
    } else {
      console.log("Asking for permissions");
      this.askPermissions();
    }
  }

  async askPermissions() {
    try {
      await firebase.messaging().requestPermission();
      console.log("Permissions enabled");
    } catch (error) {
      console.log("User rejected permissions");
    }
  }

  componentDidMount() {
    this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
        // Process your notification as required
        const { title, body } = notification
        console.log(this.events.some((event) => {
          notification.data.tags.includes(event);
        }));

        if (this.events.keys().some((event) => {
          if (!notification.data.tags) {
            return false;
          }
          if (notification.data.tags.includes(event)) {
            return true;
          }
        })) {
          this.showAlert(title, body);
        }
    });
  }

  componentWillUnmount() {
    this.notificationListener();
  }

  showAlert(title, body) {
    Alert.alert(
      title, body
    );
  }

  render() {
    return (
      <AppContainer>Hi</AppContainer>
    )
  }
}
