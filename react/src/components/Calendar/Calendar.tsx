import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useRef, useState, type ComponentPropsWithRef, type KeyboardEvent } from "react"

import { Button } from "../Button"
import {
  addDays,
  addMonths,
  clampDay,
  compareDays,
  isSameDay,
  isSameMonth,
  monthWeeks,
  startOfDay,
  startOfMonth,
  yearPageStart,
} from "./dates"
import styles from "./Calendar.module.css"

/** Figma `-> Data style` — the event marker under a date. */
export type CalendarMarker = "published" | "reserved" | "draft"

export type DateRange = { start: Date; end?: Date }

type CommonProps = Omit<ComponentPropsWithRef<"div">, "onChange" | "defaultValue" | "children"> & {
  /** Earliest selectable day. Earlier days, months and years render as Figma Status=disabled. */
  min?: Date
  /** Latest selectable day. */
  max?: Date
  /** Extra rule for unavailable days (e.g. weekends). */
  isDateDisabled?: (date: Date) => boolean
  /** Figma `Data=true` + `-> Data style`. Return a marker to draw a dot under that day. */
  marker?: (date: Date) => CalendarMarker | undefined
  /** Screen-reader names for the markers. Default English. */
  markerLabels?: Record<CalendarMarker, string>
  /** BCP 47 locale for month and weekday names. Default "en-US" (Figma: "Sep", "Su"). */
  locale?: string
  /** 0 = Sunday (Figma), 1 = Monday … */
  weekStartsOn?: number
  /** The month shown first. Default: the selected date's month, else today's. */
  defaultMonth?: Date
  /** Which day is "today" (Figma Type=today). Default: the real today — pass a date to pin it in tests. */
  today?: Date
  /** Figma modal Type=month | year — open on the month or year picker instead of the days. */
  defaultView?: "day" | "month" | "year"
}

/** Figma `Part/Calendar modal` Type=default — pick one day. */
export type SingleCalendarProps = CommonProps & {
  mode?: "single"
  value?: Date | null
  defaultValue?: Date | null
  onChange?: (date: Date) => void
}

/** Figma `Part/Calendar modal` Type=range — pick a start and an end across two months. */
export type RangeCalendarProps = CommonProps & {
  mode: "range"
  value?: DateRange | null
  defaultValue?: DateRange | null
  /** Called on each click: first with `{ start }`, then with `{ start, end }`. */
  onChange?: (range: DateRange) => void
}

export type CalendarProps = SingleCalendarProps | RangeCalendarProps

type View = "day" | "month" | "year"

const defaultMarkerLabels: Record<CalendarMarker, string> = { published: "Published", reserved: "Reserved", draft: "Draft" }

