import "react-native-gesture-handler";
import React from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import { ScheduleTab } from "./tabs/ScheduleTab";
import { ScheduleSearch } from "./tabs/ScheduleSearch";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SearchIcon from "./assets/Search";
import HackGTIcon from "./assets/HackGTIcon";
import BackIcon from "./assets/Back";

import {
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";

// TODO: remove and replace with another tab. This is just a placeholder
function SettingsScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Placeholder for another future tab</Text>
    </View>
  );
}

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
          headerBackImage: () => <BackIcon />,
        }}
        name="ScheduleSearch"
        component={ScheduleSearch}
      />
    </SchdeuleStack.Navigator>
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

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Schedule" component={SchdeuleStackScreen} />
        <Tab.Screen name="Settings" component={SettingsStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
