import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
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
import { Home, Schedule, Login } from "./screens";
import { NotificationsComp } from "./components";

import { fetchEvents } from "./cms";
import { colors } from "./themes";
import { styleguide } from "./styles";

export const AuthContext = React.createContext();
export const StarContext = React.createContext();
// export const CMSContext = React.createContext();

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

// a StackNavgiator will give the ability to "push a screen"
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

const LoginStack = createStackNavigator({
  Login
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
    Login: LoginStack,
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
          case "Login":
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

      indicatorStyle: {
        backgroundColor: colors.primaryBlue,
      },
    }
  }
);

const AppContainer = createAppContainer(TabNavigator);

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    Notif = new NotificationsComp();

    this.state = {
      user: null,
      accessToken: null,
      allData: null,
      starredItems: null
    };
  }

  componentDidMount() {
    Notif.runNotifications();
    AsyncStorage.getItem(
      "userData",
      (error, result) => result && this.setState({ user: JSON.parse(result) })
    );
    AsyncStorage.getItem(
      "accessToken",
      (error, result) => result && this.setState({ accessToken: result })
    );
    AsyncStorage.getItem("starredItems", (error, result) => {
      this.setState({ starredItems: JSON.parse(result) });
    });
    fetchEvents().then(data => {
      this.setState({ allData: data });
    });
  }

  componentWillUnmount() {
    Notif.listener();
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

  toggleStarred = async (id, starDict) => {
    let curItems;
    if (this.state.starredItems == null) {
      curItems = starDict;
    } else {
      curItems = this.state.starredItems;
    }
    if (curItems[id] == false) {
      curItems[id] = true;
    } else {
      curItems[id] = false;
    }
    this.setState({ starredItems: curItems });
    try {
      await AsyncStorage.setItem("starredItems", JSON.stringify(curItems));
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <AuthContext.Provider
        value={{
          user: this.state.user,
          login: this.login,
          logout: this.logout
        }}
      >
        <StarContext.Provider
          value={{
            toggleStarred: this.toggleStarred,
            starredItems: this.state.starredItems
          }}
        >
          <AppContainer screenProps={{ allData: this.state.allData }} />
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
