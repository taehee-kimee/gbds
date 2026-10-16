import { House } from "lucide-react"

import { Button, ButtonGroup } from "../../src"
import type { Story } from "../controls/PropsPanel"

/** The pair Types differ only in their labels: [secondary, primary]. */
const pairs: Record<string, [string, string]> = {
  skippable: ["Later", "Go Next"],
  "back or forth": ["Go back", "Go Next"],
  save: ["Cancel", "Save"],
  confirm: ["Cancel", "Confirm"],
  Error: ["Refresh", "Back to Dashboard"],
}
const menuItems = ["Assets", "Compass", "Content Studio"]
const path = (name: string) => (name === "Home" ? "/" : `/${name.toLowerCase().replace(/ /g, "-")}`)

/** Figma component set Button group (3466:29935) — properties in Figma's own order. */
export const buttonGroupStory: Story = {
  figma: "Figma · Button group (3466:29935)",
  events: ["onClick"],
  controls: [
    { kind: "VARIANT", name: "Type", options: ["menu", "skippable", "back or forth", "save", "confirm", "Error"], default: "menu", description: "menu → variant=\"menu\" · 나머지 → 라벨만 다른 버튼 쌍 (variant 생략)" },
    { kind: "VARIANT", name: "Status", options: ["default", "disabled"], default: "default", description: "disabled → disabled (안의 모든 Button)" },

    { source: "code", kind: "VARIANT", name: "current", options: ["none", "Home", ...menuItems], default: "none", type: "string", description: "menu에서 현재 페이지 항목 → 그 Button에 isSelected + aria-current=\"page\" (Figma에는 선택 상태 없음)" },
    { source: "code", kind: "TEXT", name: "aria-label", default: "", type: "string", description: "그룹 이름. menu(<nav>)가 여러 개면 필수" },
  ],
  render: (v, { actions, set, on }) => {
    const disabled = v["Status"] === "disabled" || undefined
    const label = String(v["aria-label"]) || undefined
    if (v["Type"] === "menu") {
      const current = String(v["current"])
      // Real links (href → <a>). The playground cancels the navigation and only moves `current`.
      const item = (name: string) => ({
        href: path(name),
        isSelected: current === name || undefined,
        "aria-current": current === name ? ("page" as const) : undefined,
        onClick: on("onClick", (e) => {
          ;(e as { preventDefault: () => void }).preventDefault()
          set("current", name)
        }),
      })
      return (
        <ButtonGroup variant="menu" disabled={disabled} aria-label={label}>
          <Button variant="ghost-rounded" icon={<House />} aria-label="Home" {...item("Home")} />
          {menuItems.map((name) => (
            <Button key={name} variant="ghost" {...item(name)}>{name}</Button>
          ))}
        </ButtonGroup>
      )
    }
    const [secondary, primary] = pairs[String(v["Type"])] ?? ["Cancel", "Save"]
    return (
      <ButtonGroup disabled={disabled} aria-label={label} style={{ width: 344 }}>
        <Button variant="outline" {...actions}>{secondary}</Button>
        <Button {...actions}>{primary}</Button>
      </ButtonGroup>
    )
  },
  note: (v) =>
    v["Type"] === "menu"
      ? "menu 항목은 href가 있어 <a>로 렌더링 (새 탭 · 주소 복사 가능). 여기서는 이동을 막고 current만 바꿈. Figma menu에는 선택된 항목이 없음 — current로 선택 상태(Status=active 모양)를 확인하세요."
      : "Figma 너비는 344 고정 — 코드는 부모 너비를 채우고 두 버튼이 같은 너비로 나눔. 여기서는 344px 상자 안에 표시.",
}
