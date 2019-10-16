import React, { Component } from "react";
import { Text, Alert } from "react-native";
import firebase from "react-native-firebase";
import BackgroundFetch from "react-native-background-fetch";
import { StarContext } from "../App";

const events = {
    // event_2: {
    //     id: 0,
    //     name: "event 2.",
    //     date: new Date().getDate(),
    //     timeStart: new Date().getTime() + 5 * 60 * 1000,
    //     timeEnd: new Date().getTime() + 15 * 60 * 1000 + 1000
    // },
    // event_4: {
    //     id: 1,
    //     name: "event 4.",
    //     date: new Date().getDate(),
    //     timeStart: new Date().getTime() + 15 * 60 * 1000,
    //     timeEnd: new Date().getTime() + 15 * 60 * 1000 + 1000
    // },
    // event_5: {
    //     id: 2,
    //     name: "event 5.",
    //     date: new Date().getDate(),
    //     timeStart: new Date().getTime() + 17 * 60 * 1000,
    //     timeEnd: new Date().getTime() + 17 * 60 * 1000 + 1000
    // }
};

// TODO: don't spam
const sendLocalAlerts = (events) => {
    if (events.length === 0) return;
    if (events.length === 1) {
        const event = events[0]
        const startTime = event.startTime.format("hh:mm");
        if (event.area) {
            Alert.alert(event.title, `Your event begins at ${startTime} in ${event.area}.`);
        } else {
            Alert.alert(event.title, `Your event begins at ${startTime}.`);
        }
        return;
    }
    const eventStrings = events.map(e => `${event.title} starts at ${event.startTime.format("hh:mm")}${event.area ? " in " + event.area : "."}`)
    const body = eventStrings.join('\n');
    Alert.alert("Upcoming events", body);
};

const sendRemoteAlert = (title, body) => {
    Alert.alert(title, body);
}

// TODO pass along local event info somehow - through cms context?
// Plan for cms - fetch every 15 minutes
class Notifications extends Component<Props> {

    static contextType = StarContext;

    constructor(props) {
        super(props);
        firebase.messaging().subscribeToTopic("all");
        // console.log("Subscribed to topic");
        // console.log("Checking Status");
        this.checkStatus();
        this.checkPermissions();

        // let curr = new Date();
        // Object.keys(events).forEach(event => {
        //     if (events[event.toString()].date == curr.getDate()) {
        //         if (
        //             events[event].timeStart - curr.getTime() <=
        //                 15 * 60 * 1000 &&
        //             events[event].timeStart - curr.getTime() >= 0
        //         ) {
        //             showAlert(event, "Starting soon!");
        //         }
        //     }
        // });
    }

    async checkStatus() {
        BackgroundFetch.status(status => {
            switch (status) {
                case BackgroundFetch.STATUS_RESTRICTED:
                    console.log("BackgroundFetch restricted");
                    break;
                case BackgroundFetch.STATUS_DENIED:
                    console.log("BackgroundFetch denied");
                    break;
                case BackgroundFetch.STATUS_AVAILABLE:
                    console.log("BackgroundFetch is enabled");
                    break;
            }
        });
    }

    localNotifs() {
        console.log("Checking schedule");
        BackgroundFetch.configure(
            {
                minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
                // Android options
                stopOnTerminate: false,
                startOnBoot: true,
                requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NONE, // Default
                requiresCharging: false, // Default
                requiresDeviceIdle: false, // Default
                requiresBatteryNotLow: false, // Default
                requiresStorageNotLow: false // Default
            },
            () => {
                console.log("[js] Received background-fetch event");
                // Required: Signal completion of your task to native code
                // If you fail to do this, the OS can terminate your app
                // or assign battery-blame for consuming too much background-time
                let curr = new Date();
                console.log("checking background events");
                Object.keys(events).forEach(event => {
                    if (events[event.toString()].date == curr.getDate()) {
                        if (
                            events[event].timeStart - curr.getTime() <=
                                15 * 60 * 1000 &&
                            events[event].timeStart - curr.getTime() >= 0
                        ) {
                            showAlert(event, "Starting Soon!");
                        }
                    }
                });
                BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
            },
            error => {
                console.log("[js] RNBackgroundFetch failed to start");
            }
        );
    }

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

    setupNotifications() {
        this.localNotifs();
        this.remoteNotificationListener = firebase
            .notifications()
            .onNotification((notification) => {
                // Process your notification as required
                const { title, body } = notification;

                if (
                    Object.keys(events).some(event => {
                        if (!notification.data.tags) {
                            return false;
                        }
                        if (notification.data.tags.includes(event)) {
                            return true;
                        }
                    })
                ) {
                    showAlert(title, body);
                }
            });
    }

    listener() {
        this.remoteNotificationListener();
    }
}

export default Notifications;
