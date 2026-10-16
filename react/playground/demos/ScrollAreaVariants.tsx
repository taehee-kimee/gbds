import { ScrollArea } from "../../src"
import { Row, Themes } from "../shell/theme"

const lines = Array.from({ length: 30 }, (_, i) => <p key={i} style={{ margin: "0 0 8px" }}>Line {i + 1}</p>)
const box = { width: 160, height: 200, padding: 12, boxSizing: "border-box", color: "var(--gb-text-default)", font: "var(--gb-typography-sm)" } as const

/** Scrolls each area to Start / Center / End once mounted — Figma Position. */
const at = (f: number) => (el: HTMLDivElement | null) => {
  if (!el || el.dataset.placed) return
  el.dataset.placed = ""
  el.scrollTop = (el.scrollHeight - el.clientHeight) * f
}

export function ScrollAreaVariants() {
  return (
    <Themes
      render={(theme) => (
        <div className="grid" style={{ ["--cols" as string]: 3 }}>
          <span />
          <span className="head">Start</span>
          <span className="head">Center</span>
          <span className="head">End</span>
          {(["thick", "thin"] as const).map((t) => (
            <Row key={t} label={t}>
              <ScrollArea type={t} ref={at(0)} style={box} aria-label={`${t} start`} data-testid={`${theme}-${t}`}>{lines}</ScrollArea>
              <ScrollArea type={t} ref={at(0.5)} style={box} aria-label={`${t} center`}>{lines}</ScrollArea>
              <ScrollArea type={t} ref={at(1)} style={box} aria-label={`${t} end`}>{lines}</ScrollArea>
            </Row>
          ))}
        </div>
      )}
    />
  )
}
