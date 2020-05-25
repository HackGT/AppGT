import "react-native-gesture-handler";
import React from "react";
import { fetchEvents, fetchInfoBlocks } from "./cms";
import { CMSContext, AuthContext } from "./context";
import { StatusBar } from "react-native";
import { ScheduleTab } from "./schedule/ScheduleTab";
import { ScheduleSearch } from "./schedule/ScheduleSearch";
import { LoginOnboarding } from "./onboarding/LoginOnboarding";
import { EventOnboarding } from "./onboarding/EventOnboarding";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SearchIcon from "./assets/Search";
import HackGTIcon from "./assets/HackGTIcon";
import AsyncStorage from "@react-native-community/async-storage";

import { TouchableOpacity } from "react-native-gesture-handler";
import { authorize } from "react-native-app-auth";
import { sortEventsByStartTime } from "./cms/DataHandler";

// for details & examples on how to make gradients/SVGs https://github.com/react-native-community/react-native-svg

const authUrl = "https://login.hack.gt";

const config = {
  clientId: "7d1c11b30351e91d6517492c19a9a0185a6e4e6304f9826f96a76895534cf26f",
  redirectUrl: "gt.hack.live://redirect",
  clientSecret: "hackgt",
  serviceConfiguration: {
    authorizationEndpoint: `${authUrl}/oauth/authorize`,
    tokenEndpoint: `${authUrl}/oauth/token`,
  },
};

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
      user: null,
      accessToken: null,
    };
  }

  toggleStarred = (event) => {
    const newEventsWithStar = this.state.events.slice();
    const index = newEventsWithStar.indexOf(event);
    const newEvent = newEventsWithStar[index];

    if (index != -1) {
      const newValue = newEvent.isStarred ? !newEvent.isStarred : true;
      newEventsWithStar[index].isStarred = newValue;
      this.setState({ events: newEventsWithStar });
      AsyncStorage.setItem("localEventData", JSON.stringify(newEventsWithStar));
      return newValue;
    }
    return null;
  };

  logout = async () => {
    fetch(`${authUrl}/api/user/logout`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.state.accessToken,
      },
    }).then((response) => {
      AsyncStorage.removeItem("accessToken");
      AsyncStorage.removeItem("userData");
      this.setState({ accessToken: "", user: null });
    });
  };

  login = async () => {
    try {
      const result = await authorize(config);
      this.setState({ accessToken: result.accessToken });
      this.fetchUserDetails(result.accessToken);
      AsyncStorage.setItem("accessToken", accessToken);
    } catch (error) {
      console.log(error);
    }
  };

  fetchUserDetails = async (accessToken) => {
    fetch(`${authUrl}/api/user`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((userData) => {
        const name = userData.nameParts;
        const user = {
          email: userData.email,
          name: userData.name,
          firstName: name.first,
          preferredName: name.preferred,
          lastName: name.last,
          uuid: userData.uuid,
        };

        AsyncStorage.setItem("userData", JSON.stringify(user));

        this.setState({ user: user });
      });
  };

  componentDidMount() {
    AsyncStorage.getItem("localEventData", (error, result) => {
      if (result) {
        console.log("Events found locally.");
        this.setState({ events: sortEventsByStartTime(JSON.parse(result)) });
      } else {
        fetchEvents().then((data) => {
          console.log("Fetched events from CMS.");
          const fetchedEvents = data.data.eventbases;
          this.setState({ events: sortEventsByStartTime(fetchedEvents) });
          const localEventData = JSON.stringify(fetchedEvents);
          AsyncStorage.setItem("localEventData", localEventData);
        });
      }
    });

    AsyncStorage.getItem(
      "userData",
      (error, result) => result && this.setState({ user: JSON.parse(result) })
    );

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
    const { events, infoBlocks, user } = this.state;

    return (
      <CMSContext.Provider
        value={{
          events,
          infoBlocks,
          toggleStar: this.toggleStarred,
        }}
      >
        <AuthContext.Provider
          value={{
            user: this.state.user,
            login: this.login,
            logout: this.logout,
          }}
        >
          <NavigationContainer>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <Tab.Navigator
              tabBarOptions={{
                activeTintColor: "#41D1FF",
                tabBarVisible: false,
              }}
            >
              <Tab.Screen name="Schedule" component={SchdeuleStackScreen} />
              <Tab.Screen name="LoginOnboard" component={LoginOnboarding} />
              <Tab.Screen name="EventOnboard" component={EventOnboarding} />
            </Tab.Navigator>
          </NavigationContainer>
        </AuthContext.Provider>
      </CMSContext.Provider>
    );
  }
}
