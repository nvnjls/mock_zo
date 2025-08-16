// src/Admin/utils/date.ts
export function startOfWeek(d: Date) {
    const x = new Date(d);
    const day = (x.getDay() + 6) % 7; // Monday=0
    x.setDate(x.getDate() - day);
    x.setHours(0, 0, 0, 0);
    return x;
}
export function endOfWeek(start: Date) {
    const x = new Date(start);
    x.setDate(x.getDate() + 7);
    x.setHours(0, 0, 0, 0);
    return x;
}
export function getWeekDays(start: Date) {
    return Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
    });
}
export function shiftWeek(start: Date, delta: number) {
    const x = new Date(start);
    x.setDate(x.getDate() + 7 * delta);
    return x;
}
export function fmtDateISO(d: Date) {
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    const dd = `${d.getDate()}`.padStart(2, "0");
    return `${y}-${m}-${dd}`;
}
export function fmtDateDisplay(d: Date) {
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, "0");
    const dd = `${d.getDate()}`.padStart(2, "0");
    return `${dd}-${m}-${y}`;
}
export function fmtTime(d: Date) {
    return d.toTimeString().slice(0, 5);
}
export function fmtRange(a: Date, b: Date) {
    const endInclusive = new Date(b);
    endInclusive.setDate(endInclusive.getDate() - 1);
    return `${fmtDateDisplay(a)} – ${fmtDateDisplay(endInclusive)}`;
}
export function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
export function toDateLocal(dateStr: string, timeStr: string) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const [hh, mm] = timeStr.split(":").map(Number);
    return new Date(y, (m - 1), d, hh, mm, 0, 0);
}