import { ArrowUp, ImageIcon, Mic, Paperclip, Search, Telescope } from "lucide-react"
import type { ReactElement } from "react"

import { Avatar, Badge, Button, Checkbox, Chatbox, Chip } from "../../src"
import sample from "../assets/avatar-sample.jpg"
import type { Story } from "../controls/PropsPanel"
import { vars } from "../review/Review"

/** Figma Status=active is the textarea's :focus — frozen inline so it shows without clicking. */
export const chatboxActive = vars({ "chatbox-border": "var(--gb-border-static-gray)", "chatbox-ring": "var(--gb-ring-focus)" })

/**
 * Example code for the content prop (Figma "-> Slot") — any React node works. Fragments, because the
 * slot lays its items out itself.
 */
export const slotExamples: Record<string, ReactElement> = {
  "추천 칩 (Chip)": (
    <>
      <Chip variant="outline">요약해줘</Chip>
      <Chip variant="outline">번역해줘</Chip>
      <Chip variant="outline">아이디어 더 보기</Chip>
    </>
  ),
  "첨부 파일 (Avatar + Badge)": (
    <>
      <Avatar src={sample} alt="첨부 이미지" shape="rectangle" />
      <Badge variant="reverse" size={28} icon={<Paperclip />}>회의록.pdf</Badge>
    </>
  ),
  "옵션 (Checkbox)": (
    <>
      <Checkbox defaultChecked>웹 검색</Checkbox>
      <Checkbox>출처 표시</Checkbox>
    </>
  ),
  "도구 (Button)": (
    <>
      <Button variant="outline" icon={<Search />}>검색</Button>
      <Button variant="outline" icon={<Telescope />}>Deep research</Button>
    </>
  ),
}

/** "200" → 200 (px); "40vh" stays a string; "" → undefined. */
function cssValue(text: string) {
  const t = text.trim()
  if (!t) return undefined
  return /^\d+(\.\d+)?$/.test(t) ? Number(t) : t
}

/** Example code for start / end. "기본" = prop omitted (Figma's + / sparkles); "없음" = null. */
export const startExamples: Record<string, ReactElement> = {
  "기본 (+)": <></>,
  "클립 (Paperclip)": <Button icon={<Paperclip />} aria-label="파일 첨부" />,
  "클립 + 이미지": (
    <>
      <Button icon={<Paperclip />} aria-label="파일 첨부" />
      <Button icon={<ImageIcon />} aria-label="이미지 첨부" />
    </>
  ),
  없음: <></>,
}

export const endExamples: Record<string, ReactElement> = {
  "기본 (sparkles)": <></>,
  "음성 + 보내기": (
    <>
      <Button variant="ghost" icon={<Mic />} aria-label="음성 입력" />
      <Button type="submit" icon={<ArrowUp />} aria-label="보내기" />
    </>
  ),
  "텍스트 버튼": <Button type="submit">보내기</Button>,
  없음: <></>,
}

/** "기본" → undefined (default button), "없음" → null (empty), else the example element. */
export function pickSide(choice: string, element: ReactElement | undefined) {
  if (choice.startsWith("기본")) return undefined
  if (choice === "없음") return null
  return element
}

/** Kept for the review page: the first example. */
export const demoSlot = slotExamples["추천 칩 (Chip)"]!

