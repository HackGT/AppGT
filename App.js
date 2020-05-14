import "react-native-gesture-handler";
import React from "react";
import { fetchEvents, fetchInfoBlocks } from "./cms";
import { CMSContext } from "./context";
import { View, StyleSheet, Button, Text, StatusBar } from "react-native";
import { ScheduleTab } from "./tabs/ScheduleTab";
import { ScheduleSearch } from "./tabs/ScheduleSearch";
import { LoginOnboarding } from "./onboarding/LoginOnboarding";
import { EventOnboarding } from "./onboarding/EventOnboarding";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SearchIcon from "./assets/Search";
import HackGTIcon from "./assets/HackGTIcon";
import AsyncStorage from "@react-native-community/async-storage";

import { TouchableOpacity } from "react-native-gesture-handler";

// for details & examples on how to make gradients/SVGs https://github.com/react-native-community/react-native-svg

function HackGTitle() {
  return <HackGTIcon />;
}

const SchdeuleStack = createStackNavigator();
function SchdeuleStackScreen({ navigation }) {
  return (
    <SchdeuleStack.Navigator>
      <SchdeuleStack.Screen
        options={{
          headerTitleAlign: "left",
          headerTitle: (props) => <HackGTitle {...props} />,
          headerRight: () => (
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => navigation.navigate("ScheduleSearch")}
            >
              <SearchIcon />
            </TouchableOpacity>
          ),
        }}
        name="HackGT"
      >
        {(props) => <ScheduleTab {...props} />}
      </SchdeuleStack.Screen>

      <SchdeuleStack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerLeft: null,
        }}
        name="ScheduleSearch"
        component={ScheduleSearch}
      />
    </SchdeuleStack.Navigator>
  );
}

// for editing styles shown on tabs, see https://reactnavigation.org/docs/tab-based-navigation
const Tab = createBottomTabNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      infoBlocks: [],
    };
  }

  componentDidMount() {
    AsyncStorage.getItem("localEventData", (error, result) => {
      if (result) {
        console.log("Events found locally.");
        this.setState({ events: JSON.parse(result) });
      } else {
        fetchEvents().then((data) => {
          console.log("Fetched events from CMS.");
          const fetchedEvents = data.data.eventbases;

          this.setState({ events: fetchedEvents });

          const localEventData = JSON.stringify(fetchedEvents);
          AsyncStorage.setItem("localEventData", localEventData);
        });
      }
    });

    // AsyncStorage.getItem("localInfoBlocksData", (error, result) => {
    //   if (result) {
    //     console.log("InfoBlocks found locally.");
    //     this.setState({ events: JSON.parse(result) });
    //   } else {
    //     fetchInfoBlocks().then((data) => {
    //       console.log("Fetched infoblocks from CMS.");
    //       const fetchedInfoBlocks = data.data.infoBlocks;

    //       this.setState({ infoBlocks: fetchedInfoBlocks });

    //       const localInfoBlocks = JSON.stringify(fetchedInfoBlocks);
    //       AsyncStorage.setItem("localInfoBlocksData", localInfoBlocks);
    //     });
    //   }
    // });
  }

  render() {
    const events = this.state.events;
    const infoBlocks = this.state.infoBlocks;

    return (
      <CMSContext.Provider
        value={{
          events,
          infoBlocks,
        }}
      >
        <NavigationContainer>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
          <Tab.Navigator
            tabBarOptions={{ activeTintColor: "#41D1FF", tabBarVisible: false }}
          >
            <Tab.Screen name="Schedule" component={SchdeuleStackScreen} />
            <Tab.Screen name="LoginOnboard" component={LoginOnboarding} />
            <Tab.Screen name="EventOnboard" component={EventOnboarding} />
          </Tab.Navigator>
        </NavigationContainer>
      </CMSContext.Provider>
    );
  }
}
