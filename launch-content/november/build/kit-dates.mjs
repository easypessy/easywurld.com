/* Easywurld social kit — shared calendar.
   One start date drives the app, the month doc and the dated CSV, so they
   can never drift apart. Change START_DATE and rebuild. */

export const START_DATE = "2026-11-01"; // Sunday — November kit

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const WEEKDAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];

/**
 * dateFor(i) -> the calendar date of plan day (i + 1).
 * Returns iso, day, month, year, weekday and label.
 */
export function dateFor(i) {
  const [y, m, d] = START_DATE.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + i));
  const month = MONTHS[dt.getUTCMonth()];
  const day = dt.getUTCDate();
  const weekday = WEEKDAYS[dt.getUTCDay()];
  const iso = dt.toISOString().slice(0, 10);
  return {
    iso,
    day,
    month,
    year: dt.getUTCFullYear(),
    weekday,
    label: `${weekday} ${day} ${month}`,
  };
}

/** "17 Nov" */
export function shortFor(i) {
  const d = dateFor(i);
  return `${d.day} ${d.month}`;
}

/** "Monday" */
export function weekdayFor(i) {
  return dateFor(i).weekday;
}

export { MONTHS, WEEKDAYS };