/** Figma component set Chatbox (7219:5418) — properties in Figma's own order. */
export const chatboxStory: Story = {
  figma: "Figma · Chatbox (7219:5418)",
  events: ["onSubmit", "onAttach", "onFocus", "onBlur"],
  controls: [
    { kind: "TEXT", figmaKind: "TEXT (-> Text)", name: "placeholder", default: "Please share your ideas.", description: "Figma -> Text. 입력 전 안내 문구 → placeholder (Status=filled에서는 이 문구가 입력값으로 들어감)" },
    { kind: "BOOLEAN", name: "Button", default: true, description: "기본 전송 버튼 표시 → showSend (end를 직접 넣으면 무시)" },
    {
      kind: "INSTANCE_SWAP",
      figmaKind: "SLOT",
      name: "content",
      type: "ReactNode",
      description: "Figma Slot(표시) + -> Slot(내용) → content. 텍스트 위 슬롯에 들어갈 내용 — 아무 React 노드나, 예시는 <>…</>로 묶음. 없음 = 슬롯 숨김",
      default: "없음",
      options: { 없음: <></>, ...slotExamples },
    },
    { kind: "VARIANT", name: "Status", options: ["default", "active", "disabled", "filled"], default: "default", description: "active → 입력 포커스 · filled → 값이 있음 · disabled → disabled" },

    {
      source: "code",
      kind: "INSTANCE_SWAP",
      name: "start",
      type: "ReactNode",
      description: "버튼 줄 왼쪽. 생략 = + 버튼(onAttach) · Button을 직접 넣어 교체 · null = 비움",
      default: "기본 (+)",
      options: startExamples,
    },
    {
      source: "code",
      kind: "INSTANCE_SWAP",
      name: "end",
      type: "ReactNode",
      description: "버튼 줄 오른쪽. 생략 = sparkles 전송 버튼 · Button을 직접 넣어 교체 (전송 버튼은 type=\"submit\" → onSubmit) · null = 비움",
      default: "기본 (sparkles)",
      options: endExamples,
    },
    { source: "code", kind: "VARIANT", name: "size", options: ["sm", "md", "lg", "custom"], default: "sm", type: '"sm" | "md" | "lg" | "custom"', description: "박스 크기 (글자는 모두 16/24). sm 높이 240 · md 280 · lg 320 · 패딩 20 · custom = height · width로 직접. 넘치면 텍스트만 스크롤" },
    {
      source: "code",
      kind: "TEXT",
      inputType: "number",
      unit: "px",
      min: 80,
      name: "height",
      default: "200",
      type: "number | string",
      description: "custom 박스 높이 (px). 코드에서는 \"40vh\"처럼 문자열 단위도 가능",
      visibleWhen: (v) => v["size"] === "custom",
    },
    {
      source: "code",
      kind: "TEXT",
      inputType: "number",
      unit: "px",
      min: 200,
      name: "width",
      default: "",
      type: "number | string",
      description: "custom 박스 너비 (px). 비우면 부모를 채움",
      visibleWhen: (v) => v["size"] === "custom",
    },
    { source: "code", kind: "TEXT", name: "attachLabel", default: "Attach file", type: "string", description: "+ 버튼 접근성 이름" },
    { source: "code", kind: "TEXT", name: "sendLabel", default: "Send", type: "string", description: "전송 버튼 접근성 이름" },
    { source: "code", kind: "TEXT", name: "name", default: "", type: "string", description: "form 제출 시 전송되는 이름 (textarea)" },
  ],
  render: (v, { actions, set, icon }) => {
    const status = String(v["Status"])
    const text = String(v["placeholder"])
    return (
      <Chatbox
        // Remount only to swap placeholder ↔ filled text; default ↔ active must keep focus.
        key={status === "filled" ? "filled" : "edit"}
        style={{ ...(v["size"] === "custom" ? {} : { width: 700 }), ...(status === "active" ? chatboxActive : {}) }}
        placeholder={status === "filled" ? undefined : text}
        defaultValue={status === "filled" ? text : undefined}
        disabled={status === "disabled" || undefined}
        {...(v["size"] === "custom"
          ? { size: "custom" as const, height: cssValue(String(v["height"])) ?? 200, width: cssValue(String(v["width"])) }
          : { size: v["size"] === "sm" ? undefined : (v["size"] as "md" | "lg") })}
        showSend={v["Button"] === true ? undefined : false}
        start={pickSide(String(v["start"]), icon("start"))}
        end={pickSide(String(v["end"]), icon("end"))}
        content={v["content"] === "없음" ? undefined : icon("content")}
        attachLabel={v["attachLabel"] === "Attach file" ? undefined : String(v["attachLabel"])}
        sendLabel={v["sendLabel"] === "Send" ? undefined : String(v["sendLabel"])}
        name={String(v["name"]) || undefined}
        {...actions}
        onFocus={(e) => { actions.onFocus?.(e); if (status === "default") set("Status", "active") }}
        onBlur={(e) => { actions.onBlur?.(e); if (status === "active") set("Status", "default") }}
      />
    )
  },
  note: (v) =>
    v["Status"] === "active"
      ? "Status=active는 코드에서 입력에 포커스가 있을 때 — 여기서는 고정 표시. Enter = 전송, Shift+Enter = 줄바꿈."
      : "Figma 너비 700 고정 — 코드는 부모 너비를 채움 (여기서는 700px). Enter = 전송, Shift+Enter = 줄바꿈.",
}
