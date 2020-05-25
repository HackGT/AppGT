import moment from "moment";

export const colors = {
  important: "#2CDACF",
  food: "#C866F5",
  workshop: "#786CEB",
  speaker: "#FF586C",
  minievent: "#FF8D28",
  none: "#C3C3C3",
};

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
    if (event && event.start_time) {
      const day = parseDate(event.start_time)
        .format("dddd")
        .toLowerCase();

      if (days.indexOf(day) == -1) {
        days.push(day);
      }
    }
  }

  return days.filter((dayString) => daysAvailable.indexOf(dayString) != -1);
}

export function getEventsHappeningNow(events) {
  return getEventsForDay(events).filter((event) => isEventHappeningNow(event));
}

export function sortEventsByStartTime(events) {
  return events.sort(function(a, b) {
    return parseDate(a.start_time) - parseDate(b.start_time);
  });
}

export function getEventsForDay(events, day) {
  if (day == null) {
    day = moment()
      .format("dddd")
      .toLowerCase();
  }

  // converts event's start time to a day (saturday, sunday, etc) and sees if it matches the string
  return events.filter((event) => {
    if (event && event.start_time) {
      return (
        parseDate(event.start_time)
          .format("dddd")
          .toLowerCase() == day
      );
    }
    return false;
  });
}

// adds timeblocks between new start times for events
export function getTimeblocksForDay(events, day) {
  timeblocksEvents = [];
  var lastStartTime = null;

  // go through all events for the current day, if there is a difference between the current event and last event, add a new time in between them
  for (event of getEventsForDay(events, day)) {
    if (event && event.start_time) {
      const startTimeString = parseDate(event.start_time).format("hh:mm A");

      if (startTimeString != lastStartTime) {
        timeblocksEvents.push({ time: startTimeString, event: event });
        lastStartTime = startTimeString;
      }
      timeblocksEvents.push(event);
    }
  }

  return timeblocksEvents;
}

export function isEventHappeningNow(event) {
  // time blocks put the event within {time: timeString, event: event}
  if (event != null && event.event != null) {
    event = event.event;
  }

  if (event == null || event.start_time == null || event.end_time == null) {
    return false;
  }

  return (
    parseDate(event.start_time)
      .format("dddd")
      .toLowerCase() ==
      moment()
        .format("dddd")
        .toLowerCase() &&
    moment() > parseDate(event.start_time) &&
    moment() < parseDate(event.end_time)
  );
}
