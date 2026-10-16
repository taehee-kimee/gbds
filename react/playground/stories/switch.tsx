import { Switch } from "../../src"
import type { Story } from "../controls/PropsPanel"

/** Figma component set Switch (76:10618) — properties in Figma's own order. */
export const switchStory: Story = {
  figma: "Figma · Switch (76:10618)",
  events: ["onCheckedChange", "onFocus", "onBlur"],
  controls: [
    { kind: "TEXT", name: "-> Label", default: "switch", description: "라벨 → children" },
    { kind: "BOOLEAN", name: "Label", default: true, description: "끄면 라벨 없이 — 이때는 aria-label 필요" },
    { kind: "VARIANT", name: "On", options: ["off", "on"], default: "off", description: "→ checked (누르거나 Space로도 바뀜)" },
    { kind: "VARIANT", name: "Type", options: ["default", "reversed"], default: "default", description: "→ labelPosition. reversed = 라벨이 앞 (\"start\")" },
    { kind: "VARIANT", name: "Status", options: ["default", "disabled"], default: "default", description: "disabled → disabled (전체 opacity 50)" },
    { kind: "VARIANT", name: "Size", options: ["default", "small"], default: "default", description: "→ size. default 44 × 24 · small 40 × 22" },
  ],
  render: (v, { actions, on, set }) => {
    const common = {
      ...actions,
      checked: v["On"] === "on",
      onCheckedChange: on("onCheckedChange", (c) => set("On", c ? "on" : "off")),
      labelPosition: v["Type"] === "reversed" ? ("start" as const) : undefined,
      disabled: v["Status"] === "disabled" || undefined,
      size: v["Size"] === "small" ? ("small" as const) : undefined,
    }
    return v["Label"] === true ? <Switch {...common}>{String(v["-> Label"])}</Switch> : <Switch {...common} aria-label={String(v["-> Label"])} />
  },
  note: () => "설정이 바로 적용되는 곳에. 제출할 때 확정되는 값이면 Checkbox.",
}
