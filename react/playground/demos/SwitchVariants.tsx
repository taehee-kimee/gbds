import { useState } from "react"

import { Switch } from "../../src"
import { Row, Themes } from "../shell/theme"

function Matrix({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className="grid" style={{ ["--cols" as string]: 4 }}>
      <span />
      <span className="head">off</span>
      <span className="head">on</span>
      <span className="head">disabled off</span>
      <span className="head">disabled on</span>
      {(["default", "small"] as const).map((size) =>
        (["end", "start"] as const).map((pos) => (
          <Row key={size + pos} label={`${size} · ${pos === "end" ? "default" : "reversed"}`}>
            <Switch size={size} labelPosition={pos} data-testid={`${theme}-${size}-${pos}-off`}>switch</Switch>
            <Switch size={size} labelPosition={pos} defaultChecked data-testid={`${theme}-${size}-${pos}-on`}>switch</Switch>
            <Switch size={size} labelPosition={pos} disabled data-testid={`${theme}-${size}-${pos}-doff`}>switch</Switch>
            <Switch size={size} labelPosition={pos} disabled defaultChecked>switch</Switch>
          </Row>
        ))
      )}
    </div>
  )
}

/** Settings that apply immediately. */
function Settings({ theme }: { theme: "light" | "dark" }) {
  const [notify, setNotify] = useState(true)
  const [dark, setDark] = useState(false)
  return (
    <div style={{ display: "grid", gap: 12, width: 260 }}>
      <Switch labelPosition="start" checked={notify} onCheckedChange={setNotify} style={{ justifyContent: "space-between" }} data-testid={`${theme}-notify`}>알림 받기</Switch>
      <Switch labelPosition="start" checked={dark} onCheckedChange={setDark} style={{ justifyContent: "space-between" }}>다크 모드</Switch>
      <span style={{ font: "var(--gb-typography-xs)", color: "var(--gb-text-subtle)" }} data-testid={`${theme}-state`}>알림 {notify ? "켜짐" : "꺼짐"} · 다크 {dark ? "켜짐" : "꺼짐"}</span>
    </div>
  )
}

export function SwitchVariants() {
  return (
    <Themes
      render={(theme) => (
        <>
          <Matrix theme={theme} />
          <h2 className="sub">설정 목록 (바로 적용)</h2>
          <Settings theme={theme} />
        </>
      )}
    />
  )
}
