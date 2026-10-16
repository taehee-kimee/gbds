import { Progress } from "../../src"
import type { Story } from "../controls/PropsPanel"

/** Figma component set Progress (3539:7160) — properties in Figma's own order. */
export const progressStory: Story = {
  figma: "Figma · Progress (3539:7160) · Part/Progress (3311:1341)",
  events: [],
  controls: [
    { kind: "TEXT", name: "-> Placeholder", default: "Loading image..", description: "바 위 라벨 → label (진행 막대의 이름도 됨)" },
    { kind: "BOOLEAN", name: "Text", default: true, description: "끄면 label 없이 바만 — 이때는 aria-label 필요" },
    { kind: "VARIANT", name: "Status", options: ["in progress", "completed"], default: "in progress", description: "prop 아님 — value가 max에 닿으면 completed (라벨이 completedLabel로 바뀜)" },

    { source: "code", kind: "TEXT", name: "value", default: "10", type: "number", inputType: "number", min: 0, description: "진행량 0 … max. Figma Part/Progress Percentage(%) (10 단위) — 코드는 아무 값" },
    { source: "code", kind: "TEXT", name: "max", default: "100", type: "number", inputType: "number", min: 1, description: "기본 100 (예: 파일 수 12개 중 3개면 max=12 value=3)" },
    { source: "code", kind: "TEXT", name: "completedLabel", default: "Completed", type: "ReactNode", description: "완료 시 라벨 (Figma Status=completed의 \"Completed\")", visibleWhen: (v) => v["Text"] === true },
  ],
  render: (v) => {
    const max = Number(v["max"]) > 0 ? Number(v["max"]) : 100
    // Status is not a prop: completed = value at max.
    const value = v["Status"] === "completed" ? max : Number(v["value"]) || 0
    return (
      <Progress
        style={{ width: 226 }}
        value={value}
        max={max === 100 ? undefined : max}
        {...(v["Text"] === true ? { label: String(v["-> Placeholder"]) } : { "aria-label": String(v["-> Placeholder"]) })}
        completedLabel={v["completedLabel"] === "Completed" ? undefined : String(v["completedLabel"])}
      />
    )
  },
  note: (v) =>
    v["Status"] === "completed"
      ? "Status=completed → value={max}. 값이 max에 닿으면 자동으로 완료 라벨로 바뀜."
      : Number(v["value"]) >= (Number(v["max"]) || 100)
        ? "value가 max에 닿아 완료 상태로 표시됨."
        : v["Text"] === false
          ? "라벨이 없으면 -> Placeholder 문구를 aria-label로 넘김 (스크린 리더용 이름)."
          : undefined,
}
