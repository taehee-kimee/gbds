import { ArrowRight, CircleDashed, Plus, Search, X } from "lucide-react"
import type { CSSProperties } from "react"

import { Button } from "../../src"
import type { Story } from "../controls/PropsPanel"
import { vars } from "../review/Review"

type Type = "default" | "icon" | "google"
type Style = "default" | "mute" | "outline" | "link" | "ghost" | "ghost-rounded"

/** The Styles each Figma Type has (27 variants = these × 3 Status). */
const stylesByType: Record<Type, readonly Style[]> = {
  default: ["default", "mute", "outline", "link", "ghost"],
  icon: ["default", "ghost", "ghost-rounded"],
  google: ["default"],
}

/** Figma Status=active is :hover / :active in code — frozen inline so it can be shown without hovering. */
function activeStyle(type: Type, style: Style): CSSProperties {
  if (style === "link") return vars({ "button-bg": "transparent", "button-fg": "var(--gb-text-subtle)", "button-underline": "var(--gb-border-mute-subtle)" })
  const fg = type === "icon" ? "var(--gb-icon-static-white)" : "var(--gb-text-static-white)"
  const base = { "button-bg": "var(--gb-background-mute)", "button-fg": fg, "button-border": "transparent" }
  if (type === "default" && (style === "default" || style === "mute")) return vars({ ...base, "button-opacity": "var(--gb-opacity-90)" })
  if (type === "icon" && style === "ghost") return vars({ ...base, "button-radius": "var(--gb-radius-lg)" })
  return vars(base)
}

/** Figma component set Button (73:3681) — properties in Figma's own order. */
export const buttonStory: Story = {
  figma: "Figma · Button (73:3681)",
  events: ["onClick", "onFocus", "onBlur", "onKeyDown"],
  controls: [
    { kind: "TEXT", name: "-> Label", default: "Button", description: "버튼 텍스트 → children. Type=icon에서는 aria-label로 들어감" },
    {
      kind: "INSTANCE_SWAP",
      name: "-> Icon",
      description: "아이콘 교체 → icon",
      default: "lucide/circle-dashed",
      options: {
        "lucide/circle-dashed": <CircleDashed />,
        "lucide/arrow-right": <ArrowRight />,
        "lucide/plus": <Plus />,
        "lucide/search": <Search />,
        "lucide/x": <X />,
      },
    },
    { kind: "BOOLEAN", name: "Show icon", default: false, description: "라벨 뒤 아이콘 → icon (Type=default, Style≠ghost)" },
    { kind: "VARIANT", name: "Type", options: ["default", "icon", "google"], default: "default", description: "default → children · icon → children 없이 icon + aria-label · google → variant=\"google\"" },
    { kind: "VARIANT", name: "Style", options: ["default", "mute", "outline", "link", "ghost", "ghost-rounded"], default: "default", description: "→ variant. Type마다 있는 Style이 다름" },
    { kind: "VARIANT", name: "Status", options: ["default", "active", "disabled"], default: "default", description: "disabled → disabled prop · active → :hover / :active" },

    { source: "code", kind: "VARIANT", name: "type", options: ["button", "submit", "reset"], default: "button", type: '"button" | "submit" | "reset"', description: "기본 button — form 안에서도 제출하지 않음. 제출 버튼만 submit" },
    { source: "code", kind: "BOOLEAN", name: "isSelected", default: false, type: "boolean", description: "선택 상태 (Button Group 항목 등). true면 Status=active 모양 + aria-pressed" },
    { source: "code", kind: "TEXT", name: "aria-label", default: "", type: "string", description: "접근성 이름. Type=icon은 필수 — 비우면 -> Label 사용" },
    { source: "code", kind: "TEXT", name: "name", default: "", type: "string", description: "form 제출 시 함께 전송되는 이름 (type=submit)" },
    { source: "code", kind: "TEXT", name: "value", default: "", type: "string", description: "form 제출 시 name과 함께 전송되는 값" },
  ],
  render: (v, { icon, actions }) => {
    const type = v["Type"] as Type
    // Figma has no Type=icon × Style=mute etc. — fall back to the Type's first Style.
    const style = stylesByType[type].includes(v["Style"] as Style) ? (v["Style"] as Style) : "default"
    const label = String(v["-> Label"])
    const text = (key: string) => String(v[key]) || undefined
    const common = {
      type: v["type"] === "button" ? undefined : (v["type"] as "submit" | "reset"),
      name: text("name"),
      value: text("value"),
      disabled: v["Status"] === "disabled" || undefined,
      isSelected: v["isSelected"] === true || undefined,
      ...actions,
      style: v["Status"] === "active" ? activeStyle(type, style) : undefined,
    }
    if (type === "icon") {
      return (
        <Button
          variant={style === "default" ? undefined : (style as "ghost")}
          icon={icon("-> Icon")}
          aria-label={text("aria-label") ?? label}
          {...common}
        />
      )
    }
    if (type === "google") {
      return <Button variant="google" {...common}>{label === "Button" ? "Continue with Google" : label}</Button>
    }
    if (style === "ghost") {
      return <Button variant="ghost" aria-label={text("aria-label")} {...common}>{label}</Button>
    }
    return (
      <Button
        variant={style === "default" ? undefined : (style as "mute")}
        icon={v["Show icon"] ? icon("-> Icon") : undefined}
        aria-label={text("aria-label")}
        {...common}
      >
        {label}
      </Button>
    )
  },
  note: (v) => {
    const type = v["Type"] as Type
    const style = v["Style"] as Style
    if (!stylesByType[type].includes(style)) return `Figma에 Type=${type} × Style=${style} 변형이 없음 — Style=default로 표시.`
    if (v["Status"] === "active") return "Status=active는 코드에서 :hover / :active — 여기서는 고정 표시. 실제로는 Status=default에서 마우스를 올리거나 눌러 보세요."
    if (v["Show icon"] && (type !== "default" || style === "ghost")) return "아이콘 슬롯은 Type=default(ghost 제외)에만 있음 — Figma도 동일."
    if (type === "icon") return "Type=icon에서는 -> Label이 화면에 보이지 않고 aria-label로 들어감."
    if (type === "google") return "google은 라벨이 Figma 속성이 아님 (\"Continue with Google\" 고정) — 코드에서는 children."
    return undefined
  },
}
