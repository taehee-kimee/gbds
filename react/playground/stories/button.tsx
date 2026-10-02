import { ArrowRight, CircleDashed, Plus, Search, X } from "lucide-react"
import type { CSSProperties } from "react"

import { Button } from "../../src"
import type { Story } from "../controls/PropsPanel"
import { vars } from "../review/Review"

type Variant = "primary" | "mute" | "outline" | "link" | "icon" | "ghost" | "icon-rounded"

const iconVariants: readonly Variant[] = ["icon", "ghost", "icon-rounded"]

/** Figma State=active is :hover / :active in code — frozen inline so it can be shown without hovering. */
function activeStyle(variant: Variant): CSSProperties {
  switch (variant) {
    case "primary":
    case "mute":
      return vars({ "button-bg": "var(--gs-background-mute)", "button-fg": "var(--gs-text-static-white)", "button-border": "transparent", "button-opacity": "var(--gs-opacity-90)" })
    case "outline":
      return vars({ "button-bg": "var(--gs-background-mute)", "button-fg": "var(--gs-text-static-white)", "button-border": "transparent" })
    case "icon":
    case "icon-rounded":
      return vars({ "button-bg": "var(--gs-background-mute)", "button-fg": "var(--gs-icon-static-white)", "button-border": "transparent" })
    case "ghost":
      return vars({ "button-fg": "var(--gs-icon-subtlest)", "button-radius": "var(--gs-radius-md)" })
    case "link":
      return vars({ "button-fg": "var(--gs-text-subtle)", "button-underline": "var(--gs-border-mute-subtle)" })
  }
}

/** Figma component set Button (73:3681) — properties in Figma's own order. */
export const buttonStory: Story = {
  figma: "Figma · Button (73:3681)",
  events: ["onClick", "onFocus", "onBlur", "onKeyDown"],
  controls: [
    { kind: "TEXT", name: "-> Label", default: "Button", description: "버튼 텍스트 → children. 아이콘 Type에서는 aria-label로 들어감" },
    {
      kind: "INSTANCE_SWAP",
      name: "Icon",
      description: "아이콘 교체 → children(아이콘 Type) 또는 trailingIcon",
      default: "lucide/circle-dashed",
      options: {
        "lucide/circle-dashed": <CircleDashed />,
        "lucide/arrow-right": <ArrowRight />,
        "lucide/plus": <Plus />,
        "lucide/search": <Search />,
        "lucide/x": <X />,
      },
    },
    { kind: "BOOLEAN", name: "Trailing icon", default: false, description: "라벨 뒤 아이콘 → trailingIcon (link 제외)" },
    { kind: "VARIANT", name: "Type", options: ["primary", "mute", "outline", "link", "icon", "ghost", "icon rounded"], default: "primary", description: "→ variant" },
    { kind: "VARIANT", name: "State", options: ["default", "active", "disabled"], default: "default", description: "disabled → disabled prop · active → :hover / :active" },

    { source: "code", kind: "VARIANT", name: "type", options: ["button", "submit", "reset"], default: "button", type: '"button" | "submit" | "reset"', description: "기본 button — form 안에서도 제출하지 않음. 제출 버튼만 submit" },
    { source: "code", kind: "BOOLEAN", name: "isSelected", default: false, type: "boolean", description: "선택 상태 (ButtonGroup 항목 등). true면 State=active 모양 + aria-pressed" },
    { source: "code", kind: "TEXT", name: "aria-label", default: "", type: "string", description: "접근성 이름. 아이콘 Type은 필수 — 비우면 -> Label 사용" },
    { source: "code", kind: "TEXT", name: "name", default: "", type: "string", description: "form 제출 시 함께 전송되는 이름 (type=submit)" },
    { source: "code", kind: "TEXT", name: "value", default: "", type: "string", description: "form 제출 시 name과 함께 전송되는 값" },
  ],
  render: (v, { icon, actions }) => {
    const variant = String(v["Type"]).replace(" ", "-") as Variant
    const label = String(v["-> Label"])
    const text = (key: string) => String(v[key]) || undefined
    const common = {
      type: v["type"] === "button" ? undefined : (v["type"] as "submit" | "reset"),
      name: text("name"),
      value: text("value"),
      disabled: v["State"] === "disabled" || undefined,
      isSelected: v["isSelected"] === true || undefined,
      ...actions,
      style: v["State"] === "active" ? activeStyle(variant) : undefined,
    }
    if (iconVariants.includes(variant)) {
      return (
        <Button variant={variant as "icon"} aria-label={text("aria-label") ?? label} {...common}>
          {icon("Icon")}
        </Button>
      )
    }
    return (
      <Button
        variant={variant === "primary" ? undefined : (variant as "mute")}
        trailingIcon={v["Trailing icon"] && variant !== "link" ? icon("Icon") : undefined}
        aria-label={text("aria-label")}
        {...common}
      >
        {label}
      </Button>
    )
  },
  note: (v) => {
    const type = String(v["Type"])
    if (v["State"] === "active") return "State=active는 코드에서 :hover / :active — 여기서는 고정 표시. 실제로는 State=default에서 마우스를 올리거나 눌러 보세요."
    if (type === "link" && v["Trailing icon"]) return "link는 trailingIcon을 지원하지 않음 (Figma에도 link에는 아이콘 없음)."
    if (["icon", "ghost", "icon rounded"].includes(type)) return "아이콘 Type에서는 -> Label이 화면에 보이지 않고 aria-label로 들어감."
    return undefined
  },
}
