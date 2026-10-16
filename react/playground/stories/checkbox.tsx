import { Checkbox } from "../../src"
import type { Story } from "../controls/PropsPanel"

/** Figma component set Checkbox (76:8617) — properties in Figma's own order. */
export const checkboxStory: Story = {
  figma: "Figma · Checkbox (76:8617)",
  events: ["onChange", "onFocus", "onBlur"],
  controls: [
    { kind: "BOOLEAN", name: "Label", default: true, description: "라벨 표시. 끄면 children 대신 aria-label" },
    { kind: "TEXT", name: "-> Label", default: "Accept terms and conditions", description: "라벨 텍스트 → children" },
    { kind: "VARIANT", name: "Type", options: ["default", "mute"], default: "default", description: "→ variant" },
    { kind: "VARIANT", name: "Status", options: ["default", "part", "checked", "disabled", "disabled-checked", "disabled-part"], default: "default", description: "checked → checked · part → indeterminate · disabled-* → disabled" },

    { source: "code", kind: "TEXT", name: "name", default: "", type: "string", description: "form 제출 시 전송되는 이름. 체크된 경우에만 전송" },
    { source: "code", kind: "TEXT", name: "value", default: "", type: "string", description: "체크 시 전송되는 값. 비우면 브라우저 기본값 \"on\"" },
    { source: "code", kind: "BOOLEAN", name: "required", default: false, type: "boolean", description: "form 제출 전 체크 필수 (브라우저 기본 검증)" },
  ],
  render: (v, { set, actions, on }) => {
    const text = String(v["-> Label"])
    const labelled = v["Label"] === true
    const status = String(v["Status"])
    return (
      <Checkbox
        variant={v["Type"] === "mute" ? "mute" : undefined}
        checked={status.endsWith("checked")}
        indeterminate={status.endsWith("part") || undefined}
        disabled={status.startsWith("disabled") || undefined}
        aria-label={labelled ? undefined : text}
        name={String(v["name"]) || undefined}
        value={String(v["value"]) || undefined}
        required={v["required"] === true || undefined}
        {...actions}
        onChange={on("onChange", (e) => {
          const target = (e as { target: HTMLInputElement }).target
          set("Status", target.checked ? "checked" : "default")
        })}
      >
        {labelled ? text : undefined}
      </Checkbox>
    )
  },
  note: (v) =>
    v["Type"] === "mute" && String(v["Status"]).startsWith("disabled")
      ? "Figma에는 Type=mute의 disabled 변형이 없음 — 코드는 default와 같은 disabled 모양을 씀 (리뷰 3번)."
      : undefined,
}
