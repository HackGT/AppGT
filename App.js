import React, { Component } from 'react';
import {Text} from "react-native";

import Home from './screens/Home';
import Schedule from "./screens/Schedule";
import Event from './screens/Event';
// import {
//   createBottomTabNavigator,
//   createStackNavigator,
//   createAppContainer,
// } from 'react-navigation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faList, faBell } from '@fortawesome/free-solid-svg-icons';

// a StackNavgiator will give the ability to "push a screen"
// for instance, when a user clicks a event cell it will push a detailed view on the stack
// const ScheduleStack = createStackNavigator({
//   Schedule,
//   Event
// })

// const HomeStack = createStackNavigator({
//   Home
// })

// const WorkshopStack = createStackNavigator({
//   Workshops
// })

// const TabNavigator = createBottomTabNavigator({
//   Home: HomeStack,
//   Schedule: ScheduleStack,
//   Notifications: WorkshopStack
// }, {
//     defaultNavigationOptions: ({ navigation }) => ({
//       tabBarIcon: ({ focused, horizontal, tintColor }) => {
//         const { routeName } = navigation.state;

//         switch(routeName) {
//           case "Home":
//             icon = faHome
//             break;
//           case "Schedule":
//             icon = faList
//             break;
//           case "Notifications":
//             icon = faBell 
//             break;
//           default:
//             icon = null;
//         }

//         return <FontAwesomeIcon color={tintColor} icon={icon} />
//     }

//     })
//   });

// const AppContainer = createAppContainer(TabNavigator);

export default class App extends Component<Props> {

  render() {
    return (
      <Home>Hi</Home>
    )
  }
}