import "react-native-gesture-handler";
import React from "react";
import { fetchHackathonData } from "./cms";
import { HackathonContext, AuthContext, ThemeContext } from "./context";
import { StatusBar, Modal } from "react-native";
import { ScheduleTab } from "./schedule/ScheduleTab";
import { ScheduleSearch } from "./schedule/ScheduleSearch";
import { LoginOnboarding } from "./onboarding/LoginOnboarding";
import SplashScreen from "./SplashScreen";
import { EventOnboarding } from "./onboarding/EventOnboarding";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SearchIcon from "./assets/Search";
import HackGTIcon from "./assets/HackGTIcon";
import AsyncStorage from "@react-native-community/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";
import { authorize } from "react-native-app-auth";
import {
  useDarkModeContext,
  useDynamicStyleSheet,
} from "react-native-dark-mode";
import { dynamicStyles } from "./themes";

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
  const dStyles = useDynamicStyleSheet(dynamicStyles);
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
              <SearchIcon
                fill={dStyles.secondaryBackgroundColor.backgroundColor}
              />
            </TouchableOpacity>
          ),
          headerStyle: dStyles.tabBarBackgroundColor,
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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // event data
      hackathon: null,
      eventTypes: [],
      faq: [],
      starredIds: [],

      // used for finding current state of screen for loading/login components
      isFetchingData: true,
      isFetchingLogin: true,

      // login data
      user: null,
      accessToken: null,
    };
  }

  toggleStarred = (event) => {
    const toggleEventId = event.id;

    function updateStorage() {
      AsyncStorage.setItem("starredIds", JSON.stringify(this.state.starredIds));
    }

    if (this.state.starredIds.indexOf(toggleEventId) != -1) {
      // remove from starred state, then update storage
      this.setState(
        {
          starredIds: this.state.starredIds.filter(
            (id) => id !== toggleEventId
          ),
        },
        updateStorage
      );
      return false;
    } else {
      // add to starred state, then update storage
      this.setState(
        (prevState) => ({
          starredIds: [...prevState.starredIds, toggleEventId],
        }),
        updateStorage
      );

      return true;
    }
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
    AsyncStorage.getItem(
      "starredIds",
      (error, result) =>
        result && this.setState({ starredIds: JSON.parse(result) })
    );

    AsyncStorage.getItem("userData", (error, result) => {
      if (result) {
        this.setState({ user: JSON.parse(result) });
      }
      this.setState({ isFetchingLogin: false });
    });

    AsyncStorage.getItem("localHackathonData", (error, result) => {
      if (result) {
        console.log("Hackathon found locally.");
        const hackathon = JSON.parse(result);

        if (hackathon != null) {
          this.setState({ hackathon: hackathon, isFetchingData: false });
        }
      }

      fetchHackathonData().then((data) => {
        const hackathons = data.data.allHackathons;
        if (hackathons != null && hackathons.length != 0) {
          console.log("Hackathon found remotely.");
          const hackathon = hackathons[0];

          AsyncStorage.setItem("localHackathonData", JSON.stringify(hackathon));
          this.setState({ hackathon: hackathon, isFetchingData: false });
        } else {
          // if still loading, present error asking for retry
        }
      });
    });
  }

  render() {
    const hackathon = this.state.hackathon;
    const starredIds = this.state.starredIds;

    const needsLogin = this.state.user == null;
    const isLoading = this.state.isFetchingData || this.state.isFetchingLogin;

    const splashGrowModal = (
      <Modal animationType="none" transparent={true}>
        <SplashScreen
          grow={true}
          onGrowDone={() => this.setState({ scheduleModal: true })}
        />
      </Modal>
    );

    // until app is done loading data, show the splash screen
    if (isLoading) {
      return <SplashScreen />;
    }

    // if user needs to login, do splash grow/fade out animation then show login
    if (needsLogin) {
      return (
        <ThemeContext.Provider
          value={{
            theme: this.props.theme,
            dynamicStyles: this.props.styles,
          }}
        >
          <AuthContext.Provider
            value={{
              user: this.state.user,
              login: this.login,
              logout: this.logout,
            }}
          >
            {!this.state.scheduleModal && splashGrowModal}
            <LoginOnboarding />
          </AuthContext.Provider>
        </ThemeContext.Provider>
      );
    }

    // once logged in and all data is loaded, present full app after grow animation
    return (
      <ThemeContext.Provider
        value={{
          theme: this.props.theme,
          dynamicStyles: this.props.styles,
        }}
      >
        <HackathonContext.Provider
          value={{
            hackathon: hackathon,
            toggleStar: this.toggleStarred,
            starredIds: starredIds,
          }}
        >
          <AuthContext.Provider
            value={{
              user: this.state.user,
              login: this.login,
              logout: this.logout,
            }}
          >
            {!this.state.scheduleModal && splashGrowModal}
            <NavigationContainer>
              <StatusBar
                backgroundColor={
                  this.props.styles.tabBarBackgroundColor.backgroundColor
                }
                barStyle={
                  this.props.theme == "dark" ? "light-content" : "dark-content"
                }
              />
              <Tab.Navigator
                tabBarOptions={{
                  activeTintColor: this.props.styles.tintColor.color,
                  tabBarVisible: false,
                  style: this.props.styles.tabBarBackgroundColor,
                }}
              >
                <Tab.Screen name="Schedule" component={SchdeuleStackScreen} />
                <Tab.Screen name="LoginOnboard" component={LoginOnboarding} />
                <Tab.Screen name="EventOnboard" component={EventOnboarding} />
              </Tab.Navigator>
            </NavigationContainer>
          </AuthContext.Provider>
        </HackathonContext.Provider>
      </ThemeContext.Provider>
    );
  }
}

export default withThemeHook(App);

function withThemeHook(App) {
  return function Hook(props) {
    const theme = useDarkModeContext();
    const styles = useDynamicStyleSheet(dynamicStyles);
    return <App {...props} theme={theme} styles={styles} />;
  };
}
