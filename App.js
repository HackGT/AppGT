import React, { Component } from "react";
import Workshops from "./screens/Workshops";
import Home from "./screens/Home";
import Schedule from "./screens/Schedule";
import Login from "./screens/Login";
import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer
} from "react-navigation";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHome,
  faList,
  faBell,
  faKey,
  faQuestion
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-community/async-storage";
import { authorize } from "react-native-app-auth";

export const AuthContext = React.createContext();
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

// a StackNavgiator will give the ability to "push a screen"
// for instance, when a user clicks a event cell it will push a detailed view on the stack
const ScheduleStack = createStackNavigator({
  Schedule
});

const HomeStack = createStackNavigator({
  Home
});

const WorkshopStack = createStackNavigator({
  Workshops
});

const LoginStack = createStackNavigator({
  Login
});

const TabNavigator = createBottomTabNavigator(
  {
    Home: HomeStack,
    Schedule: ScheduleStack,
    Notifications: WorkshopStack,
    Login: LoginStack
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;

        switch (routeName) {
          case "Home":
            icon = faHome;
            break;
          case "Schedule":
            icon = faList;
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

        return <FontAwesomeIcon color={tintColor} icon={icon} />;
      }
    })
  }
);

const AppContainer = createAppContainer(TabNavigator);

export default class App extends Component<Props> {
  state = {
    user: null,
    accessToken: null,
    allData: null
  };

  componentDidMount() {
    AsyncStorage.getItem(
      "userData",
      (error, result) => result && this.setState({ user: JSON.parse(result) })
    );
    AsyncStorage.getItem(
      "accessToken",
      (error, result) => result && this.setState({ accessToken: result })
    );
    getAllData().then(data => {
      this.setState({ allData: data });
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

  updateAuthUser(newUser) {
    this.setState({ auth: newUser });
  }

  render() {
    return (
      <AuthContext.Provider
        value={{
          user: this.state.user,
          login: this.login,
          logout: this.logout
        }}
      >
        <AppContainer screenProps={{ allData: this.state.allData }} />
      </AuthContext.Provider>
    );
  }
}
