import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { WebView } from 'react-native-webview';
import UserAgent from 'react-native-user-agent'
import { fetchHackathonData } from "./cms";
import { HackathonContext, AuthContext, ThemeContext } from "./context";
import { StatusBar, Modal, SafeAreaView, Text, View } from "react-native";
import { LoginOnboarding } from "./onboarding/LoginOnboarding";
import SplashScreen from "./components/SplashScreen";
import { EventOnboarding } from "./onboarding/EventOnboarding";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faInfoCircle, faCalendar, faMapSigns, faClipboardCheck } from "@fortawesome/free-solid-svg-icons";
import Logo from "./assets/Logo";
import AsyncStorage from "@react-native-community/async-storage";
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
import { initializeApp } from 'firebase/app';
import { getAuth, GithubAuthProvider, signInWithPopup } from "firebase/auth";

import { 
  ScheduleStackScreen, 
  InformationStackScreen, 
  ScavengerHuntStackScreen, 
  CheckInStackScreen 
} from "./stacks"

import { ThemeProvider, HackathonProvider, AuthProvider } from "./state_management";

// old groundtruth auth
// const authUrl = "https://login.hack.gt";
const authUrl = "https://login.hexlabs.org/?redirect=https://mobile.hexlabs.org"


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

// for editing styles shown on tabs, see https://reactnavigation.org/docs/tab-based-navigation
const Tab = createBottomTabNavigator();

const app = initializeApp({
  apiKey: "AIzaSyCsukUZtMkI5FD_etGfefO4Sr7fHkZM7Rg",
  authDomain: "hexlabs-cloud.firebaseapp.com",
});

const auth = getAuth(app);
const provider = new GithubAuthProvider();

