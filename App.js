import "react-native-gesture-handler";
import React from "react";
import { fetchHackathonData } from "./cms";
import { HackathonContext, AuthContext, ThemeContext, ScavHuntContext } from "./context";
import { StatusBar, Modal, View, Clipboard } from "react-native";
import { ScheduleTab } from "./schedule/ScheduleTab";
import { InformationTab } from "./info/InformationTab";
import { ScavengerHuntTab } from "./scav_hunt/ScavengerHuntTab"
import { ScavHuntItem } from "./scav_hunt/ScavHuntItem";
import ScavHuntProvider from "./state_management/scavHunt";
import CheckInProvider from "./state_management/checkIn";
import { ScheduleSearch } from "./schedule/ScheduleSearch";
import { LoginOnboarding } from "./onboarding/LoginOnboarding";
import SplashScreen from "./components/SplashScreen";
import { EventOnboarding } from "./onboarding/EventOnboarding";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SearchIcon from "./assets/Search";
import StarOnIcon from "./assets/StarLargeOn";
import StarOffIcon from "./assets/StarLargeOff";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faInfoCircle, faCalendar, faMapSigns } from "@fortawesome/free-solid-svg-icons";
import HackGTIcon from "./assets/HackGTIcon";
import AsyncStorage from "@react-native-community/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";
import { authorize } from "react-native-app-auth";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import { turnToEst } from "./cms/DataHandler";
import {
  useDarkModeContext,
  useDynamicStyleSheet,
} from "react-native-dark-mode";
import { dynamicStyles } from "./themes";
import firebase from "@react-native-firebase/app";
import messaging from "@react-native-firebase/messaging";
import { CheckInTab } from "./participantCheckin/CheckInTab";

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

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});

function HackGTitle() {
  return <HackGTIcon />;
}

const ScheduleStack = createStackNavigator();
const InformationStack = createStackNavigator();
const ScavengerHuntStack = createStackNavigator();
const CheckInStack = createStackNavigator();

function ScheduleStackScreen({ navigation }) {
  const dStyles = useDynamicStyleSheet(dynamicStyles);
  return (
    <HackathonContext.Consumer>
      {({ isStarSchedule, toggleIsStarSchedule }) => (
        <ScheduleStack.Navigator>
          <ScheduleStack.Screen
            options={{
              headerTitleAlign: "left",
              headerTitle: (props) => <HackGTitle {...props} />,
              headerRight: () => (
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={toggleIsStarSchedule}>
                    {isStarSchedule ? (
                      <StarOnIcon
                        fill={dStyles.secondaryBackgroundColor.backgroundColor}
                      />
                    ) : (
                      <StarOffIcon
                        fill={dStyles.secondaryBackgroundColor.backgroundColor}
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ paddingLeft: 10, paddingRight: 10 }}
                    onPress={() => {
                      navigation.navigate("ScheduleSearch");
                    }}
                  >
                    <SearchIcon
                      fill={dStyles.secondaryBackgroundColor.backgroundColor}
                    />
                  </TouchableOpacity>
                </View>
              ),
              headerStyle: dStyles.tabBarBackgroundColor,
            }}
            name="HackGT"
          >
            {(props) => <ScheduleTab {...props} />}
          </ScheduleStack.Screen>

          <ScheduleStack.Screen
            options={{
              headerTransparent: true,
              headerTitle: "",
              headerLeft: null,
            }}
            name="ScheduleSearch"
            component={ScheduleSearch}
          />
        </ScheduleStack.Navigator>
      )}
    </HackathonContext.Consumer>
  );
}

function InformationStackScreen({ navigation }) {
  const dStyles = useDynamicStyleSheet(dynamicStyles);
  return (
    <InformationStack.Navigator>
      <InformationStack.Screen
        options={{
          headerTitleAlign: "left",
          headerTitle: (props) => <HackGTitle {...props} />,
          headerStyle: dStyles.tabBarBackgroundColor,
        }}
        name="HackGT"
      >
        {(props) => <InformationTab {...props} />}
      </InformationStack.Screen>
    </InformationStack.Navigator>
  );
}

function ScavengerHuntStackScreen({ navigation }) {
  const dStyles = useDynamicStyleSheet(dynamicStyles);
  return (
    <ScavHuntProvider>
      <AuthContext.Consumer>
        {({user}) => {
        return (
    <ScavengerHuntStack.Navigator>
      <ScavengerHuntStack.Screen
        options={{
          headerTitleAlign: "left",
          headerTitle: (props) => <HackGTitle {...props} />,
          headerStyle: dStyles.tabBarBackgroundColor,
        }}
        name="HackGT"
      >
        {(props) => <ScavengerHuntTab {...props} user={user} />}
      </ScavengerHuntStack.Screen>
      <ScavengerHuntStack.Screen
        options={{
          headerTitleAlign: "left",
          headerTitle: (props) => <HackGTitle {...props} />,
          headerStyle: dStyles.tabBarBackgroundColor,
          headerLeft: null
        }}
        name="ScavHuntItem"
        component={ScavHuntItem}
      />
    </ScavengerHuntStack.Navigator>
        )}}
    </AuthContext.Consumer>
    </ScavHuntProvider>
  );
}

