import { ScrollArea } from "../../src"
import type { Story } from "../controls/PropsPanel"

const lines = Array.from({ length: 30 }, (_, i) => `Line ${i + 1} — scroll to see the bar move.`)

/** Figma component set Scroll bar (7792:522) — properties in Figma's own order. */
export const scrollAreaStory: Story = {
  figma: "Figma · Scroll bar (7792:522) → ScrollArea",
  events: ["onScroll"],
  controls: [
    { kind: "VARIANT", name: "Type", options: ["Thick", "Thin"], default: "Thick", description: "→ type. 스크롤바 폭 Thick 10 · Thin 5" },
    { kind: "VARIANT", name: "Position", options: ["Start", "Center", "End"], default: "Start", description: "prop 아님 — 막대 위치는 스크롤 위치를 따름. 고르면 그 위치로 스크롤" },
    { source: "code", kind: "VARIANT", name: "orientation", options: ["vertical", "horizontal", "both"], default: "vertical", type: '"vertical" | "horizontal" | "both"', description: "스크롤 방향" },
  ],
  render: (v, { actions }) => {
    const horizontal = v["orientation"] !== "vertical"
    const position = String(v["Position"])
    return (
      <ScrollArea
        key={`${position}-${v["orientation"]}`}
        ref={(el) => {
          // Only when Position changes — not on every re-render, or it would undo the user's scrolling.
          if (!el || el.dataset.position === position) return
          el.dataset.position = position
          const f = position === "Start" ? 0 : position === "Center" ? 0.5 : 1
          el.scrollTop = (el.scrollHeight - el.clientHeight) * f
          el.scrollLeft = (el.scrollWidth - el.clientWidth) * f
        }}
        type={v["Type"] === "Thin" ? "thin" : undefined}
        orientation={v["orientation"] === "vertical" ? undefined : (v["orientation"] as "horizontal" | "both")}
        aria-label="Notes"
        style={{ width: 280, height: 200, padding: 12, boxSizing: "border-box", color: "var(--gb-text-default)", font: "var(--gb-typography-sm)" }}
        {...actions}
      >
        <div style={{ width: horizontal ? 560 : undefined }}>
          {lines.map((l) => (
            <p key={l} style={{ margin: "0 0 8px", whiteSpace: horizontal ? "nowrap" : undefined }}>{l}</p>
          ))}
        </div>
      </ScrollArea>
    )
  },
  note: () => "모양만 바뀌고 스크롤은 브라우저 그대로 (휠 · 터치 · 키보드 · 막대 끌기). Firefox는 폭을 정할 수 없어 브라우저의 얇은 폭(약 8px) + Figma 색.",
}
