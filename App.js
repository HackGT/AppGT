import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { StatusBar, Modal, Platform } from "react-native";
import { LoginOnboarding } from "./app/features/onboarding/LoginOnboarding";
import SplashScreen from "./app/components/SplashScreen";
import { EventOnboarding } from "./app/features/onboarding/EventOnboarding";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import messaging from "@react-native-firebase/messaging";
import {
  faInfoCircle,
  faCalendar,
  faMapSigns,
  faClipboardCheck,
  faIdBadge,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-community/async-storage";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import {
  useDarkModeContext,
  useDynamicStyleSheet,
} from "react-native-dark-mode";
import { dynamicStyles } from "./app/theme";
import firebase from "@react-native-firebase/app";
import {
  ScheduleStackScreen,
  InformationStackScreen,
  ScavengerHuntStackScreen,
  InteractionsStackScreen,
  CheckInStackScreen,
  ProfileStackScreen,
} from "./app/navigation";
import { HackathonProvider } from "./app/state/hackathon";
import { ThemeProvider } from "./app/contexts/ThemeContext";
import { AuthProvider, AuthContext } from "./app/contexts/AuthContext";
import { app } from "./firebase";
import { HackathonContext } from "./app/state/hackathon";
import "intl";
import "intl/locale-data/jsonp/en";
import remoteConfig from "@react-native-firebase/remote-config";
import { DEFAULT_HEXATHON } from "./app/api/api";

// old groundtruth auth
// const authUrl = "https://login.hack.gt";
const loginUrl = "https://login.hexlabs.org";

