import { TOGGLE_STAR, TOGGLE_STAR_SCHEDULE, SET_EVENTS } from './HackathonActionTypes'
import { turnToEst } from "../../cms/DataHandler";

import AsyncStorage from "@react-native-community/async-storage"
import PushNotification from "react-native-push-notification"

export const initialValue = {

}

export function hackathonReducer(state, action) {
    switch (action.type) {
        case TOGGLE_STAR:
            return { ...state, 'starredIds': toggleStarred(state.starredIds, action.value) }
        case TOGGLE_STAR_SCHEDULE :
            return { ...state, 'isStarSchedule': !state.isStarSchedule }
        case SET_EVENTS:
            return { ...state, 'events' : setEvents(action.value)}
        default:
            return state
    }
}

function setEvents(events) {
    return events
}

function toggleStarred(starredIds, event) {
    const toggleEventId = event.id;

    const isNowStarred = starredIds.indexOf(toggleEventId) == -1;

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
        const newStarred = [...starredIds, toggleEventId]
        AsyncStorage.setItem("starredIds", JSON.stringify(starredIds));
        return newStarred;
    } else {
        // cancel notification if previously starred
        PushNotification.cancelLocalNotifications({
            id: eventIdNumber + "",
        });

        // remove from starred state, then update storage
        const newStarred = starredIds.filter((id) => id !== toggleEventId);
        AsyncStorage.setItem("starredIds", JSON.stringify(starredIds));
        return newStarred;
    }
};