function App(props) {

  // event data
  const [hackathon, setHackathon] = useState(null)
  const [eventTypes, setEventTypes] = useState([])
  const [types, setTypes] = useState([])
  const [starredIds, setStarredIds] = useState([])
  const [isStarSchedule, setIsStarSchedule] = useState(false)

  // used for finding current state of screen for loading/login components
  const [isFetchingData, setIsFetchingData] = useState(true)
  const [isFetchingLogin, setIsFetchingLogin] = useState(true)
   // login data
  const [showLogin, setShowLogin] = useState(false); 
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)

  // TODO: temporary, onboarding login should show when user is null. login is disabled so remove this whn fixed
  const [skipOnboarding, setSkipOnboarding] = useState(false)
  const [scheduleModal, setScheduleModal] = useState(false)
  const [pastEventOnboardID, setPastEventOnboardID] = useState(null)


  const configAsyncStorage = () => {
    AsyncStorage.getItem(
      "starredIds",
      (error, result) =>
        result && setStarredIds(JSON.parse(result))
    );

    AsyncStorage.getItem(
      "pastEventOnboardID",
      (error, result) => result && setPastEventOnboardID(result)
    );

    AsyncStorage.getItem("isStarSchedule", (error, result) => {
      result &&
        setIsStarSchedule(result === true ? true : false)
      console.log(isStarSchedule)
    });

    AsyncStorage.getItem("userData", (error, result) => {
      if (result) {
        setUser(JSON.parse(result))
      }
      setIsFetchingLogin(false)
    });

    AsyncStorage.getItem("localEventTypeData", (error, result) => {
      if (result) {
        const eventTypes = JSON.parse(result);
        if (eventTypes != null) {
          setEventTypes(eventTypes)
        }
      }
    });

    AsyncStorage.getItem("localHackathonData", (error, result) => {
      if (result) {
        console.log("Hackathon found locally.");
        const hackathon = JSON.parse(result);

        if (hackathon != null) {
          setHackathon(hackathon)
          setIsFetchingData(false)
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

          setEventTypes(eventTypes)
          setHackathon(hackathon)
          setIsFetchingData(false)
        } else {
          // if still loading, present error asking for retry
        }
      });
    });
  }

  useEffect(() => {
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

    configAsyncStorage()

  }, [])

  useEffect(() => {
    AsyncStorage.setItem(
      "isStarSchedule",
      isStarSchedule == true ? "true" : "false"
    );
  }, [isStarSchedule])

  // useEffect(() => {
  //   console.log('toggling starred ids', starredIds)
  //   updateStorage()
  // }, [starredIds])

  // const updateStorage = () => {
  //   AsyncStorage.setItem("starredIds", JSON.stringify(starredIds));
  // }

  // Not used anymore, but keeping just in case (look at HackathonReducer.js)
  // const toggleIsStarSchedule = () => {
  //   setIsStarSchedule(!isStarSchedule)
  // };

  // Not used anymore, but keeping just in case (look at HackathonReducer.js)
  // const toggleStarred = (event) => {
  //   const toggleEventId = event.id;

  //   const isNowStarred = starredIds.indexOf(toggleEventId) == -1;

  //   let eventIdNumber = toggleEventId.replace(/\D/g, "").substring(1, 5);
  //   eventIdNumber = Number.parseInt(eventIdNumber);

  //   if (isNowStarred) {
  //     // schedule notification for 15 min before
  //     PushNotification.localNotificationSchedule({
  //       channelId: "hackgt-channel",
  //       id: eventIdNumber + "", // map string into a unique id for cancellation
  //       message: event.name + " is starting in 15 minutes! ",
  //       date: new Date(turnToEst(event.startDate).toDate() - 15 * 60 * 1000), // schedule it for its time - 15 minutes
  //     });

  //     // add to starred state, then update storage
  //     setStarredIds([...starredIds, toggleEventId]);

  //     return true;
  //   } else {
  //     // cancel notification if previously starred
  //     PushNotification.cancelLocalNotifications({
  //       id: eventIdNumber + "",
  //     });

  //     // remove from starred state, then update storage
  //     setStarredIds(starredIds.filter((id) => id !== toggleEventId));
  //     return false;
  //   }
  // };

  const logout = async () => {
    fetch(`${authUrl}/api/user/logout`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }).then((response) => {
      AsyncStorage.removeItem("accessToken");
      AsyncStorage.removeItem("userData");
      setAccessToken("")
      setUser(null)
    });
  };

  // groundtruth login
  // const login = async () => {
  //   try {
  //     const result = await authorize(config);
  //     console.log('Login result: ', result, result['accessToken'], result.accessToken)
  //     setAccessToken(result.accessToken)
  //     fetchUserDetails(result.accessToken);
  //     AsyncStorage.setItem("accessToken", result.accessToken);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // webview login
  // const login = async () => {
  //   try {
  //     setShowLogin(!showLogin);
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const login = async () => {
    signInWithPopup(auth, provider)
      .then((userCredential) => {
        setCookieAndRedirect(userCredential, navigate, location);
      })
      .catch((error) => {
        handleLoginError(error);
      });
  }

  const fetchUserDetails = async (accessToken) => {
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
        setUser(user)
      });
  };

  const Stack = createStackNavigator();

  console.log(hackathon)

  // TODO: login re-enable
  const needsLogin = user == null;
  const isLoading = isFetchingData || isFetchingLogin;

  const splashGrowModal = (
    <Modal animationType="none" transparent={true}>
      <SplashScreen
        grow={true}
        onGrowDone={() => setScheduleModal(true)}
      />
    </Modal>
  );

  // until app is done loading data, show the splash screen
  if (isLoading) {
    return (
      <ThemeContext.Provider
        value={{
          theme: props.theme,
          dynamicStyles: props.styles,
        }}
      >
        <SplashScreen
          grow={true}
          onGrowDone={() => setScheduleModal(true)}
        />
      </ThemeContext.Provider>
    );
  }
  console.log('AGENT: ', UserAgent.getUserAgent())
  // if user needs to login, do splash grow/fade out animation then show login
  if (needsLogin) {
    return (
      <ThemeContext.Provider
        value={{
          theme: props.theme,
          dynamicStyles: props.styles,
        }}
      >
        <AuthContext.Provider
          value={{
            user: user,
            login: login,
            logout: logout,
          }}
        >
          {!scheduleModal && splashGrowModal}
          <LoginOnboarding />
          <Modal visible={showLogin}>
            <SafeAreaView style={{ flex: 1 }}>
              {/* Use the following url with Chrome on Iphone for userAgent: https://www.whatismybrowser.com/guides/the-latest-user-agent/chrome */}
              <WebView
                source={{uri: authUrl }}
                userAgent='Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/105.0.5195.129 Mobile/15E148 Safari/604.1'
                javaScriptCanOpenWindowsAutomatically={true}
                javaScriptEnabled={true}
                onNavigationStateChange={(event) => {
                  console.log(event);
                  if (event.url.startsWith('https://mobile.hexlabs.org')) {// event.title === 'OAuth application authorized') {
                    const splitUrl = event.url.split('?')
                    if (splitUrl[1]) {
                      const params = splitUrl[1].split('&')
                      const codeParam = params.find(param => param.startsWith('idToken'))
                      if (codeParam) {
                        const authCode = codeParam.split('=')[1]
                        console.log('AuthCode: ', authCode)
                        setShowLogin(false)
                      }
                    }
                  }
                }}
              />
            </SafeAreaView>
            <View style={{ height: 1, backgroundColor: '#F3F3F3'}}/>
            <SafeAreaView>
            <View style={{ paddingTop: 10 }}>
              <Logo height={50} style={{alignSelf: 'center'}}/>
            </View>
            </SafeAreaView>
          </Modal>
        </AuthContext.Provider>
      </ThemeContext.Provider>
    );
  }

  const showEventOnboard = pastEventOnboardID !== hackathon.id;

  // if logging in with a hexlabs email
  const showCheckin = /@hexlabs.org\s*$/.test(user.email)

  // once logged in and all data is loaded, present full app after grow animation
  return (
    <ThemeContext.Provider
      value={{
        theme: props.theme,
        dynamicStyles: props.styles,
      }}
    >
      <HackathonProvider
        initialValue={{
          hackathon: hackathon,
          eventTypes: eventTypes,
          starredIds: starredIds,
          isStarSchedule: isStarSchedule,
        }}
      >
        <AuthContext.Provider
          value={{
            user: user,
            login: login,
            logout: logout,
          }}
        >
          {!scheduleModal && splashGrowModal}
          <NavigationContainer>
            <StatusBar
              backgroundColor={
                props.styles.tabBarBackgroundColor.backgroundColor
              }
              barStyle={
                props.theme == "dark" ? "light-content" : "dark-content"
              }
            />

            {/* TODO: when need tab bottom bar, convert "Stack." to "Tab." and remoe headerMode="none" and finally add different screens below */}
            <Tab.Navigator
              // headerMode="none"
              tabBarOptions={{
                activeTintColor: props.styles.tintColor.color,
                style: props.styles.tabBarBackgroundColor,
                showLabel: false,
              }}
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let icon;
                  const selectedColor = focused
                    ? props.styles.tintColor.color
                    : props.styles.text.color;

                  if (route.name === "Schedule") {
                    icon = faCalendar;
                  } else if (route.name === "Information") {
                    icon = faInfoCircle;
                  } else if (route.name === "ScavengerHunt") {
                    icon = faMapSigns
                  } else if (route.name === "CheckIn") {
                    icon = faClipboardCheck;
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
                        setPastEventOnboardID(hackathon.id)
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
      </HackathonProvider>
    </ThemeContext.Provider>
  );
}

export default withThemeHook(App);

function withThemeHook(App) {
  return function Hook(props) {
    const theme = useDarkModeContext();
    const styles = useDynamicStyleSheet(dynamicStyles);
    return <App {...props} theme={theme} styles={styles} />;
  };
}