export function Calendar(props: CalendarProps) {
  const {
    mode = "single",
    value: valueProp,
    defaultValue,
    onChange,
    min,
    max,
    isDateDisabled,
    marker,
    markerLabels = defaultMarkerLabels,
    locale = "en-US",
    weekStartsOn = 0,
    defaultMonth,
    today: todayProp,
    defaultView = "day",
    className,
    ...rest
  } = props as CommonProps & {
    mode?: "single" | "range"
    value?: Date | DateRange | null
    defaultValue?: Date | DateRange | null
    onChange?: (v: Date & DateRange) => void
  }

  const today = startOfDay(todayProp ?? new Date())

  // Controlled when `value` is passed (null = nothing selected), otherwise internal.
  const [inner, setInner] = useState(defaultValue ?? null)
  const value = valueProp !== undefined ? valueProp : inner
  const single = mode === "single" ? ((value as Date | null) ?? null) : null
  const range = mode === "range" ? ((value as DateRange | null) ?? null) : null

  const [month, setMonth] = useState(() => startOfMonth(defaultMonth ?? single ?? range?.start ?? today))
  const [view, setView] = useState<View>(defaultView)
  const [yearStart, setYearStart] = useState(() => yearPageStart(month.getFullYear()))
  const [focused, setFocused] = useState(() => single ?? range?.start ?? (isSameMonth(today, month) ? today : month))
  // Range preview (review 6): the day under the pointer or keyboard focus while only the start is chosen.
  const [hovered, setHovered] = useState<Date | null>(null)
  const preview = range && !range.end && hovered && !isSameDay(hovered, range.start) ? hovered : null
  const [previewLo, previewHi] = preview && range ? (compareDays(preview, range.start) < 0 ? [preview, range.start] : [range.start, preview]) : [null, null]
  const moveFocus = useRef(false)
  const gridRef = useRef<HTMLDivElement>(null)

  const months = mode === "range" ? [month, addMonths(month, 1)] : [month]
  // The one day reachable with Tab: the focused day if it is on screen, else the 1st of the month.
  const tabTarget = months.some((m) => isSameMonth(m, focused)) ? focused : month

  useEffect(() => {
    if (!moveFocus.current) return
    moveFocus.current = false
    gridRef.current?.querySelector<HTMLElement>('[data-focus-target="true"]')?.focus()
  })

  const fmt = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, options)
  const monthShort = fmt({ month: "short" })
  const monthLong = fmt({ month: "long", year: "numeric" })
  const fullDate = fmt({ dateStyle: "full" })
  const weekdayShort = fmt({ weekday: "short" })
  const weekdayLong = fmt({ weekday: "long" })
  // Figma shows two letters ("Su") — trim English abbreviations; other locales are already short.
  const weekdayLabel = (d: Date) => {
    const s = weekdayShort.format(d)
    return locale.startsWith("en") ? s.slice(0, 2) : s
  }

  const dayDisabled = (d: Date) =>
    (min != null && compareDays(d, min) < 0) || (max != null && compareDays(d, max) > 0) || !!isDateDisabled?.(d)

  const select = (d: Date) => {
    if (dayDisabled(d)) return
    let next: Date | DateRange
    if (mode === "single") next = d
    else if (!range || range.end) next = { start: d }
    else next = compareDays(d, range.start) < 0 ? { start: d, end: range.start } : { start: range.start, end: d }
    if (valueProp === undefined) setInner(next)
    onChange?.(next as Date & DateRange)
    setFocused(d)
  }

  /** Keyboard focus moved to `d`: follow it to another month when it leaves the visible ones. */
  const focusDay = (d: Date) => {
    const next = clampDay(d, min, max)
    setFocused(next)
    if (!months.some((m) => isSameMonth(m, next))) {
      setMonth(startOfMonth(compareDays(next, month) < 0 ? next : addMonths(next, 1 - months.length)))
    }
    moveFocus.current = true
  }

  const onGridKeyDown = (e: KeyboardEvent) => {
    const keys: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => addDays(focused, -((focused.getDay() - weekStartsOn + 7) % 7)),
      End: () => addDays(focused, 6 - ((focused.getDay() - weekStartsOn + 7) % 7)),
      PageUp: () => addMonths(focused, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(focused, e.shiftKey ? 12 : 1),
    }
    const next = keys[e.key]
    if (!next) return
    e.preventDefault()
    focusDay(next())
  }

  const goMonths = (n: number) => {
    const next = addMonths(month, n)
    setMonth(next)
    setFocused(clampDay(new Date(next.getFullYear(), next.getMonth(), Math.min(focused.getDate(), 28)), min, max))
  }

  const prevLabel = view === "year" ? "Previous 12 years" : view === "month" ? "Previous year" : "Previous month"
  const nextLabel = view === "year" ? "Next 12 years" : view === "month" ? "Next year" : "Next month"
  const goPrev = () => (view === "year" ? setYearStart((y) => y - 12) : goMonths(view === "month" ? -12 : -1))
  const goNext = () => (view === "year" ? setYearStart((y) => y + 12) : goMonths(view === "month" ? 12 : 1))
  const toggleView = (v: View) => {
    if (v === "year") setYearStart(yearPageStart(month.getFullYear()))
    setView((cur) => (cur === v ? "day" : v))
  }

  const monthButton = (m: Date) => (
    <Button variant="outline" isSelected={view === "month"} aria-label={`Choose month, ${monthLong.format(m)}`} onClick={() => toggleView("month")}>
      {monthShort.format(m)}
    </Button>
  )
  const yearButton = (
    <Button variant="outline" isSelected={view === "year"} aria-label={`Choose year, ${month.getFullYear()}`} onClick={() => toggleView("year")}>
      {month.getFullYear()}
    </Button>
  )
  const prevButton = <Button variant="ghost" icon={<ChevronLeft />} aria-label={prevLabel} onClick={goPrev} />
  const nextButton = <Button variant="ghost" icon={<ChevronRight />} aria-label={nextLabel} onClick={goNext} />

  const dayGrid = (m: Date) => {
    const weeks = monthWeeks(m, weekStartsOn)
    return (
      <table
        role="grid"
        className={styles.grid}
        aria-label={monthLong.format(m)}
        onKeyDown={onGridKeyDown}
        onMouseLeave={() => setHovered(null)}
      >
        <thead>
          <tr>
            {weeks[0]!.map((d) => (
              <th key={d.getDay()} scope="col" abbr={weekdayLong.format(d)} className={styles.weekday}>
                {weekdayLabel(d)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week[0]!.getTime()}>
              {week.map((d) => {
                if (!isSameMonth(d, m)) {
                  // Days of the neighbouring months: shown greyed (Figma Status=disabled), not interactive.
                  return (
                    <td key={d.getTime()} className={styles.cell} aria-hidden="true">
                      <span className={styles.day} data-outside="">{d.getDate()}</span>
                    </td>
                  )
                }
                const disabled = dayDisabled(d)
                const rangeEnd = range?.end ?? null
                const selected =
                  mode === "single"
                    ? isSameDay(d, single) && "single"
                    : isSameDay(d, range?.start) && (rangeEnd && !isSameDay(range!.start, rangeEnd) ? "start" : "single")
                      || (isSameDay(d, rangeEnd) && "end")
                      || (range && rangeEnd && compareDays(d, range.start) > 0 && compareDays(d, rangeEnd) < 0 && "middle")
                const previewing =
                  previewLo && previewHi && compareDays(d, previewLo) >= 0 && compareDays(d, previewHi) <= 0 && !isSameDay(d, range!.start)
                    ? isSameDay(d, preview) ? "end" : "middle"
                    : undefined
                const mark = marker?.(d)
                const label = [fullDate.format(d), mark && markerLabels[mark]].filter(Boolean).join(", ")
                return (
                  <td key={d.getTime()} role="gridcell" className={styles.cell} aria-selected={!!selected}>
                    <button
                      type="button"
                      className={styles.day}
                      tabIndex={isSameDay(d, tabTarget) ? 0 : -1}
                      data-focus-target={isSameDay(d, tabTarget) || undefined}
                      data-selected={selected || undefined}
                      data-today={isSameDay(d, today) || undefined}
                      data-marker={mark}
                      data-preview={previewing}
                      aria-label={label}
                      aria-current={isSameDay(d, today) ? "date" : undefined}
                      aria-disabled={disabled || undefined}
                      onClick={() => select(d)}
                      onFocus={() => {
                        setFocused(d)
                        setHovered(d)
                      }}
                      onBlur={() => setHovered(null)}
                      onMouseEnter={() => setHovered(d)}
                    >
                      {d.getDate()}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const pickerGrid = (kind: "month" | "year") => {
    const items =
      kind === "month"
        ? Array.from({ length: 12 }, (_, i) => new Date(month.getFullYear(), i, 1))
        : Array.from({ length: 12 }, (_, i) => new Date(yearStart + i, month.getMonth(), 1))
    const isCurrent = (d: Date) => (kind === "month" ? d.getMonth() === month.getMonth() : d.getFullYear() === month.getFullYear())
    const outOfRange = (d: Date) => {
      const first = kind === "month" ? d : new Date(d.getFullYear(), 0, 1)
      const last = kind === "month" ? new Date(d.getFullYear(), d.getMonth() + 1, 0) : new Date(d.getFullYear(), 11, 31)
      return (min != null && compareDays(last, min) < 0) || (max != null && compareDays(first, max) > 0)
    }
    return (
      <div className={styles.picker} role="group" aria-label={kind === "month" ? "Months" : "Years"}>
        {items.map((d) => (
          <button
            key={d.getTime()}
            type="button"
            className={styles.pick}
            data-selected={isCurrent(d) || undefined}
            aria-pressed={isCurrent(d)}
            disabled={outOfRange(d)}
            onClick={() => {
              const next = startOfMonth(d)
              setMonth(next)
              setFocused(clampDay(new Date(next.getFullYear(), next.getMonth(), Math.min(focused.getDate(), 28)), min, max))
              setView("day")
              // The picked button unmounts — hand focus to the day grid instead of dropping it.
              moveFocus.current = true
            }}
          >
            {kind === "month" ? monthShort.format(d) : d.getFullYear()}
          </button>
        ))}
      </div>
    )
  }

  const twoPanels = mode === "range" && view === "day"

  return (
    <div
      {...rest}
      data-mode={mode}
      data-view={view}
      className={className ? `${styles.root} ${className}` : styles.root}
    >
      {/* Announces the month when it changes (buttons, PageUp/PageDown, picking a month). */}
      <span className={styles.srOnly} aria-live="polite">
        {months.map((m) => monthLong.format(m)).join(" – ")}
      </span>
      {twoPanels ? (
        <div className={styles.panels} ref={gridRef}>
          <div className={styles.panel}>
            <div className={styles.header} data-align="end">
              <div className={styles.titleGroup}>
                {prevButton}
                {monthButton(months[0]!)}
              </div>
            </div>
            {dayGrid(months[0]!)}
          </div>
          <div className={styles.panel}>
            <div className={styles.header}>
              <div className={styles.titleGroup}>
                {monthButton(months[1]!)}
                {nextButton}
              </div>
              {yearButton}
            </div>
            {dayGrid(months[1]!)}
          </div>
        </div>
      ) : (
        // Same footprint in every view (user decision, review 4): in range mode the picker spans both months.
        <div className={styles.body} data-span={mode === "range" ? "two" : undefined}>
          <div className={styles.header}>
            {prevButton}
            <div className={styles.titleGroup}>
              {monthButton(month)}
              {yearButton}
            </div>
            {nextButton}
          </div>
          <div ref={gridRef}>{view === "day" ? dayGrid(month) : pickerGrid(view)}</div>
        </div>
      )}
    </div>
  )
}
