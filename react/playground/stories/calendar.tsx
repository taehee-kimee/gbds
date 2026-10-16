import { Calendar, type CalendarMarker } from "../../src"
import type { Story } from "../controls/PropsPanel"

/** Figma shows September 2026 with today on Fri the 4th — pinned so the playground matches. */
const figmaMonth = new Date(2026, 8, 1)
const figmaToday = new Date(2026, 8, 4)

/** A stable spread of event markers, like the Figma Data=True specimen. */
export function demoMarker(d: Date): CalendarMarker | undefined {
  const n = d.getDate()
  if (n % 9 === 7) return "reserved"
  if (n % 6 === 3) return "draft"
  if (n % 4 === 1) return "published"
  return undefined
}

/** Figma component set Part/Calendar modal (7219:10741) — properties in Figma's own order. */
export const calendarStory: Story = {
  figma: "Figma · Part/Calendar modal (7219:10741)",
  events: ["onChange"],
  controls: [
    { kind: "VARIANT", name: "Type", options: ["default", "month", "year", "range"], default: "default", description: "default · month · year → defaultView (헤더 버튼으로도 전환) · range → mode=\"range\"" },
    { kind: "VARIANT", name: "Data", options: ["False", "True"], default: "False", description: "True → marker (날짜 아래 점: published · reserved · draft)" },

    { source: "code", kind: "VARIANT", name: "locale", options: ["en-US", "ko-KR"], default: "en-US", type: "string", description: "월 · 요일 이름 언어 (Intl)" },
    { source: "code", kind: "VARIANT", name: "weekStartsOn", options: ["0", "1"], default: "0", type: "number", description: "0 = 일요일 (Figma) · 1 = 월요일" },
    { source: "code", kind: "BOOLEAN", name: "min / max", default: false, type: "Date", description: "켜면 min = 9월 8일, max = 10월 24일 — 밖의 날짜·월·연도는 disabled" },
  ],
  render: (v, { actions }) => {
    const type = String(v["Type"])
    const limits = v["min / max"] === true ? { min: new Date(2026, 8, 8), max: new Date(2026, 9, 24) } : {}
    const common = {
      key: `${type}-${v["locale"]}-${v["weekStartsOn"]}`,
      defaultMonth: figmaMonth,
      today: figmaToday,
      locale: v["locale"] === "en-US" ? undefined : String(v["locale"]),
      weekStartsOn: v["weekStartsOn"] === "1" ? 1 : undefined,
      marker: v["Data"] === "True" ? demoMarker : undefined,
      ...limits,
      ...actions,
    }
    if (type === "range") return <Calendar mode="range" defaultValue={{ start: new Date(2026, 8, 1), end: new Date(2026, 8, 30) }} {...common} />
    return (
      <Calendar
        defaultValue={new Date(2026, 8, 11)}
        defaultView={type === "default" ? undefined : (type as "month" | "year")}
        {...common}
      />
    )
  },
  note: () => "today는 Figma와 같게 2026-09-04로 고정 (today prop). 날짜를 클릭하거나 방향키 · PageUp/PageDown · Home/End로 이동해 보세요.",
}
