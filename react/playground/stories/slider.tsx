import { Field, Slider } from "../../src"
import type { Story } from "../controls/PropsPanel"

/** Figma component Slider (76:10520) — no Figma properties; everything is code. */
export const sliderStory: Story = {
  figma: "Figma · Slider (76:10520)",
  events: ["onValueChange", "onFocus", "onBlur"],
  controls: [
    { source: "code", kind: "TEXT", name: "value", default: "20", type: "number", inputType: "number", description: "현재 값 (끌거나 ←→ · Home/End · PageUp/Down으로도 바뀜)" },
    { source: "code", kind: "TEXT", name: "min", default: "0", type: "number", inputType: "number", description: "최소값 (기본 0)" },
    { source: "code", kind: "TEXT", name: "max", default: "100", type: "number", inputType: "number", description: "최대값 (기본 100)" },
    { source: "code", kind: "TEXT", name: "step", default: "1", type: "number", inputType: "number", min: 0, description: "단위 (기본 1)" },
    { source: "code", kind: "BOOLEAN", name: "disabled", default: false, type: "boolean", description: "Figma에 없음 — 막대 background/disabled-bold, 버튼 테두리 border/default" },
    { source: "code", kind: "TEXT", name: "label", default: "Volume", type: "ReactNode", description: "채우면 <Field label>로 감쌈 (없으면 aria-label 필요)" },
  ],
  render: (v, { actions, on, set }) => {
    const n = (k: string, d: number) => (Number.isFinite(Number(v[k])) && v[k] !== "" ? Number(v[k]) : d)
    const min = n("min", 0)
    const max = n("max", 100)
    const step = n("step", 1)
    const slider = (
      <Slider
        {...actions}
        value={n("value", min)}
        onValueChange={on("onValueChange", (x) => set("value", String(x)))}
        min={min === 0 ? undefined : min}
        max={max === 100 ? undefined : max}
        step={step === 1 ? undefined : step}
        disabled={v["disabled"] === true || undefined}
        aria-label={v["label"] ? undefined : "Volume"}
      />
    )
    return v["label"] ? <Field label={String(v["label"])} style={{ width: 435 }}>{slider}</Field> : <div style={{ width: 435 }}>{slider}</div>
  },
}
