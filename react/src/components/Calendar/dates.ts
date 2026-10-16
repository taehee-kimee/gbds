/*
 * Calendar date math on local calendar days. Every Date here is normalised to local midnight,
 * so comparisons never depend on the time of day or the time zone offset.
 */

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
}

/** Adds months, clamping the day so Jan 31 + 1 month is Feb 28/29, not Mar 3. */
export function addMonths(d: Date, n: number): Date {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1)
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), lastDay))
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

/** Negative when a is before b, 0 on the same day. */
export function compareDays(a: Date, b: Date): number {
  return startOfDay(a).getTime() - startOfDay(b).getTime()
}

export function clampDay(d: Date, min?: Date, max?: Date): Date {
  if (min && compareDays(d, min) < 0) return startOfDay(min)
  if (max && compareDays(d, max) > 0) return startOfDay(max)
  return d
}

/**
 * The weeks shown for one month: whole weeks from the week containing the 1st to the week containing
 * the last day. 4–6 rows, as Figma shows only the rows a month needs.
 */
export function monthWeeks(month: Date, weekStartsOn: number): Date[][] {
  const first = startOfMonth(month)
  const offset = (first.getDay() - weekStartsOn + 7) % 7
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0)
  const days = offset + last.getDate()
  const rows = Math.ceil(days / 7)
  const start = addDays(first, -offset)
  return Array.from({ length: rows }, (_, r) => Array.from({ length: 7 }, (_, c) => addDays(start, r * 7 + c)))
}

/** First year of the 12-year page that holds `year` — Figma shows 2019–2030 for 2026 (the year sits 8th). */
export function yearPageStart(year: number): number {
  return year - 7
}
