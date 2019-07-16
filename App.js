import React, { Component } from 'react';
import Workshops from "./screens/Workshops";
import Home from './screens/Home';
import Schedule from "./screens/Schedule";
import Event from './screens/Event';
import Login from './screens/Login';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faList, faBell, faKey, faQuestion } from '@fortawesome/free-solid-svg-icons';

// a StackNavgiator will give the ability to "push a screen"
// for instance, when a user clicks a event cell it will push a detailed view on the stack
const ScheduleStack = createStackNavigator({
  Schedule,
  Event
})

const HomeStack = createStackNavigator({
  Home
})

const WorkshopStack = createStackNavigator({
  Workshops
})

const LoginStack = createStackNavigator({
  Login 
})

const TabNavigator = createBottomTabNavigator({
  Home: HomeStack,
  Schedule: ScheduleStack,
  Notifications: WorkshopStack,
  Login: LoginStack
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
          case "Login":
            icon = faKey;
            break;
          default:
            icon = faQuestion;
        }

        return <FontAwesomeIcon color={tintColor} icon={icon} />
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