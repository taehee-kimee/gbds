import { Checkbox } from "../../src"
import { Review, Spec, vars, type ReviewItem } from "./Review"

const label = "Accept terms and conditions"

/* The convention most libraries use, frozen inline: empty box when unchecked, filled box when checked. */
const conventionalUnchecked = vars({
  "checkbox-bg": "var(--gb-background-default)",
  "checkbox-border": "var(--gb-border-muted)",
})
const conventionalChecked = vars({
  "checkbox-bg": "var(--gb-background-bolder)",
  "checkbox-border": "var(--gb-background-bolder)",
  "checkbox-fg": "var(--gb-icon-invert)",
})
/* Freezes :focus-visible: the box draws --gb-shadow-xs, so point it at the focus ring. */
const focusRing = vars({ "gb-shadow-xs": "var(--gb-ring-focus)" })

export const items: ReviewItem[] = [
  {
    id: "1",
    title: "체크 안 된 상태가 꽉 찬 박스, 체크된 상태가 빈 박스",
    status: "decided",
    figma:
      "Status=default 박스 = background/bolder (라이트: 검정, 다크: 흰색). Status=checked/part 박스 = background/default + border/subtler + 아이콘.",
    code: "디자인 의도로 확정 (2026-10-16) — Figma 그대로 유지. 참고: 대부분의 라이브러리는 반대(빈 박스 → 체크 시 채움)라서 사용자가 상태를 거꾸로 읽을 위험이 있음.",
    columns: [
      {
        label: "Figma (현재 코드)",
        render: () => (
          <>
            <Spec label="unchecked"><Checkbox>{label}</Checkbox></Spec>
            <Spec label="checked"><Checkbox defaultChecked>{label}</Checkbox></Spec>
            <Spec label="part"><Checkbox indeterminate>{label}</Checkbox></Spec>
          </>
        ),
      },
      {
        label: "관례적인 방식이었다면",
        render: () => (
          <>
            <Spec label="unchecked"><Checkbox style={conventionalUnchecked}>{label}</Checkbox></Spec>
            <Spec label="checked"><Checkbox style={conventionalChecked} defaultChecked>{label}</Checkbox></Spec>
            <Spec label="part"><Checkbox style={conventionalChecked} indeterminate>{label}</Checkbox></Spec>
          </>
        ),
      },
    ],
  },
  {
    id: "2",
    title: "mute 라벨이 disabled 라벨보다 더 흐림",
    status: "decided",
    figma:
      "Figma 업데이트로 해결 (2026-10-16 확인): Type=mute 라벨 = text/subtle, Status=disabled 라벨 = text/static/gray.",
    code: "Figma 그대로 반영.",
    columns: [
      {
        label: "나란히 비교",
        render: () => (
          <>
            <Spec label="mute (활성)"><Checkbox variant="mute">{label}</Checkbox></Spec>
            <Spec label="disabled"><Checkbox disabled>{label}</Checkbox></Spec>
          </>
        ),
      },
    ],
  },
  {
    id: "3",
    title: "mute × disabled 조합이 Figma에 없음",
    status: "open",
    figma:
      "Type=mute에는 Status=default / checked / part만 있음 (checked·part는 2026-10-16 확인 시 추가돼 있음). disabled 계열은 Type=default에만 존재.",
    code: "mute + disabled면 default의 disabled 모양을 그대로 씀 (박스 background/disabled-bold, 라벨 text/static/gray).",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="mute"><Checkbox variant="mute">{label}</Checkbox></Spec>
            <Spec label="mute checked"><Checkbox variant="mute" defaultChecked>{label}</Checkbox></Spec>
            <Spec label="mute disabled"><Checkbox variant="mute" disabled>{label}</Checkbox></Spec>
            <Spec label="mute disabled-checked"><Checkbox variant="mute" disabled defaultChecked>{label}</Checkbox></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "same", label: "default의 disabled 모양 사용 (현재 코드 유지)", recommended: true },
      { id: "add", label: "Figma에 mute × disabled 변형 추가" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "4",
    title: "disabled × checked / part 조합",
    status: "decided",
    figma: "Figma에 Status=disabled-checked / disabled-part 추가됨. 아이콘 색은 리뷰 8번 참고.",
    code: "Figma 그대로 반영.",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="disabled"><Checkbox disabled>{label}</Checkbox></Spec>
            <Spec label="disabled-checked"><Checkbox disabled defaultChecked>{label}</Checkbox></Spec>
            <Spec label="disabled-part"><Checkbox disabled indeterminate>{label}</Checkbox></Spec>
          </>
        ),
      },
    ],
  },
  {
    id: "8",
    title: "라이트 모드 disabled-checked / part에서 체크가 안 보임",
    status: "decided",
    figma:
      "Figma 반영 (2026-10-16): disabled-checked / disabled-part 아이콘 icon/static/gray → icon/subtlest (라이트 neutral-400, 다크 neutral-500).",
    code: "Figma 그대로 반영.",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="disabled"><Checkbox disabled>{label}</Checkbox></Spec>
            <Spec label="disabled-checked"><Checkbox disabled defaultChecked>{label}</Checkbox></Spec>
            <Spec label="disabled-part"><Checkbox disabled indeterminate>{label}</Checkbox></Spec>
          </>
        ),
      },
    ],
  },
  {
    id: "5",
    title: "키보드 포커스 · hover 상태가 Figma에 없음",
    status: "open",
    figma: "focus, hover 변형 없음.",
    code: ":focus-visible일 때 박스에 --gb-ring-focus (Button과 동일). hover 스타일은 없음.",
    columns: [
      {
        label: "코드 — Tab 키로 이동해 보세요",
        render: () => (
          <>
            <Spec label="unchecked"><Checkbox>{label}</Checkbox></Spec>
            <Spec label="checked"><Checkbox defaultChecked>{label}</Checkbox></Spec>
          </>
        ),
      },
      {
        label: "focus 고정 표시",
        render: () => (
          <Spec label="focus-visible">
            <Checkbox defaultChecked style={focusRing}>{label}</Checkbox>
          </Spec>
        ),
      },
    ],
    options: [
      { id: "code", label: "코드 방식 유지 (focus ring만, hover 없음)", recommended: true },
      { id: "figma", label: "Figma에 focus / hover 변형 추가" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "6",
    title: "라벨 없는 체크박스",
    status: "info",
    figma: "Label 불리언 속성(기본 true)으로 텍스트를 숨길 수 있음.",
    code: "children을 생략하면 박스만 렌더링. 이때 aria-label이 타입 수준에서 필수.",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="unchecked"><Checkbox aria-label={label} /></Spec>
            <Spec label="checked"><Checkbox aria-label={label} defaultChecked /></Spec>
            <Spec label="part"><Checkbox aria-label={label} indeterminate /></Spec>
          </>
        ),
      },
    ],
  },
  {
    id: "7",
    title: "Figma 페이지 설명 문구",
    status: "info",
    figma: "페이지 프레임 이름이 \"Label\"이고 설명이 \"Renders an accessible label associated with controls.\" (shadcn Label 문구). 컴포넌트 description은 체크박스 설명이 맞음.",
    code: "해당 없음 — Figma 문서 정리 대상.",
    columns: [],
  },
]

