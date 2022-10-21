import { DateTime } from "luxon";

export function getStartEndTime(startDate, endDate) {
  const startTime = DateTime.fromISO(startDate, {
    zone: "America/New_York",
  }).toLocaleString(DateTime.TIME_SIMPLE);

  const endTime = DateTime.fromISO(endDate, {
    zone: "America/New_York",
  }).toLocaleString(DateTime.TIME_SIMPLE);

  return { startTime, endTime };
}
