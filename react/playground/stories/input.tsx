
import { Field, Input } from "../../src"
import type { Story } from "../controls/PropsPanel"
import { vars } from "../review/Review"

/** Figma Status=active is :focus-within — frozen inline so it shows without clicking. */
export const inputActive = vars({ "input-border": "var(--gb-border-static-gray)", "input-ring": "var(--gb-ring-focus)" })

/** Figma component set Part/Input (520:3062) — properties in Figma's own order; label/description/error wrap it in Field (Figma Input). */
export const inputStory: Story = {
  figma: "Figma · Part/Input (520:3062) · Input (5084:3716) · Input search (3981:19811) = type=\"search\"",
  events: ["onChange", "onPeriodChange", "onCountryChange", "onPhoneChange", "onFocus", "onBlur"],
  controls: [
    { kind: "TEXT", figmaKind: "TEXT (-> Text)", name: "placeholder", default: "Email or Username", description: "Figma -> Text. 입력 전 안내 문구 → placeholder (Status=filled에서는 이 문구가 입력값으로 들어감)" },
    { kind: "VARIANT", name: "Status", options: ["default", "active", "filled", "error", "disabled"], default: "default", description: "active → 포커스 · filled → 값 · error → invalid (또는 Field error) · disabled → disabled" },

    { source: "code", kind: "TEXT", name: "label", default: "", type: "ReactNode", description: "Field의 라벨 (Figma Input -> Title). 채우면 Field로 감쌈" },
    { source: "code", kind: "TEXT", name: "description", default: "", type: "ReactNode", description: "Field 설명 (Figma Input -> Description)" },
    { source: "code", kind: "TEXT", name: "error", default: "", type: "ReactNode", description: "Field 에러 메시지 — 입력을 invalid로 만들고 설명 대신 표시" },
    {
      source: "code",
      kind: "VARIANT",
      name: "type",
      options: ["text", "search", "password", "time", "tel", "file", "url"],
      default: "text",
      type: "string",
      description:
        "Figma의 입력 종류: text = Part/Input · search = Input search · time = Input time (hh:mm + AM/PM) · tel = Input phone (국가번호 + 번호) · password = 눈 아이콘으로 보이기/숨기기 (Figma에 없음) · file = Upload 줄 · url = Link 줄. (email 등 다른 HTML type도 됨)",
    },
    { source: "code", kind: "BOOLEAN", name: "clearable", default: true, type: "boolean", description: "text · search — 입력된 내용이 있을 때만 오른쪽에 지우기(X). 누르면 비우고 onChange(\"\")", visibleWhen: (v) => v["type"] === "text" || v["type"] === "search" },
    { source: "code", kind: "TEXT", name: "clearLabel", default: "Clear", type: "string", description: "지우기 버튼의 접근성 이름 (예: \"검색어 지우기\")", visibleWhen: (v) => (v["type"] === "text" || v["type"] === "search") && v["clearable"] === true },
    { source: "code", kind: "VARIANT", name: "hourCycle", options: ["12", "24"], default: "12", type: "12 | 24", description: "time — 12 (기본, Figma): 1–12시 + AM/PM · 24: 00–23시, AM/PM 없음", visibleWhen: (v) => v["type"] === "time" },
    { source: "code", kind: "VARIANT", name: "period", options: ["AM", "PM"], default: "AM", type: '"AM" | "PM"', description: "time (12시간제) — 오전/오후 (토글로도 바뀜)", visibleWhen: (v) => v["type"] === "time" && v["hourCycle"] === "12" },
    { source: "code", kind: "VARIANT", name: "country", options: ["US", "KR", "JP", "GB", "CN", "DE"], default: "US", type: "CountryCode (ISO)", description: "tel — 국가 (libphonenumber-js, 245개국). 목록에서 골라도 바뀜. 상자에는 +번호만, 목록에는 '이름 +번호'", visibleWhen: (v) => v["type"] === "tel" },
    { source: "code", kind: "BOOLEAN", name: "preferredCountries", default: false, type: "CountryCode[]", description: "tel — 켜면 [\"KR\", \"US\"]를 목록 맨 위에 고정 (countries로 목록 제한도 가능)", visibleWhen: (v) => v["type"] === "tel" },
    { source: "code", kind: "VARIANT", name: "locale", options: ["en", "ko"], default: "en", type: "string", description: "tel — 목록의 나라 이름 언어 (Intl)", visibleWhen: (v) => v["type"] === "tel" },
    { source: "code", kind: "TEXT", name: "name", default: "", type: "string", description: "form 제출 시 이름" },
  ],
  render: (v, { actions: allActions, on, set }) => {
    const { onPeriodChange: _period, onCountryChange: _country, ...actions } = allActions
    const status = String(v["Status"])
    const text = String(v["placeholder"])
    const type = String(v["type"])
    // time / tel have their own example text (Figma "11:00", "123-456-789") unless you typed one.
    const ownPlaceholder = (type === "time" || type === "tel") && text === "Email or Username"
    const typeProps =
      type === "time"
        ? {
            ...(v["hourCycle"] === "24"
              ? { hourCycle: 24 as const }
              : { period: v["period"] as "AM" | "PM", onPeriodChange: on("onPeriodChange", (p) => set("period", p as string)) }),
          }
        : type === "tel"
          ? {
              country: v["country"] as "US",
              onCountryChange: on("onCountryChange", (c) => set("country", c as string)),
              ...(v["preferredCountries"] === true ? { preferredCountries: ["KR", "US"] as ["KR", "US"] } : {}),
              ...(v["locale"] === "en" ? {} : { locale: String(v["locale"]) }),
            }
          : {}
    const input = (
      <Input
        {...typeProps}
        key={`${status}-${type}`}
        type={type === "text" ? undefined : type}
        style={{ width: type === "search" ? 344 : 320, ...(status === "active" && type !== "time" && type !== "tel" ? inputActive : {}) }}
        placeholder={status === "filled" || ownPlaceholder ? undefined : text}
        defaultValue={status === "filled" && type !== "file" ? (type === "time" ? "11:00" : type === "tel" ? "123-456-789" : text) : undefined}
        invalid={status === "error" || undefined}
        disabled={status === "disabled" || undefined}
        clearable={v["clearable"] === true ? undefined : false}
        clearLabel={v["clearLabel"] === "Clear" || !v["clearLabel"] ? undefined : String(v["clearLabel"])}
        name={String(v["name"]) || undefined}
        {...actions}
      />
    )
    const label = String(v["label"])
    if (!label) return input
    return (
      <Field label={label} description={String(v["description"]) || undefined} error={String(v["error"]) || undefined} style={{ width: 320 }}>
        {input}
      </Field>
    )
  },
  note: (v) =>
    v["Status"] === "active"
      ? "Status=active는 코드에서 포커스 — 여기서는 고정 표시."
      : v["type"] === "file"
        ? "type=\"file\": 상자를 누르면 파일 선택 창. 고른 파일 이름이 표시됨 (Figma Input의 Upload 줄)."
        : undefined,
}
