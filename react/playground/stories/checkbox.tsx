import { Checkbox } from "../../src"
import type { Story } from "../controls/PropsPanel"

/** Figma component set Checkbox (76:8617) — properties in Figma's own order. */
export const checkboxStory: Story = {
  figma: "Figma · Checkbox (76:8617)",
  events: ["onChange", "onFocus", "onBlur"],
  controls: [
    { kind: "BOOLEAN", name: "Label", default: true, description: "라벨 표시. 끄면 children 대신 aria-label" },
    { kind: "TEXT", name: "-> Label", default: "Accept terms and conditions", description: "라벨 텍스트 → children" },
    { kind: "VARIANT", name: "Type", options: ["default", "Part", "Checked", "Disabled"], default: "default", description: "Checked → checked · Part → indeterminate · Disabled → disabled" },
    { kind: "VARIANT", name: "Style", options: ["default", "muted"], default: "default", description: "→ variant" },

    { source: "code", kind: "TEXT", name: "name", default: "", type: "string", description: "form 제출 시 전송되는 이름. 체크된 경우에만 전송" },
    { source: "code", kind: "TEXT", name: "value", default: "", type: "string", description: "체크 시 전송되는 값. 비우면 브라우저 기본값 \"on\"" },
    { source: "code", kind: "BOOLEAN", name: "required", default: false, type: "boolean", description: "form 제출 전 체크 필수 (브라우저 기본 검증)" },
  ],
  render: (v, { set, actions, on }) => {
    const text = String(v["-> Label"])
    const labelled = v["Label"] === true
    return (
      <Checkbox
        variant={v["Style"] === "muted" ? "muted" : undefined}
        checked={v["Type"] === "Checked"}
        indeterminate={v["Type"] === "Part" || undefined}
        disabled={v["Type"] === "Disabled" || undefined}
        aria-label={labelled ? undefined : text}
        name={String(v["name"]) || undefined}
        value={String(v["value"]) || undefined}
        required={v["required"] === true || undefined}
        {...actions}
        onChange={on("onChange", (e) => {
          const target = (e as { target: HTMLInputElement }).target
          set("Type", target.checked ? "Checked" : "default")
        })}
      >
        {labelled ? text : undefined}
      </Checkbox>
    )
  },
  note: (v) =>
    v["Type"] === "Disabled"
      ? "Figma Type=Disabled는 체크 안 된 상태뿐 — 코드에서는 disabled와 checked/indeterminate를 함께 쓸 수 있음 (리뷰 4번)."
      : undefined,
}
