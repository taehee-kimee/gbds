import { Calendar } from "../../src"
import { Themes } from "../shell/theme"
import { demoMarker } from "../stories/calendar"

const sep = new Date(2026, 8, 1)
const today = new Date(2026, 8, 4)

function Matrix({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className="stack">
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
        <Calendar defaultMonth={sep} today={today} defaultValue={new Date(2026, 8, 11)} data-testid={`${theme}-default`} />
        <Calendar defaultMonth={sep} today={today} defaultValue={new Date(2026, 8, 11)} marker={demoMarker} data-testid={`${theme}-data`} />
        <Calendar defaultMonth={sep} today={today} defaultView="month" data-testid={`${theme}-month`} />
        <Calendar defaultMonth={sep} today={today} defaultView="year" data-testid={`${theme}-year`} />
      </div>
      <Calendar mode="range" defaultMonth={sep} today={today} defaultValue={{ start: new Date(2026, 8, 1), end: new Date(2026, 8, 30) }} data-testid={`${theme}-range`} />
      <span className="head">min 9/8 · max 9/24 · 주말 불가 (코드 전용)</span>
      <Calendar defaultMonth={sep} today={today} min={new Date(2026, 8, 8)} max={new Date(2026, 8, 24)} isDateDisabled={(d) => d.getDay() === 0 || d.getDay() === 6} />
    </div>
  )
}

export function CalendarVariants() {
  return <Themes render={(theme) => <Matrix theme={theme} />} />
}
