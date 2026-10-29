/* Compatibility only. Active source: marketing/content-plan.json. */
export const START_DATE = "2026-11-02";
export function dateFor(i) {
  const dt = new Date(Date.UTC(2026,10,2+i));
  return { iso:dt.toISOString().slice(0,10),day:dt.getUTCDate(),month:dt.toLocaleString('en',{month:'short',timeZone:'UTC'}),year:dt.getUTCFullYear(),weekday:dt.toLocaleString('en',{weekday:'long',timeZone:'UTC'}),label:dt.toLocaleString('en',{weekday:'long',day:'numeric',month:'short',timeZone:'UTC'}) };
}
export function shortFor(i) { const d=dateFor(i); return d.day+' '+d.month; }
export function weekdayFor(i) { return dateFor(i).weekday; }