const config = {
  clientId: "7d1c11b30351e91d6517492c19a9a0185a6e4e6304f9826f96a76895534cf26f",
  redirectUrl: "gt.hack.live://redirect",
  clientSecret: "hackgt",
  serviceConfiguration: {
    authorizationEndpoint: `${loginUrl}/oauth/authorize`,
    tokenEndpoint: `${loginUrl}/oauth/token`,
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

// for editing styles shown on tabs, see https://reactnavigation.org/docs/tab-based-navigation
const Tab = createBottomTabNavigator();

function App(props) {
  const theme = useDarkModeContext();
  const styles = useDynamicStyleSheet(dynamicStyles);

  // event data
  const [hackathon, setHackathon] = useState(null);
  const [starredIds, setStarredIds] = useState([]);
  const [isStarSchedule, setIsStarSchedule] = useState(false);

  // used for finding current state of screen for loading/login components
  const [isFetchingData, setIsFetchingData] = useState(true);

  // TODO: temporary, onboarding login should show when user is null. login is disabled so remove this whn fixed
  const [scheduleModal, setScheduleModal] = useState(false);
  const [pastEventOnboardID, setPastEventOnboardID] = useState(null);

  const configAsyncStorage = () => {
    AsyncStorage.getItem(
      "starredIds",
      (error, result) => result && setStarredIds(JSON.parse(result))
    );

    AsyncStorage.getItem(
      "pastEventOnboardID",
      (error, result) => result && setPastEventOnboardID(result)
    );

    AsyncStorage.getItem("isStarSchedule", (error, result) => {
      result && setIsStarSchedule(result === true ? true : false);
      console.log(isStarSchedule);
    });

    setIsFetchingData(false);
  };

  useEffect(() => {
    // setup firebase notification support
    messaging().subscribeToTopic("all");
    // alert(firebase.messaging().getToken());

    PushNotification.createChannel(
      {
        channelId: "hackgt-channel",
        channelName: "HackGT Channel",
        channelDescription: "For all your HackGT needs",
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );

    configAsyncStorage();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(
      "isStarSchedule",
      isStarSchedule == true ? "true" : "false"
    );
  }, [isStarSchedule]);

  useEffect(() => {
    if (Platform.OS === "android") {
      // See https://github.com/expo/expo/issues/6536 for this issue.
      if (Intl.__disableRegExpRestore === "function") {
        Intl.__disableRegExpRestore();
      }
    }
  }, []);

  useEffect(() => {
    try {
      remoteConfig()
        .setConfigSettings({
          isDeveloperModeEnabled: __DEV__,
        })
        .then(() =>
          remoteConfig()
            .setDefaults({
              hexathon: DEFAULT_HEXATHON.id,
              hexathonName: DEFAULT_HEXATHON.name,
            })
            .then(() => remoteConfig().fetchAndActivate())
            .then((fetchedRemotely) => {
              if (fetchedRemotely) {
                console.log(
                  "Configs were retrieved from the backend and activated."
                );
              } else {
                console.log(
                  "No configs were fetched from the backend, and the local configs were already activated"
                );
              }
              return remoteConfig().fetch();
            })
        );
    } catch (err) {
      console.log(err);
    }
  }, []);

  const hexathon = remoteConfig().getValue("hexathon").asString();

  const Stack = createStackNavigator();

  const splashGrowModal = (
    <Modal animationType="none" transparent={true}>
      <SplashScreen grow={true} onGrowDone={() => setScheduleModal(true)} />
    </Modal>
  );
  return (
    <AuthProvider app={app}>
      <ThemeProvider>
        <AuthContext.Consumer>
          {({ loading, showLogin, user, firebaseUser }) => {
            // until app is done loading data, show the splash screen
            if (loading || isFetchingData) {
              return (
                <SplashScreen
                  grow={true}
                  onGrowDone={() => setScheduleModal(true)}
                />
              );
            }

            // if user needs to login, do splash grow/fade out animation then show login
            if (showLogin) {
              return (
                <>
                  {!scheduleModal && splashGrowModal}
                  <LoginOnboarding />
                </>
              );
            }
            const showCheckin = user && user.roles.member;
            // once logged in and all data is loaded, present full app after grow animation
            return (
              <HackathonProvider
                initialValue={{
                  hackathon: hexathon,
                  starredIds: starredIds,
                  isStarSchedule: isStarSchedule,
                }}
                firebaseUser={firebaseUser}
              >
                <HackathonContext.Consumer>
                  {({ isLoading }) => {
                    if (!isLoading) {
                      // const showEventOnboard = pastEventOnboardID !== hackathon.id;
                      const showEventOnboard = false;
                      return (
                        <>
                          {!scheduleModal && splashGrowModal}
                          <NavigationContainer>
                            <StatusBar
                              backgroundColor={
                                styles.tabBarBackgroundColor.backgroundColor
                              }
                              barStyle={
                                theme == "dark"
                                  ? "light-content"
                                  : "dark-content"
                              }
                            />

                            <Tab.Navigator
                              tabBarOptions={{
                                activeTintColor: styles.tintColor.color,
                                style: styles.tabBarBackgroundColor,
                                showLabel: false,
                              }}
                              screenOptions={({ route }) => ({
                                tabBarIcon: ({ focused, color, size }) => {
                                  let icon;
                                  const selectedColor = focused
                                    ? styles.tintColor.color
                                    : styles.text.color;

                                  if (route.name === "Schedule") {
                                    icon = faCalendar;
                                  } else if (route.name === "Information") {
                                    icon = faInfoCircle;
                                  } else if (route.name === "ScavengerHunt") {
                                    icon = faMapSigns;
                                  } else if (route.name === "Interactions") {
                                    icon = faClipboardCheck;
                                  } else if (route.name === "CheckIn") {
                                    icon = faIdBadge;
                                  } else if (route.name === "Profile") {
                                    icon = faUserCircle;
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
                                        setPastEventOnboardID(hexathon);
                                        AsyncStorage.setItem(
                                          "pastEventOnboardID",
                                          hexathon
                                        );
                                      }}
                                    ></EventOnboarding>
                                  )}
                                ></Stack.Screen>
                              ) : (
                                <Stack.Screen
                                  name="Schedule"
                                  component={
                                    showEventOnboard
                                      ? EventOnboarding
                                      : ScheduleStackScreen
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
                              {!showCheckin ? null : (
                                <Stack.Screen
                                  name="Interactions"
                                  component={InteractionsStackScreen}
                                />
                              )}
                              {!showCheckin ? null : (
                                <Stack.Screen
                                  name="CheckIn"
                                  component={CheckInStackScreen}
                                />
                              )}
                              <Stack.Screen
                                name="Profile"
                                component={ProfileStackScreen}
                              />
                            </Tab.Navigator>
                          </NavigationContainer>
                        </>
                      );
                    } else {
                      return (
                        <SplashScreen
                          grow={true}
                          onGrowDone={() => setScheduleModal(true)}
                        />
                      );
                    }
                  }}
                </HackathonContext.Consumer>
              </HackathonProvider>
            );
          }}
        </AuthContext.Consumer>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
