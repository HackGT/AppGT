import "react-native-gesture-handler";
import React from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { ScheduleTab } from "./tabs/ScheduleTab";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { fetchEvents, fetchInfoBlocks } from "./cms";
import { CMSContext } from "./context";

// TODO: remove and replace with another tab. This is just a placeholder
function SettingsScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Placeholder for another future tab</Text>
    </View>
  );
}

function HackGTitle() {
  return <Text>HackGT</Text>;
}

const ScheduleStack = createStackNavigator();
function ScheduleStackScreen() {
  return (
    <ScheduleStack.Navigator>
      <ScheduleStack.Screen
        options={{
          headerTitleAlign: "left",
          headerTitle: (props) => <HackGTitle {...props} />,
          headerRight: () => (
            <Button onPress={() => alert("Search")} title="🔎" />
          ),
        }}
        name="HackGT"
      >
        {(props) => <ScheduleTab {...props} />}
      </ScheduleStack.Screen>
    </ScheduleStack.Navigator>
  );
}

const SettingsStack = createStackNavigator();
function SettingsStackScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="SettingDetail" component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
}

// for editing styles shown on tabs, see https://reactnavigation.org/docs/tab-based-navigation
const Tab = createBottomTabNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { events: [], infoBlocks: [] };

    fetchEvents().then((data) => {
      this.setState({ events: data.data.eventbases });
    });

    fetchInfoBlocks().then((data) => {
      this.setState({ infoBlocks: data.data.infoBlocks });
    });
  }

  render() {
    const events = this.state.events;
    const infoBlocks = this.state.infoBlocks;

    console.log(events);
    return (
      <CMSContext.Provider
        value={{
          events,
          infoBlocks,
        }}
      >
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Schedule" component={ScheduleStackScreen} />
            <Tab.Screen name="Settings" component={SettingsStackScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </CMSContext.Provider>
    );
  }
}
