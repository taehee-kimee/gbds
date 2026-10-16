import { Archive, Eraser, FileText, Goal } from "lucide-react"

import { Menu, type MenuItem } from "../../src"
import type { Story } from "../controls/PropsPanel"
import { gbIconOptions } from "../icons/gb-icons"

/** Figma Dropdown slot Type=menu — actions with leading icons. */
export const menuItems: MenuItem[] = [
  { id: "post", label: "Create a Post", icon: <FileText /> },
  { id: "edit", label: "Edit Asset Image", icon: <Eraser /> },
  { id: "archive", label: "Move to Archive", icon: <Archive /> },
  { id: "goal", label: "Edit Goal", icon: <Goal /> },
]

/** Figma select Type=icon + Dropdown slot Type=menu — a button that opens a list of actions. */
export const menuStory: Story = {
  figma: "Figma · select Type=icon (614:2466) · Dropdown slot Type=menu (8094:1187)",
  events: ["onAction", "onOpenChange"],
  controls: [
    { kind: "VARIANT", name: "Type", options: ["icon", "default"], default: "icon", description: "→ type. icon = 36 × 36 아이콘 버튼 (label은 aria-label) · default = 글자 + chevron" },
    { kind: "INSTANCE_SWAP", name: "-> Icon", default: "lucide/plus", options: gbIconOptions, description: "Type=icon의 아이콘 → icon", visibleWhen: (v) => v["Type"] === "icon" },
    { kind: "VARIANT", name: "Style", options: ["primary", "reverse", "mute", "ghost"], default: "primary", description: "→ variant (Figma Type=icon은 primary만)" },
    { kind: "VARIANT", name: "Status", options: ["default", "disabled"], default: "default", description: "disabled → disabled. hovered = 마우스 · pressed = 열린 상태" },
    { source: "code", kind: "TEXT", name: "label", default: "Add", type: "string", description: "Type=default의 글자, Type=icon의 접근성 이름" },
    { source: "code", kind: "BOOLEAN", name: "disabled item", default: false, type: "MenuItem.disabled", description: "마지막 항목을 disabled로 (Part/dropdown slot Status=disabled)" },
  ],
  render: (v, { icon, on }) => {
    const items = v["disabled item"] === true ? menuItems.map((m, i) => (i === menuItems.length - 1 ? { ...m, disabled: true } : m)) : menuItems
    const common = {
      items,
      onAction: on("onAction"),
      onOpenChange: on("onOpenChange"),
      variant: v["Style"] === "primary" ? undefined : (v["Style"] as "reverse" | "mute" | "ghost"),
      disabled: v["Status"] === "disabled" || undefined,
      label: String(v["label"]),
    }
    return v["Type"] === "icon" ? <Menu {...common} type="icon" icon={icon("-> Icon")} /> : <Menu {...common} />
  },
  note: () => "열리면 첫 항목에 포커스 · ↑↓ 이동 · Enter/Space 실행 · Esc로 닫고 버튼으로 포커스 복귀.",
}
