import React, { Component } from "react";
// import { AppState, Alert } from "react-native";
import firebase from "react-native-firebase";
import { Alert } from "react-native";
// import BackgroundFetch from "react-native-background-fetch";
// import PushNotification from 'react-native-push-notification';
// import moment from "moment-timezone";

// TODO: don't spam

// TODO test offline
// TODO fetch cms every 15 minutes
class Notifications extends Component<Props> {

    constructor() {
        super();
        // console.log("Checking Status");
        // this.checkStatus();
        this.checkPermissions();
        firebase.messaging().subscribeToTopic("all");
        // this.state = {
        //     eventData: props.eventData, // maintain a local copy for background thread?
        //     starredItems: props.starredItems,
        //     appState: AppState.currentState
        // };
        // this.runNotifications();
        // this.pushNotif = new PushNotifService();
        firebase.messaging().getToken().then(token => {
          console.log(token)
        });

    }

    subscribe(id) {
        if (!id) return;
        // console.log(`sub ${id}`)
        firebase.messaging().subscribeToTopic(id);
    }

    unsubscribe(id) {
        if (!id) return;
        firebase.messaging().unsubscribeFromTopic(id);
    }

    // sendProperNotif = (title, body) => {
    //     const { appState } = this.state;
    //     if (appState === "active") {
    //         Alert.alert(title, body);
    //     } else {
    //         this.pushNotif.sendPush(title, body);
    //     }
    // }

    // componentDidMount() {
    //     AppState.addEventListener('change', this._handleAppStateChange);
    // }

    // componentWillUnmount() {
    //     AppState.removeEventListener('change', this._handleAppStateChange);
    // }

    // _handleAppStateChange = (nextAppState) => {
    //     this.setState({appState: nextAppState});
    // };

    // componentDidUpdate(prevProps) {
    //     const { eventData: oldData } = prevProps;
    //     const { eventData: newData } = this.props;
    //     if (newData.length !== oldData.length) { // fragile diff
    //         this.setState({
    //             eventData: this.props.eventData
    //         }, this.sendLocalAlerts); // if we've received new info, do another sanity check about events (TODO don't redundantly notify by caching notified in state)
    //     }
    // }

    // sendEventAlert = (title, body, id) => {
    //     const { starredItems } = this.props;
    //     if (id in starredItems && starredItems[id]) {
    //         this.sendProperNotif(title, body);
    //     }
    // }

    // sendLocalAlerts = () => {
    //     const { starredItems } = this.props;
    //     const { eventData } = this.state; // maybe we don't need this in state, but not sure
    //     const now = moment();
    //     const events = eventData.filter((event) => {
    //         const difference = now.diff(event.startTime, "minutes");
    //         return difference <= 15 && difference >= -2;
    //     }).filter(event => event.id in starredItems && starredItems[event.id])
    //     if (events.length === 0) return;
    //     let title, body;
    //     if (events.length === 1) {
    //         const event = events[0]
    //         const startTime = event.startTime.format("hh:mm");
    //         title = event.title;
    //         body = `Your event begins at ${startTime}${event.area ? " in " + event.area : ""}.`;
    //     } else {
    //         const eventStrings = events.map(event => `${event.title} starts at ${event.startTime.format("hh:mm")}${event.area ? " in " + event.area : "."}`)
    //         title = "Upcoming events";
    //         body = eventStrings.join('\n\n');
    //     }

    //     this.sendProperNotif(title, body);
    // }

    // async checkStatus() {
    //     BackgroundFetch.status(status => {
    //         switch (status) {
    //             case BackgroundFetch.STATUS_RESTRICTED:
    //                 console.log("BackgroundFetch restricted");
    //                 break;
    //             case BackgroundFetch.STATUS_DENIED:
    //                 console.log("BackgroundFetch denied");
    //                 break;
    //             case BackgroundFetch.STATUS_AVAILABLE:
    //                 console.log("BackgroundFetch is enabled");
    //                 break;
    //         }
    //     });
    // }

    // localNotifs() {
    //     console.log("Launching background fetch");
    //     BackgroundFetch.configure(
    //         {
    //             minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
    //             // Android options
    //             stopOnTerminate: false,
    //             startOnBoot: true,
    //             requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
    //             requiresCharging: false, // Default
    //             requiresDeviceIdle: false, // Default
    //             requiresBatteryNotLow: false, // Default
    //             requiresStorageNotLow: false // Default
    //         },
    //         () => {
    //             console.log("[js] Received background-fetch event");
    //             this.sendLocalAlerts();
    //             BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
    //         },
    //         error => {
    //             console.log("[js] RNBackgroundFetch failed to start");
    //         }
    //     );
    // }

    async checkPermissions() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            console.log("Permissions Enabled");
        } else {
            console.log("Asking for permissions");
            this.askPermissions();
        }
    }

    async askPermissions() {
        try {
            await firebase.messaging().requestPermission();
            console.log("Permissions enabled");
        } catch (error) {
            console.log("User rejected permissions");
        }
    }

    // runNotifications() {
    //     this.localNotifs();
    //     this.remoteNotificationListener = firebase
    //         .notifications()
    //         .onNotification((notification) => {
    //             // We don't need this - firebase is going to push the notification through anyway
    //             // Process your notification as required
    //             // const { title, body, id } = notification;
    //             // if (!body) return;
    //             // if (!id) {
    //             //     this.sendProperNotif(title, body);
    //             //     return;
    //             // }
    //             // this.sendEventAlert(title, body, id);
    //         });
    // }

    // componentWillUnmount() {
    //     this.remoteNotificationListener();
    // }

    // render() {
    //     return this.props.children;
    // }
}


class PushNotifService {

  constructor() {
    this.configure(() => {}, () => {});

    this.lastId = 0;
  }

  configure(onRegister, onNotification, gcm = "") {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: onRegister, //this._onRegister.bind(this),

      // (required) Called when a remote or local notification is opened or received
      onNotification: onNotification, //this._onNotification,

      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
      senderID: gcm,

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true,
    });
  }

  sendPush(title, body) {
    this.lastId++;
    PushNotification.localNotification({
      /* Android Only Properties */
      id: ''+this.lastId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
      bigText: body, // (optional) default: "message" prop
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      ongoing: false, // (optional) set whether this is an "ongoing" notification

      /* iOS and Android properties */
      title: title, // (optional)
      message: body, // (required)
      number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    });
  }

  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }
}

export default Notifications;
