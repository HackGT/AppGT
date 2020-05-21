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
