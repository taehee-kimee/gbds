import { Chip } from "../../src"
import type { Story } from "../controls/PropsPanel"

type Variant = "primary" | "secondary" | "outline" | "ghost"

/** Figma component set Chips (3021:1615) — properties in Figma's own order. */
export const chipStory: Story = {
  figma: "Figma · Chips (3021:1615)",
  events: ["onSelectedChange", "onRemove", "onFocus", "onBlur"],
  controls: [
    { kind: "TEXT", name: "-> Label", default: "Chips", description: "라벨 → children" },
    { kind: "BOOLEAN", name: "Delete icon", default: false, description: "모서리 X 배지 → onRemove를 넘기면 표시 (disabled면 숨김)" },
    { kind: "VARIANT", name: "Type", options: ["primary", "outline", "secondary", "ghost"], default: "primary", description: "→ variant" },
    { kind: "VARIANT", name: "Status", options: ["default", "active", "disabled"], default: "default", description: "active → isSelected (켜짐, aria-pressed) · disabled → disabled. 칩을 클릭하면 바뀜" },

    { source: "code", kind: "TEXT", name: "removeLabel", default: "Remove", type: "string", description: "X 버튼 접근성 이름 (예: \"React 필터 삭제\")" },
  ],
  render: (v, { actions, on, set }) => {
    const status = String(v["Status"])
    return (
      <Chip
        variant={v["Type"] === "primary" ? undefined : (v["Type"] as Variant)}
        isSelected={status === "active"}
        disabled={status === "disabled" || undefined}
        removeLabel={v["removeLabel"] === "Remove" ? undefined : String(v["removeLabel"])}
        {...actions}
        onSelectedChange={on("onSelectedChange", (selected) => set("Status", selected ? "active" : "default"))}
        onRemove={v["Delete icon"] === true ? on("onRemove") : undefined}
      >
        {String(v["-> Label"])}
      </Chip>
    )
  },
  note: (v) =>
    v["Status"] === "disabled" && v["Type"] !== "primary"
      ? "Figma에는 primary만 disabled 변형이 있음 — 다른 Type에도 같은 규칙(opacity 70 + text/subtle)을 적용 (리뷰 1)."
      : v["Delete icon"] === true
        ? "X를 누르거나 칩에 포커스한 채 Delete / Backspace를 누르면 onRemove."
        : undefined,
}
