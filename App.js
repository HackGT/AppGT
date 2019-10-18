import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
]);

import AsyncStorage from "@react-native-community/async-storage";
import { authorize } from "react-native-app-auth";
import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer,
  BottomTabBar,
} from "react-navigation";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faInfoCircle,
  faCalendarDay,
  faBell,
  faKey,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";

import moment from "moment-timezone";

import { Home, Schedule, ScavHunt } from "./screens";
import { CARD_KEYS } from "./screens/Home";
import { populateEvents, UNSAFE_parseAsLocal } from "./screens/Schedule";
import { NotifierService } from "./components";

import { fetchEvents, fetchInfoBlocks } from "./cms";
import { colors } from "./themes";
import { styleguide } from "./styles";

export const AuthContext = React.createContext();
export const StarContext = React.createContext();
export const CMSContext = React.createContext();

const authUrl = "https://login.hack.gt";

const config = {
  clientId: "7d1c11b30351e91d6517492c19a9a0185a6e4e6304f9826f96a76895534cf26f",
  redirectUrl: "gt.hack.live://redirect",
  clientSecret: "hackgt",
  serviceConfiguration: {
    authorizationEndpoint: `${authUrl}/oauth/authorize`,
    tokenEndpoint: `${authUrl}/oauth/token`
  }
};

// TODO better navbar style to achieve design parity: https://stackoverflow.com/questions/50318728/get-height-of-tab-bar-on-any-device-in-react-navigation
// TODO run event fetch in background (every 30)

// TODO schedule local notifs in background fetch for accurate notifs
// a StackNavigator will give the ability to "push a screen"
// for instance, when a user clicks a event cell it will push a detailed view on the stack
const ScheduleStack = createStackNavigator({
  Schedule,
}, { headerMode: "none" });

const HomeStack = createStackNavigator({
  Home
}, { headerMode: "none" });

// TODO re-introduce notifications tab
// const NotificationsStack = createStackNavigator({
//   Notifications
// }, { headerMode: "none" });

const ScavHuntStack = createStackNavigator({
  ScavHunt
}, { headerMode: "none" });


const TabBarComponent = (props) => (
  <View style={styles.tabBar}>
      {/* <View style={{ backgroundColor: "red", height: 10 }} /> */}
      <BottomTabBar style={styles.innerTabBar} {...props} />
  </View>
)

const TabNavigator = createBottomTabNavigator(
  {
    Home: HomeStack,
    Schedule: ScheduleStack,
    ScavHunt: ScavHuntStack,
    // Notifications: NotificationsStack
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({

      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;

        switch (routeName) {
          case "Home":
            return <FontAwesomeIcon color={tintColor} icon={faInfoCircle} size={32} />;
          case "Schedule":
            icon = faCalendarDay;
            break;
          case "Notifications":
            icon = faBell;
            break;
          case "ScavHunt":
            icon = faKey;
            break;
          default:
            icon = faQuestion;
        }

        return <FontAwesomeIcon color={tintColor} icon={icon} size={28} />;
      },
    }),
    tabBarComponent: (props) => <TabBarComponent {...props} />,
    tabBarOptions: {
      showLabel: false,
      activeTintColor: colors.primaryBlue,
      // keyboardHidesTabBar: true,
      indicatorStyle: {
        backgroundColor: colors.primaryBlue,
      },
    }
  }
);

// TODO hide nav bar on keyboard
// https://github.com/bamlab/react-native-hide-with-keyboard/blob/master/index.js
const AppContainer = createAppContainer(TabNavigator);

export default class App extends Component<Props> {
  constructor(props) {
    super(props);

    this.notifierService = new NotifierService();

    this.state = {
      user: null,
      accessToken: null,
      allData: null,
      starredItems: {},
      infoBlocks: [],
      eventData: [],
      tags: [],
    };
  }

