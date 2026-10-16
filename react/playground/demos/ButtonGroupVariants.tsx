import { House } from "lucide-react"

import { Button, ButtonGroup } from "../../src"
import { Themes } from "../shell/theme"

const pairs: [string, string, string][] = [
  ["skippable", "Later", "Go Next"],
  ["back or forth", "Go back", "Go Next"],
  ["save", "Cancel", "Save"],
  ["confirm", "Cancel", "Confirm"],
  ["Error", "Refresh", "Back to Dashboard"],
]

function Menu({ testid, disabled, current }: { testid?: string; disabled?: boolean; current?: string }) {
  return (
    <ButtonGroup variant="menu" disabled={disabled} aria-label="주 메뉴" data-testid={testid}>
      <Button variant="ghost-rounded" icon={<House />} aria-label="Home" />
      {["Assets", "Compass", "Content Studio"].map((name) => (
        <Button key={name} variant="ghost" isSelected={current === name || undefined} aria-current={current === name ? "page" : undefined}>
          {name}
        </Button>
      ))}
    </ButtonGroup>
  )
}

function Matrix({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className="stack">
      <span className="head">menu · default / disabled / 현재 항목 Compass (코드 전용)</span>
      <Menu testid={`${theme}-menu`} />
      <Menu testid={`${theme}-menu-disabled`} disabled />
      <Menu current="Compass" />
      <span className="head" style={{ marginTop: 24 }}>버튼 쌍 · default / disabled (344px)</span>
      {pairs.map(([type, secondary, primary]) => (
        <div key={type} style={{ display: "flex", gap: 40 }}>
          <ButtonGroup style={{ width: 344 }} aria-label={type} data-testid={`${theme}-${type}`}>
            <Button variant="outline">{secondary}</Button>
            <Button>{primary}</Button>
          </ButtonGroup>
          <ButtonGroup style={{ width: 344 }} aria-label={type} disabled data-testid={`${theme}-${type}-disabled`}>
            <Button variant="outline">{secondary}</Button>
            <Button>{primary}</Button>
          </ButtonGroup>
        </div>
      ))}
    </div>
  )
}

export function ButtonGroupVariants() {
  return <Themes render={(theme) => <Matrix theme={theme} />} />
}
