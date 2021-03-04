import moment, { utc } from "moment-timezone";

export const daysAvailable = ["friday", "saturday", "sunday"];

// TODO: in cms, dates are stored in UTC+00 which isn't EST, so manually convert date for now
function turnToEst(date) {
  return moment.utc(date).subtract(-4, "hours").tz("America/New_York");
}

export function getDaysForEvent(events) {
  var days = [];

  for (event of events) {
    if (event && event.startDate) {
      const day = turnToEst(event.startDate).format("dddd").toLowerCase();

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
    return turnToEst(a.startDate) - turnToEst(b.startDate);
  });
}

export function getEventsForDay(events, day) {
  if (day == null) {
    day = moment().tz("America/New_York").format("dddd").toLowerCase();
  }

  // converts event's start time to a day (saturday, sunday, etc) and sees if it matches the string
  return events.filter((event) => {
    if (event && event.startDate) {
      return turnToEst(event.startDate).format("dddd").toLowerCase() == day;
    }
    return false;
  });
}

export function getCurrentDayIndex(events) {
  const todayString = moment()
    .tz("America/New_York")
    .format("dddd")
    .toLowerCase();

  return getDaysForEvent(events).indexOf(todayString);
}

// adds timeblocks between new start times for events
export function getTimeblocksForDay(events, day) {
  timeblocksEvents = [];
  var lastStartTime = null;

  // go through all events for the current day, if there is a difference between the current event and last event, add a new time in between them
  for (event of getEventsForDay(events, day)) {
    if (event && event.startDate) {
      const startTimeString = event.startTime;

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

  for (i = 0; i < timeblocks.length; i++) {
    if (isEventHappeningNow(timeblocks[i])) {
      return i;
    }
  }

  return -1;
}

export function isEventHappeningNow(event) {
  // time blocks put the event within {time: timeString, event: event}
  if (event != null && event.event != null) {
    event = event.event;
  }

  if (event == null || event.startDate == null || event.endDate == null) {
    return false;
  }

  const estStart = turnToEst(event.startDate);
  const estEnd = turnToEst(event.endDate);

  return (
    estStart.format("dddd").toLowerCase() ==
      moment().tz("America/New_York").format("dddd").toLowerCase() &&
    moment() > estStart &&
    moment() < estEnd
  );
}
