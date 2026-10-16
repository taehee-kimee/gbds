import { Field, Select, type SelectOption } from "../../src"
import type { Story } from "../controls/PropsPanel"

/** The sample list (Figma Dropdown slot Type=self) — 8 options, so it scrolls past 6. */
export const selectRoles: SelectOption[] = ["Data Scientist", "Morning Jogger", "Workflow Sculptor", "Sunday Baker", "Vintage Curator", "Brooklyn Observer", "Midnight Coder", "Plant Parent"].map((l) => ({
  value: l,
  label: l,
}))

/** Figma component set select (614:2466) — Type=default | side. Type=icon is <Menu>. */
export const selectStory: Story = {
  figma: "Figma · select (614:2466) · Dropdown slot (8094:1187) · Part/dropdown slot (8094:1231)",
  events: ["onValueChange", "onOpenChange", "onFocus", "onBlur"],
  controls: [
    { kind: "TEXT", figmaKind: "TEXT (-> Placeholder)", name: "placeholder", default: "Data Scientist", description: "아무것도 고르지 않았을 때 문구 → placeholder" },
    { kind: "VARIANT", name: "Type", options: ["default", "side"], default: "default", description: "→ type. side = 작은 글씨, 목록이 옆으로 열림. Type=icon은 <Menu type=\"icon\">" },
    { kind: "VARIANT", name: "Style", options: ["primary", "reverse", "mute", "ghost"], default: "primary", description: "→ variant. side에서는 primary = 오른쪽, reverse = 왼쪽으로 열림" },
    { kind: "VARIANT", name: "Status", options: ["default", "filled", "disabled"], default: "default", description: "default = 고른 값 없음(placeholder) · filled = 값 있음 · disabled. hovered = 마우스 · pressed = 목록이 열린 상태 (눌러 보세요)" },

    { source: "code", kind: "TEXT", name: "value", default: "", type: "string | null", description: "고른 값 (목록에서 고르면 바뀜). 비우면 null → placeholder" },
    { source: "code", kind: "TEXT", name: "label", default: "", type: "ReactNode", description: "채우면 <Field label>로 감싸 라벨을 붙임 (없으면 aria-label 필요)" },
    { source: "code", kind: "TEXT", name: "error", default: "", type: "ReactNode", description: "Field error — 빨간 테두리 + 문구", visibleWhen: (v) => v["label"] !== "" },
    { source: "code", kind: "TEXT", name: "name", default: "", type: "string", description: "form 제출 이름 (숨은 input)" },
  ],
  render: (v, { actions, on, set }) => {
    const options = selectRoles
    const status = String(v["Status"])
    const picked = options.some((o) => o.value === v["value"]) ? String(v["value"]) : null
    // Status=filled with nothing picked shows the first option; Status=default shows the placeholder.
    const filled = status === "default" ? null : (picked ?? (status === "filled" ? options[0]?.value : null))
    const select = (
      <Select
        {...actions}
        options={options}
        value={filled ?? null}
        onValueChange={on("onValueChange", (val) => {
          set("value", String(val))
          set("Status", "filled")
        })}
        placeholder={String(v["placeholder"])}
        type={v["Type"] === "side" ? "side" : undefined}
        variant={v["Style"] === "primary" ? undefined : (v["Style"] as "reverse" | "mute" | "ghost")}
        disabled={status === "disabled" || undefined}
        name={v["name"] ? String(v["name"]) : undefined}
        aria-label={v["label"] ? undefined : "Role"}
      />
    )
    return v["label"] ? (
      <Field label={String(v["label"])} error={v["error"] ? String(v["error"]) : undefined} style={{ width: 240 }}>
        {select}
      </Field>
    ) : (
      select
    )
  },
  note: (v) =>
    v["Status"] === "disabled" && v["Style"] !== "primary"
      ? "Figma에는 primary만 disabled 변형이 있음 — 다른 Style에도 같은 모양을 적용 (리뷰)."
      : "↑↓로 이동 · Enter/Space로 선택 · 글자를 치면 그 글자로 시작하는 항목으로 · Esc나 바깥 클릭으로 닫힘.",
}
