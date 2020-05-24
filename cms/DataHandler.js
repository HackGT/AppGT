import moment from "moment";

export const colors = {
  important: "#2CDACF",
  food: "#C866F5",
  workshop: "#786CEB",
  speaker: "#FF586C",
  minievent: "#FF8D28",
  none: "#C3C3C3",
};

export function parseDate(date) {
  // parse iso-formatted string as local time
  if (!date) return "";
  let localString = date;
  if (date.slice(-1).toLowerCase() === "z") {
    localString = date.slice(0, -1);
  }
  return moment(localString);
}

// converts all events into a object that is sorted by time and able to be fetched by days
// for example: events -> { friday: [sorted events on friday], saturday: [sorted events on saturday], etc. }
// this is used for schedule tab, whenever
export function createEventsTimeblocks(days, events) {
  // [9:30: events, 10:00: events, 10:30: events]
  // []
}

// creates a array of the events that are happening currently by compring start and end times for the current date
export function getEventsHappeningNow(events) {}
