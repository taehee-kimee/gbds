import { Spinner } from "../../src"
import type { Story } from "../controls/PropsPanel"

/** Figma component set Spinner (1202:731) — properties in Figma's own order. */
export const spinnerStory: Story = {
  figma: "Figma · Spinner (1202:731) · Part/Spinner (3492:9739)",
  events: [],
  controls: [
    { kind: "TEXT", figmaKind: "TEXT (-> Label)", name: "label", default: "Processing", description: "→ label. 나타날 때 화면 낭독기가 읽음 (role=status)" },
    { kind: "VARIANT", name: "Type", options: ["outline", "reversed", "primary"], default: "outline", description: "→ variant" },
  ],
  render: (v) => (
    <Spinner
      label={v["label"] === "Processing" ? undefined : String(v["label"])}
      variant={v["Type"] === "outline" ? undefined : (v["Type"] as "reversed" | "primary")}
    />
  ),
  note: () => "1초에 한 바퀴. 동작 줄이기 설정이면 멈추지 않고 3배 느리게 (멈춘 고리는 멈춘 작업처럼 보여서).",
}
