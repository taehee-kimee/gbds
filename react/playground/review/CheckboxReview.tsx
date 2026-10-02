import { Checkbox } from "../../src"
import { Review, Spec, vars, type ReviewItem } from "./Review"

const label = "Accept terms and conditions"

/* The convention most libraries use, frozen inline: empty box when unchecked, filled box when checked. */
const conventionalUnchecked = vars({
  "checkbox-bg": "var(--gs-background-default)",
  "checkbox-border": "var(--gs-border-muted)",
})
const conventionalChecked = vars({
  "checkbox-bg": "var(--gs-background-bolder)",
  "checkbox-border": "var(--gs-background-bolder)",
  "checkbox-fg": "var(--gs-icon-invert)",
})
/* Freezes :focus-visible: the box draws --gs-shadow-xs, so point it at the focus ring. */
const focusRing = vars({ "gs-shadow-xs": "var(--gs-ring-focus)" })

export const items: ReviewItem[] = [
  {
    id: "1",
    title: "체크 안 된 상태가 꽉 찬 박스, 체크된 상태가 빈 박스",
    status: "open",
    figma:
      "Type=default 박스 = background/bolder (라이트: 검정, 다크: 흰색). Type=Checked/Part 박스 = background/default + border/subtler + 아이콘.",
    code: "Figma 그대로. 대부분의 라이브러리는 반대(빈 박스 → 체크 시 채움)라서 사용자가 상태를 거꾸로 읽을 위험이 있음.",
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
    options: [
      { id: "keep", label: "Figma 유지 (의도된 디자인)" },
      { id: "swap", label: "관례대로 반전: unchecked 빈 박스, checked 채운 박스", recommended: true },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "2",
    title: "muted 라벨이 disabled 라벨보다 더 흐림",
    status: "open",
    figma: "Style=muted 라벨 = text/subtler (neutral-450). Type=Disabled 라벨 = text/subtle (라이트 neutral-500, 다크 neutral-400).",
    code: "Figma 그대로. 결과적으로 활성 상태인 muted가 비활성보다 더 비활성처럼 보임.",
    columns: [
      {
        label: "나란히 비교",
        render: () => (
          <>
            <Spec label="muted (활성)"><Checkbox variant="muted">{label}</Checkbox></Spec>
            <Spec label="disabled"><Checkbox disabled>{label}</Checkbox></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "keep", label: "Figma 유지" },
      { id: "muted-subtle", label: "muted 라벨을 text/subtle로, disabled를 더 흐린 토큰으로" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "3",
    title: "muted × checked / part 조합이 Figma에 없음",
    status: "open",
    figma: "Style=muted는 Type=default에만 존재. 체크된 muted 변형 없음.",
    code: "체크되면 checked 스타일이 우선 — 박스와 라벨 모두 default와 같아짐 (muted 흔적 없음).",
    columns: [
      {
        label: "코드 — muted를 클릭해 보세요",
        render: () => (
          <>
            <Spec label="muted"><Checkbox variant="muted">{label}</Checkbox></Spec>
            <Spec label="muted checked"><Checkbox variant="muted" defaultChecked>{label}</Checkbox></Spec>
            <Spec label="muted part"><Checkbox variant="muted" indeterminate>{label}</Checkbox></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "same", label: "체크되면 default와 같음 (현재 코드 유지)" },
      { id: "add", label: "Figma에 muted × Checked / Part 변형 추가", recommended: true },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "4",
    title: "disabled × checked / part 조합이 Figma에 없음",
    status: "open",
    figma: "Type=Disabled 하나뿐. 체크된 채로 비활성인 상태(예: 필수 동의 항목)를 표현할 수 없음.",
    code: "disabled 박스(background/disabled-bold) 위에 체크/대시 아이콘을 그대로 표시.",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="disabled"><Checkbox disabled>{label}</Checkbox></Spec>
            <Spec label="disabled checked"><Checkbox disabled defaultChecked>{label}</Checkbox></Spec>
            <Spec label="disabled part"><Checkbox disabled indeterminate>{label}</Checkbox></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "same", label: "현재 코드 유지" },
      { id: "add", label: "Figma에 Disabled × Checked / Part 변형 추가", recommended: true },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "5",
    title: "키보드 포커스 · hover 상태가 Figma에 없음",
    status: "open",
    figma: "focus, hover 변형 없음.",
    code: ":focus-visible일 때 박스에 --gs-ring-focus (Button과 동일). hover 스타일은 없음.",
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

