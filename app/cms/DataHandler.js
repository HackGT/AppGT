import { DateTime } from "luxon";

export const daysAvailable = ["friday", "saturday", "sunday"];

export function turnToEst(date) {
  return DateTime.fromISO(date).setZone("America/New_York");
}

export function getDaysForEvent(events) {
  var days = [];

  for (const event of events) {
    if (event && event.startDate) {
      const day = DateTime.fromISO(event.startDate, {
        zone: "America/New_York",
      })
        .toFormat("EEEE")
        .toLowerCase();

      if (days.indexOf(day) == -1) {
        days.push(day);
      }
    }
  }

  return daysAvailable.filter((dayString) => days.indexOf(dayString) != -1);
}

export function getEventsHappeningNow(events) {
  return getEventsForDay(events).filter((event) => isEventHappeningNow(event));
  // return events; -- comment line and replace with this to view what's happening now header with all events
}

export function sortEventsByStartTime(events) {
  if (events == null) {
    return events;
  }

  return events.sort(function (a, b) {
    return Date.parse(a.startDate) - Date.parse(b.startDate);
  });
}

export function getEventsForDay(events, day) {
  if (day == null) {
    day = DateTime.now().toFormat("EEEE").toLowerCase();
  }

  // converts event's start time to a day (saturday, sunday, etc) and sees if it matches the string
  return events.filter((event) => {
    if (event && event.startDate) {
      return turnToEst(event.startDate).toFormat("EEEE").toLowerCase() == day;
    }
    return false;
  });
}

export function getCurrentDayIndex(events) {
  const todayString = DateTime.now().toFormat("EEEE").toLowerCase();

  return getDaysForEvent(events).indexOf(todayString);
}

// adds timeblocks between new start times for events
export function getTimeblocksForDay(events, day) {
  let timeblocksEvents = [];
  var lastStartTime = null;

  // go through all events for the current day, if there is a difference between the current event and last event, add a new time in between them
  for (const event of getEventsForDay(events, day)) {
    if (event && event.startDate) {
      const startTimeString = turnToEst(event.startDate).toLocaleString(
        DateTime.TIME_SIMPLE
      );

      if (startTimeString != lastStartTime) {
        timeblocksEvents.push({ time: startTimeString, event: event });
        lastStartTime = startTimeString;
      }
      timeblocksEvents.push(event);
    }
  }

  return timeblocksEvents;
}

export function getCurrentEventIndex(events, day) {
  const timeblocks = getTimeblocksForDay(events, day);

  for (let i = 0; i < timeblocks.length; i++) {
    if (isEventHappeningNow(timeblocks[i])) {
      return i;
    }
  }

  return -1;
}

export function isEventHappeningNow(event) {
  if (event == null || event.startDate == null || event.endDate == null) {
    return false;
  }

  const currentDate = new Date();

  return (
    currentDate >= Date.parse(event.startDate) &&
    currentDate <= Date.parse(event.endDate)
  );
}
