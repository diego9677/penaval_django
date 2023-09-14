
enum FirsDayOfWeek {
  Sun = 0,
  Mon = 1,
  Tue = 2,
  Wed = 3,
  Thu = 4,
  Fri = 5,
  Sat = 6,
}

export enum Interval {
  Day = 'day',
  Week = 'week',
  Month = 'month',
}

export interface BeginEndResult {
  begin: Date;
  end: Date;
}

export const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const dateTimeFormat = new Intl.DateTimeFormat('es', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

export const timeFormat = new Intl.DateTimeFormat('es', { hour: '2-digit', minute: '2-digit' });

export const dateFormat = new Intl.DateTimeFormat('es', { year: 'numeric', month: '2-digit', day: '2-digit' });

function firstDayOfWeek(date: Date, firstDayOfWeekIndex: FirsDayOfWeek) {
  const dayOfWeek = date.getDay();
  const diff = dayOfWeek >= firstDayOfWeekIndex ? dayOfWeek - firstDayOfWeekIndex : 6 - dayOfWeek;

  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = (date.getDate() - diff);

  const firstDayOfWeek = new Date(year, month, firstDay, 0, 0, 0);

  // firstDayOfWeek.setDate(date.getDate() - diff);
  // firstDayOfWeek.setHours(0, 0, 0, 0);

  return firstDayOfWeek;
}

function lastDayOfWeek(date: Date, firstDayOfWeekIndex: FirsDayOfWeek) {
  const dayOfWeek = date.getDay();
  const diff = dayOfWeek >= firstDayOfWeekIndex ? dayOfWeek - firstDayOfWeekIndex : 6 - dayOfWeek;

  const year = date.getFullYear();
  const month = date.getMonth();
  const lastDay = (date.getDate() - diff) + 6;

  const lastDayOfWeek = new Date(year, month, lastDay, 23, 59, 59);

  // lastDayOfWeek.setDate((date.getDate() - diff) + 6);
  // lastDayOfWeek.setHours(23, 59, 59, 0);

  return lastDayOfWeek;
}

function firstDayOfMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = 1;
  const firstDayOfMonth = new Date(year, month, day, 0, 0, 0);
  return firstDayOfMonth;
}

function lastDayOfMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // next month
  const day = 0;
  const lastDayOfMonth = new Date(year, month, day, 23, 59, 59);
  return lastDayOfMonth;
}

function startOfDay(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const startOfDay = new Date(year, month, day, 0, 0, 0);
  return startOfDay;
}

function endOfDay(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const endOfDay = new Date(year, month, day, 23, 59, 59);
  return endOfDay;
}

export const getBeginEndFromInterval = (date: Date, interval: Interval) => {
  let result: BeginEndResult = { begin: date, end: date };
  if (interval === Interval.Day) {
    result.begin = startOfDay(date);
    result.end = endOfDay(date);
  } else if (interval === Interval.Week) {
    result.begin = firstDayOfWeek(date, FirsDayOfWeek.Mon);
    result.end = lastDayOfWeek(date, FirsDayOfWeek.Mon);
  } else if (interval === Interval.Month) {
    result.begin = firstDayOfMonth(date);
    result.end = lastDayOfMonth(date);
  }
  return result;
};

export const diffDatesWithTodayInSeconds = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.round(diff / 1000);
  return Math.abs(seconds);
};

export const lastSync = (seconds: number) => {
  if (seconds >= 86400) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    return `hace ${d}d ${h}h`;
  } else if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds / 60) % 60);
    return `hace ${h}h ${m}m`;
  } else if (seconds >= 60) {
    const m = Math.floor((seconds / 60) % 60);
    return `hace ${m}m`;
  } else {
    return 'hace unos seg.';
  }
};

export const parseLastSync = (isoDate: string) => {
  const date = new Date(isoDate);
  const seconds = diffDatesWithTodayInSeconds(date);
  return lastSync(seconds);
};

export const addDays = (date: Date, days: number) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

export const subtractDays = (date: Date, days: number) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - days);
  return newDate;
};