  componentDidMount() {
    AsyncStorage.getItem(
      "userData",
      (error, result) => result && this.setState({ user: JSON.parse(result) })
    );
    AsyncStorage.getItem(
      "accessToken",
      (error, result) => result && this.setState({ accessToken: result })
    );
    AsyncStorage.getItem(
      "starredItems",
      (error, result) => result && this.setState({ starredItems: JSON.parse(result) })
    );

    AsyncStorage.getItem(
      "tags",
      (error, result) => result && this.setState({ tags: JSON.parse(result) })
    );

    AsyncStorage.getItem("eventData", (error, result) => {
      if (result) {
        const eventData = JSON.parse(result);
        // create moments
        eventData.forEach(event => { // read off clean version
          event.startTime = UNSAFE_parseAsLocal(event.start_time);
          event.endTime = UNSAFE_parseAsLocal(event.end_time);
        })
        this.setState({ eventData }); // TODO set starred keys according to this
      }
      fetchEvents().then(data => {
        // load star dict before exposing to user - ? do we need to worry about CMS failure?
        const starredItems = { ...this.state.starredItems };
        data.data.eventbases.forEach((base) => {
          if (!(base.id in starredItems)) {
            starredItems[base.id] = false; // don't worry about the things in starred item that aren't in events, they won't render
          }
        })

        const eventData = populateEvents(data.data); // store ready to use data
        const tags = data.data.tags.map(tag => tag.name);

        AsyncStorage.setItem("eventData", JSON.stringify(eventData)); // store the clean version
        AsyncStorage.setItem("tags", JSON.stringify(tags));
        this.setState({ starredItems, eventData, tags });
      });
    });

    AsyncStorage.getItem("infoBlocks", (error, result) => {
      if (result) {
        this.setState({ infoBlocks: JSON.parse(result) });
      }
      fetchInfoBlocks().then(data => { // refresh
        const infoBlocks = {};
        const infoArray = data.data.infoblocks;
        infoArray.forEach( block => {
          if (CARD_KEYS.includes(block.slug))
          infoBlocks[block.slug] = block;
        });
        this.setState({ infoBlocks });
        AsyncStorage.setItem("infoBlocks", JSON.stringify(infoBlocks));
      });
    });
  }

  logout = async () => {
    fetch(`${authUrl}/api/user/logout`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.state.accessToken
      }
    }).then(response => {
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

  fetchUserDetails = async accessToken => {
    fetch(`${authUrl}/api/user`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken
      }
    })
      .then(response => {
        return response.json();
      })
      .then(userData => {
        const name = userData.nameParts;
        const user = {
          email: userData.email,
          name: userData.name,
          firstName: name.first,
          preferredName: name.preferred,
          lastName: name.last,
          uuid: userData.uuid
        };

        AsyncStorage.setItem("userData", JSON.stringify(user));

        this.setState({ user: user });
      });
  };

  toggleStarred = async (id) => {
    const curItems = { ...this.state.starredItems };

    if (curItems[id]) { // toggled off, unsubscribe
      this.notifierService.unsubscribe(id);
    } else { // subscribe
      this.notifierService.subscribe(id);
    }
    curItems[id] = !curItems[id];

    this.setState({ starredItems: curItems });
    try {
      await AsyncStorage.setItem("starredItems", JSON.stringify(curItems));
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { user, infoBlocks, eventData, starredItems, tags } = this.state;
    return (
      <AuthContext.Provider
        value={{
          user,
          login: this.login,
          logout: this.logout
        }}
      >
        <StarContext.Provider
          value={{
            toggleStarred: this.toggleStarred,
            starredItems
          }}
        >
          <CMSContext.Provider
            value={{
              infoBlocks,
              eventData,
              tags,
            }}
          >
            <AppContainer />
          </CMSContext.Provider>
        </StarContext.Provider>
      </AuthContext.Provider>
    );
  }
}


const styles = StyleSheet.create({
  tabBar: {
    paddingBottom: 24,
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderColor: colors.lightGrayBackgroundBehindTagText,
    borderWidth: 2,
    ...styleguide.popoutBar
  },
  innerTabBar: {
    borderTopWidth: 0,
    marginTop: 12,
  }
});
