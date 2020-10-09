import moment from "moment";

export const daysAvailable = ["friday", "saturday", "sunday"];

export function parseDate(date) {
  // parse iso-formatted string as local time
  if (!date) return "";
  let localString = date;
  if (date.slice(-1).toLowerCase() === "z") {
    localString = date.slice(0, -1);
  }
  return moment(localString);
}

export function getDaysForEvent(events) {
  var days = [];

  for (event of events) {
    if (event && event.startDay) {
      const day = parseDate(event.startDay).format("dddd").toLowerCase();

      if (days.indexOf(day) == -1) {
        days.push(day);
      }
    }
  }

  return daysAvailable.filter((dayString) => days.indexOf(dayString) != -1);
}

export function getEventsHappeningNow(events) {
  return getEventsForDay(events).filter((event) => isEventHappeningNow(event));
}

export function sortEventsByStartTime(events) {
  if (events == null) {
    return events;
  }

  return events.sort(function (a, b) {
    return parseDate(a.startDate) - parseDate(b.startDate);
  });
}

export function getEventsForDay(events, day) {
  if (day == null) {
    day = moment().format("dddd").toLowerCase();
  }

  // converts event's start time to a day (saturday, sunday, etc) and sees if it matches the string
  return events.filter((event) => {
    if (event && event.startDate) {
      return parseDate(event.startDate).format("dddd").toLowerCase() == day;
    }
    return false;
  });
}

export function getCurrentDayIndex(events) {
  const todayString = moment().format("dddd").toLowerCase();

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

  // TODO: just for testing
  // return event.name === "Bob Ross Painting";

  return (
    parseDate(event.startDate).format("dddd").toLowerCase() ==
      moment().format("dddd").toLowerCase() &&
    moment() > parseDate(event.startDate) &&
    moment() < parseDate(event.endDate)
  );
}
