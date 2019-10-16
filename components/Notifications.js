import React, { Component } from "react";
import { Alert } from "react-native";
import firebase from "react-native-firebase";
import BackgroundFetch from "react-native-background-fetch";
import moment from "moment-timezone";

// TODO: don't spam
const sendRemoteAlert = (title, body) => {
    Alert.alert(title, body);
}

// TODO test offline
// TODO fetch cms every 15 minutes
class Notifications extends Component<Props> {

    constructor(props) {
        super(props);
        firebase.messaging().subscribeToTopic("all");
        console.log("Subscribed to topic");
        console.log("Checking Status");
        this.checkStatus();
        this.checkPermissions();
        this.state = {
            eventData: props.eventData, // maintain a local copy for background thread?
            starredItems: props.starredItems
        };
        this.runNotifications();
    }

    componentDidUpdate(prevProps) {
        const { eventData: oldData } = prevProps;
        const { eventData: newData } = this.props;
        if (newData.length !== oldData.length) { // fragile diff
            this.setState({
                eventData: this.props.eventData
            }, this.sendLocalAlerts); // if we've received new info, do another sanity check about events (TODO don't redundantly notify by caching notified in state)
        }
    }

    sendLocalAlerts = () => {
        const { starredItems } = this.props;
        const { eventData } = this.state; // maybe we don't need this in state, but not sure
        const now = moment();
        const events = eventData.filter((event, index) => {
            return (Math.abs(now.diff(event.startTime, "minutes")) <= 15);
        }).filter(event => event.id in starredItems && starredItems[event.id])
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
        const eventStrings = events.map(event => `${event.title} starts at ${event.startTime.format("hh:mm")}${event.area ? " in " + event.area : "."}`)
        const body = eventStrings.join('\n\n');
        Alert.alert("Upcoming events", body);
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
        console.log("Launching background fetch");
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
                console.log("checking background events");
                this.sendLocalAlerts();
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

    runNotifications() {
        this.localNotifs();
        this.remoteNotificationListener = firebase
            .notifications()
            .onNotification((notification) => {
                // Process your notification as required
                const { title, body } = notification;
                sendRemoteAlert(title, body);
            });
    }

    componentWillUnmount() {
        this.remoteNotificationListener();
    }

    render() {
        return this.props.children;
    }
}

export default Notifications;