function CheckInStackScreen({ navigation }) {
  const dStyles = useDynamicStyleSheet(dynamicStyles);
  return (
    <CheckInProvider>
      <AuthContext.Consumer>
        {({ user }) => {
          return (
            <CheckInStack.Navigator>
              <CheckInStack.Screen
                options={{
                  headerTitleAlign: "left",
                  headerTitle: (props) => <HackGTitle {...props} />,
                  headerStyle: dStyles.tabBarBackgroundColor,
                }}
                name="HackGT"
              >
                {(props) => <CheckInTab {...props} />}
              </CheckInStack.Screen>
            </CheckInStack.Navigator>
          )
        }}
      </AuthContext.Consumer>
    </CheckInProvider>
  );
}


// for editing styles shown on tabs, see https://reactnavigation.org/docs/tab-based-navigation
const Tab = createBottomTabNavigator();

class App extends React.Component {
  constructor(props) {
    super(props);

    // setup firebase notification support
    firebase.messaging().subscribeToTopic("all");
    // alert(firebase.messaging().getToken());

    PushNotification.createChannel(
      {
        channelId: "hackgt-channel",
        channelName: "HackGT Channel",
        channelDescription: "For all your HackGT needs",
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );

    this.state = {
      // event data
      hackathon: null,
      eventTypes: [],
      types: [],
      starredIds: [],
      isStarSchedule: false,

      // used for finding current state of screen for loading/login components
      isFetchingData: true,
      isFetchingLogin: true,

      // login data
      user: null,
      accessToken: null,

      // TODO: temporay, onboarding login should show when user is null. login is disabled so remove this whn fixed
      skipOnboarding: false,
    };
  }

  toggleIsStarSchedule = () => {
    this.setState({ isStarSchedule: !this.state.isStarSchedule }, () => {
      AsyncStorage.setItem(
        "isStarSchedule",
        this.state.isStarSchedule == true ? "true" : "false"
      );
    });
  };

  toggleStarred = (event) => {
    const toggleEventId = event.id;

    function updateStorage() {
      AsyncStorage.setItem("starredIds", JSON.stringify(this.state.starredIds));
    }

    isNowStarred = this.state.starredIds.indexOf(toggleEventId) == -1;

    let eventIdNumber = toggleEventId.replace(/\D/g, "").substring(1, 5);
    eventIdNumber = Number.parseInt(eventIdNumber);

    if (isNowStarred) {
      // schedule notification for 15 min before
      PushNotification.localNotificationSchedule({
        channelId: "hackgt-channel",
        id: eventIdNumber + "", // map string into a unique id for cancellation
        message: event.name + " is starting in 15 minutes! ",
        date: new Date(turnToEst(event.startDate).toDate() - 15 * 60 * 1000), // schedule it for its time - 15 minutes
      });

      // add to starred state, then update storage
      this.setState(
        (prevState) => ({
          starredIds: [...prevState.starredIds, toggleEventId],
        }),
        updateStorage
      );

      return true;
    } else {
      // cancel notification if previously starred
      PushNotification.cancelLocalNotifications({
        id: eventIdNumber + "",
      });

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

  // login = () => {
  //   this.setState({ skipOnboarding: true });
  //   AsyncStorage.setItem("skipOnboarding", "true");
  // };

  login = async () => {
    try {
      const result = await authorize(config);
      console.log('Login result: ', result, result['accessToken'], result.accessToken)
      this.setState({ accessToken: result.accessToken });
      this.fetchUserDetails(result.accessToken);
      AsyncStorage.setItem("accessToken", result.accessToken);
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
    // AsyncStorage.getItem("skipOnboarding", (error, result) => {
    //   console.log(error);
    //   result &&
    //     this.setState({ skipOnboarding: result === "true" ? true : false });
    // });

    AsyncStorage.getItem(
      "starredIds",
      (error, result) =>
        result && this.setState({ starredIds: JSON.parse(result) })
    );

    AsyncStorage.getItem(
      "pastEventOnboardID",
      (error, result) => result && this.setState({ pastEventOnboardID: result })
    );

    AsyncStorage.getItem("isStarSchedule", (error, result) => {
      result &&
        this.setState({ isStarSchedule: result === "true" ? true : false });
      console.log(this.state.isStarSchedule);
    });

    AsyncStorage.getItem("userData", (error, result) => {
      if (result) {
        this.setState({ user: JSON.parse(result) });
      }
      this.setState({ isFetchingLogin: false });
    });

    AsyncStorage.getItem("localEventTypeData", (error, result) => {
      if (result) {
        const eventTypes = JSON.parse(result);
        if (eventTypes != null) {
          this.setState({ eventTypes: eventTypes });
        }
      }
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
        // no response back, just return
        if (data == null || data.data == null) {
          return;
        }

        const hackathons = data.data.allHackathons;
        const eventTypes = data.data.allTypes;

        if (hackathons != null && hackathons.length != 0) {
          console.log("Hackathon found remotely.");
          const hackathon = hackathons[0];

          AsyncStorage.setItem("localHackathonData", JSON.stringify(hackathon));
          AsyncStorage.setItem("localTypeData", JSON.stringify(eventTypes));

          this.setState({
            eventTypes: eventTypes,
            hackathon: hackathon,
            isFetchingData: false,
          });
        } else {
          // if still loading, present error asking for retry
        }
      });
    });
  }

  render() {
    const Stack = createStackNavigator();

    const hackathon = this.state.hackathon;
    console.log(hackathon)
    const starredIds = this.state.starredIds;
    const eventTypes = this.state.eventTypes;

    // TODO: login re-enable
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
      return (
        <ThemeContext.Provider
          value={{
            theme: this.props.theme,
            dynamicStyles: this.props.styles,
          }}
        >
          <SplashScreen
            grow={true}
            onGrowDone={() => this.setState({ scheduleModal: true })}
          />
        </ThemeContext.Provider>
      );
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

    const showEventOnboard = this.state.pastEventOnboardID !== hackathon.id;

    // if logging in with a hexlabs email
    const showCheckin = /@hexlabs.org\s*$/.test(this.state.user.email)
    // if(showCheckin) {
    //   return (
    //     <ThemeContext.Provider
    //       value={{
    //         theme: this.props.theme,
    //         dynamicStyles: this.props.styles,
    //       }}
    //     >
    //       <HackathonContext.Provider
    //         value={{
    //           hackathon: hackathon,
    //           eventTypes: eventTypes,
    //           toggleStar: this.toggleStarred,
    //           starredIds: starredIds,
    //           isStarSchedule: this.state.isStarSchedule,
    //           toggleIsStarSchedule: this.toggleIsStarSchedule,
    //         }}
    //       >
    //         <AuthContext.Provider
    //           value={{
    //             user: this.state.user,
    //             login: this.login,
    //             logout: this.logout,
    //           }}
    //         >
              
    //           <SelectionScreen />
              
    //         </AuthContext.Provider>
    //       </HackathonContext.Provider>
    //     </ThemeContext.Provider>
    //   );
    // }


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
            eventTypes: eventTypes,
            toggleStar: this.toggleStarred,
            starredIds: starredIds,
            isStarSchedule: this.state.isStarSchedule,
            toggleIsStarSchedule: this.toggleIsStarSchedule,
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

              {/* TODO: when need tab bottom bar, convert "Stack." to "Tab." and remoe headerMode="none" and finally add different screens below */}
              <Tab.Navigator
                // headerMode="none"
                tabBarOptions={{
                  activeTintColor: this.props.styles.tintColor.color,
                  style: this.props.styles.tabBarBackgroundColor,
                  showLabel: false,
                }}
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let icon;
                    const selectedColor = focused
                      ? this.props.styles.tintColor.color
                      : this.props.styles.text.color;

                    if (route.name === "Schedule") {
                      icon = faCalendar;
                    } else if (route.name === "Information") {
                      icon = faInfoCircle;
                    } else if (route.name === "ScavengerHunt") {
                      icon = faMapSigns
                    } else if (route.name === "CheckIn") {
                      icon = faMapSigns;
                    }

                    return (
                      <FontAwesomeIcon
                        color={selectedColor}
                        icon={icon}
                        size={26}
                      />
                    );
                  },
                })}
              >
                {showEventOnboard ? (
                  <Stack.Screen
                    name="Schedule"
                    children={() => (
                      <EventOnboarding
                        onDone={() => {
                          this.setState({ pastEventOnboardID: hackathon.id });
                          AsyncStorage.setItem(
                            "pastEventOnboardID",
                            hackathon.id
                          );
                        }}
                      ></EventOnboarding>
                    )}
                  ></Stack.Screen>
                ) : (
                  <Stack.Screen
                    name="Schedule"
                    component={
                      showEventOnboard ? EventOnboarding : ScheduleStackScreen
                    }
                  />
                )}

                <Stack.Screen
                  name="Information"
                  component={InformationStackScreen}
                />
                <Stack.Screen
                  name="ScavengerHunt"
                  component={ScavengerHuntStackScreen}
                />
                <Stack.Screen
                  name="CheckIn"
                  component={CheckInStackScreen}
                />
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
