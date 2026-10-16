import { Skeleton } from "../../src"
import type { Story } from "../controls/PropsPanel"

/** Figma component set Skeleton Loader Segment (3017:2922) — properties in Figma's own order. */
export const skeletonStory: Story = {
  figma: "Figma · Skeleton Loader Segment (3017:2922) → Skeleton",
  events: [],
  controls: [
    { kind: "VARIANT", name: "Progress", options: ["0", "33", "66"], default: "0", description: "prop 아님 — shimmer 애니메이션의 장면 (계속 움직임)" },
    { kind: "VARIANT", name: "Type", options: ["rectangle", "text", "circle"], default: "rectangle", description: "→ type. rectangle radius 2xl · text radius md · circle" },
    { source: "code", kind: "TEXT", name: "width", default: "", type: "number | string", inputType: "number", unit: "px", min: 1, description: "비우면 Figma 크기 (226, circle 27)" },
    { source: "code", kind: "TEXT", name: "height", default: "", type: "number | string", inputType: "number", unit: "px", min: 1, description: "비우면 Figma 크기 (rectangle 157, text 27, circle = width)" },
  ],
  render: (v) => (
    <Skeleton
      type={v["Type"] === "rectangle" ? undefined : (v["Type"] as "text" | "circle")}
      width={v["width"] ? Number(v["width"]) : undefined}
      height={v["height"] ? Number(v["height"]) : undefined}
    />
  ),
  note: () => "장식용(aria-hidden) — 로딩 중인 영역에 aria-busy=\"true\"와 \"Loading\" 안내를 두세요. 동작 줄이기 설정이면 반짝임 없이 단색.",
}
