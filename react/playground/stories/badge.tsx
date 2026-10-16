import { Bell, Check, CircleDashed, TriangleAlert, X } from "lucide-react"

import { Badge } from "../../src"
import type { Story } from "../controls/PropsPanel"

type Variant = "default" | "reverse" | "alarm" | "success" | "destructive" | "outline"

/** Figma component set Badge (665:2024) — properties in Figma's own order. */
export const badgeStory: Story = {
  figma: "Figma · Badge (665:2024)",
  events: [],
  controls: [
    { kind: "TEXT", name: "-> Label", default: "Badge", description: "라벨 텍스트 → children. Label을 끄면 aria-label로 들어감" },
    { kind: "BOOLEAN", name: "Label", default: true, description: "라벨 표시. 끄면 아이콘만 (aria-label 필수)" },
    { kind: "BOOLEAN", name: "Leading Icon", default: false, description: "라벨 앞 아이콘 → icon" },
    {
      kind: "INSTANCE_SWAP",
      name: "-> Leading Icon",
      description: "아이콘 교체 → icon",
      default: "lucide/circle-dashed",
      options: {
        "lucide/circle-dashed": <CircleDashed />,
        "lucide/check": <Check />,
        "lucide/x": <X />,
        "lucide/bell": <Bell />,
        "lucide/triangle-alert": <TriangleAlert />,
      },
    },
    { kind: "VARIANT", name: "Style", options: ["default", "reverse", "alarm", "success", "destructive", "outline"], default: "default", description: "→ variant" },
    { kind: "VARIANT", name: "Size", options: ["20", "28"], default: "20", description: "→ size (높이 px)" },
  ],
  render: (v, { icon }) => {
    const label = String(v["-> Label"])
    const common = {
      variant: v["Style"] === "default" ? undefined : (v["Style"] as Variant),
      size: v["Size"] === "28" ? (28 as const) : undefined,
    }
    // Label=false needs an icon to show anything; Figma shows the icon whenever Label is off and the icon is on.
    if (v["Label"] !== true) {
      return <Badge {...common} icon={icon("-> Leading Icon")} aria-label={label} />
    }
    return (
      <Badge {...common} icon={v["Leading Icon"] === true ? icon("-> Leading Icon") : undefined}>
        {label}
      </Badge>
    )
  },
  note: (v) =>
    v["Label"] !== true && v["Leading Icon"] !== true
      ? "Figma에서 Label과 Leading Icon을 모두 끄면 빈 알약이 됨 — 코드는 라벨 없는 배지에 아이콘이 필수라서 아이콘을 표시함 (리뷰 4번)."
      : undefined,
}
