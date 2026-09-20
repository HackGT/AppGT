const EST_TZ = 'America/New_York';

function formatTime(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: EST_TZ,
  }).format(new Date(dateStr));
}

function getDayName(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    timeZone: EST_TZ,
  })
    .format(new Date(dateStr))
    .toLowerCase();
}

export function getStartEndTime(startDate: string, endDate: string) {
  const startTime = formatTime(startDate);
  const endTime = formatTime(endDate);
  return { startTime, endTime };
}

export const daysAvailable = ['friday', 'saturday', 'sunday'];

export function getDaysForEvent(events: any[]): string[] {
  const days: string[] = [];
  for (const event of events) {
    if (event && event.startDate) {
      const day = getDayName(event.startDate);
      if (!days.includes(day)) {
        days.push(day);
      }
    }
  }
  return daysAvailable.filter((d) => days.includes(d));
}

export function getEventsHappeningNow(events: any[]): any[] {
  return getEventsForDay(events).filter((event) => isEventHappeningNow(event));
}

export function sortEventsByStartTime(events: any[]): any[] {
  if (!events) return events;
  return events.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));
}

export function getEventsForDay(events: any[], day?: string): any[] {
  if (!day) {
    day = new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: EST_TZ })
      .format(new Date())
      .toLowerCase();
  }
  return events.filter((event) => {
    if (event && event.startDate) {
      return getDayName(event.startDate) === day;
    }
    return false;
  });
}

export function getCurrentDayIndex(events: any[]): number {
  const todayString = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    timeZone: EST_TZ,
  })
    .format(new Date())
    .toLowerCase();
  return getDaysForEvent(events).indexOf(todayString);
}

export function getTimeblocksForDay(events: any[], day: string): any[] {
  const timeblocksEvents: any[] = [];
  let lastStartTime: string | null = null;

  for (const event of getEventsForDay(events, day)) {
    if (event && event.startDate) {
      const startTimeString = formatTime(event.startDate);
      if (startTimeString !== lastStartTime) {
        timeblocksEvents.push({ time: startTimeString, event });
        lastStartTime = startTimeString;
      }
      timeblocksEvents.push(event);
    }
  }
  return timeblocksEvents;
}

export function getCurrentEventIndex(events: any[], day: string): number {
  const timeblocks = getTimeblocksForDay(events, day);
  for (let i = 0; i < timeblocks.length; i++) {
    if (isEventHappeningNow(timeblocks[i])) {
      return i;
    }
  }
  return -1;
}

export function isEventHappeningNow(event: any): boolean {
  if (!event || !event.startDate || !event.endDate) return false;
  const now = Date.now();
  return now >= Date.parse(event.startDate) && now <= Date.parse(event.endDate);
}
