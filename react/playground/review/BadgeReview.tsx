import { Bell, CircleDashed } from "lucide-react"

import { Badge } from "../../src"
import { Spec, vars, type ReviewItem } from "./Review"

const textDefault = vars({ "badge-fg": "var(--gb-text-default)" })
const textInvert = vars({ "badge-fg": "var(--gb-text-invert)" })

export const items: ReviewItem[] = [
  {
    id: "1",
    title: "라이트 모드 destructive: 빨간 배경에 검은 글자",
    status: "decided",
    figma:
      "Style=destructive 라벨 = text/default. 다크 모드에서는 흰 글자(neutral-50)지만 라이트 모드에서는 neutral-950 → 빨강(red-600) 위 검정, 대비 4.1:1 (AA 4.5 미달).",
    code: "결정(2026-10-16): 두 모드 모두 흰 글자 → text/static/white로 변경. Figma는 text/invert로 바뀌었는데, text/invert는 다크 모드에서 neutral-900이라 다크에서 검은 글자가 됨 → Figma도 text/static/white로 다시 바인딩함 (4990:6681, 5270:11396). Figma = 코드.",
    columns: [
      {
        label: "이전 Figma (text/default)",
        render: () => (
          <>
            <Spec label="20"><Badge variant="destructive" style={textDefault}>Badge</Badge></Spec>
            <Spec label="28"><Badge variant="destructive" size={28} style={textDefault}>Badge</Badge></Spec>
          </>
        ),
      },
      {
        label: "중간 Figma (text/invert) — 다크에서 검정",
        render: () => (
          <>
            <Spec label="20"><Badge variant="destructive" style={textInvert}>Badge</Badge></Spec>
            <Spec label="28"><Badge variant="destructive" size={28} style={textInvert}>Badge</Badge></Spec>
          </>
        ),
      },
      {
        label: "현재 Figma = 코드 (text/static/white, 두 모드 4.8:1)",
        render: () => (
          <>
            <Spec label="20"><Badge variant="destructive">Badge</Badge></Spec>
            <Spec label="28"><Badge variant="destructive" size={28}>Badge</Badge></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "static-white", label: "라벨을 text/static-white로", recommended: true },
      { id: "keep", label: "Figma 유지" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "2",
    title: "Leading icon 색이 라벨 색과 따로 고정됨",
    status: "open",
    figma:
      "lucide/circle-dashed 원본 컴포넌트의 stroke가 border/invert-strong에 바인딩돼 있어서 모든 Style에서 같은 색. 다크 모드 default(밝은 회색 배경)에서는 아이콘이 거의 흰색이라 안 보이고, alarm · success에서는 라벨과 색이 다름.",
    code: "아이콘이 라벨과 같은 색(currentColor) — 어느 Style · 모드에서도 라벨과 같이 보임.",
    columns: [
      {
        label: "코드 (라벨 색)",
        render: () => (
          <>
            <Spec label="default"><Badge icon={<CircleDashed />}>Badge</Badge></Spec>
            <Spec label="alarm"><Badge variant="alarm" icon={<CircleDashed />}>Badge</Badge></Spec>
            <Spec label="success"><Badge variant="success" icon={<CircleDashed />}>Badge</Badge></Spec>
          </>
        ),
      },
      {
        label: "Figma (border/invert-strong 고정)",
        render: () => (
          // review.css: .rv-figma-badge-icon paints the icon with border/invert-strong.
          <span className="rv-figma-badge-icon" style={{ display: "contents" }}>
            <Spec label="default"><Badge icon={<CircleDashed />}>Badge</Badge></Spec>
            <Spec label="alarm"><Badge variant="alarm" icon={<CircleDashed />}>Badge</Badge></Spec>
            <Spec label="success"><Badge variant="success" icon={<CircleDashed />}>Badge</Badge></Spec>
          </span>
        ),
      },
    ],
    options: [
      { id: "label-color", label: "코드 유지 — Figma 배지 안 아이콘을 라벨 색 토큰으로 바인딩", recommended: true },
      { id: "figma", label: "Figma 유지 (아이콘 색 고정)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "3",
    title: "라이트 모드 alarm · success 글자 대비 부족",
    status: "open",
    figma:
      "alarm = text/warning(red-400) → 흰 배경에서 2.8:1. success = text/success(green-600) → 3.3:1. 12px 라벨은 AA 4.5:1 필요. 다크 모드는 둘 다 통과.",
    code: "Figma 그대로.",
    columns: [
      {
        label: "Figma (현재 코드)",
        render: () => (
          <>
            <Spec label="alarm"><Badge variant="alarm">Badge</Badge></Spec>
            <Spec label="success"><Badge variant="success">Badge</Badge></Spec>
          </>
        ),
      },
      {
        label: "라이트만 alarm → text/error (red-600, 4.8:1) · success → green-700 (5.0:1)",
        render: () => (
          // review.css: .rv-light-contrast swaps the colors in the light theme only; dark stays as Figma.
          <span className="rv-light-contrast" style={{ display: "contents" }}>
            <Spec label="alarm"><Badge variant="alarm">Badge</Badge></Spec>
            <Spec label="success"><Badge variant="success">Badge</Badge></Spec>
          </span>
        ),
      },
    ],
    options: [
      { id: "darker", label: "라이트 모드에서 더 진한 색 (alarm → text/error, text/success 라이트 값 → green-700)", recommended: true },
      { id: "keep", label: "Figma 유지" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "4",
    title: "라벨 없는 배지 (Label=false)의 크기",
    status: "open",
    figma:
      "Size=20은 높이가 hug라서 Label=false + 아이콘이면 22 × 14로 줄어듦 (Size=28은 높이 고정 → 38 × 28). Label과 아이콘을 모두 끄면 49 × 20 빈 알약이 남음.",
    code: "높이는 Size 값으로 고정 → 아이콘만 있어도 22 × 20 / 38 × 28. 라벨 없는 배지는 icon + aria-label이 타입 수준에서 필수라 빈 배지는 만들 수 없음.",
    columns: [
      {
        label: "코드 — 라벨 없는 배지",
        render: () => (
          <>
            <Spec label="20"><Badge icon={<Bell />} aria-label="알림" /></Spec>
            <Spec label="28"><Badge size={28} icon={<Bell />} aria-label="알림" /></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "keep", label: "코드 유지 — 높이는 Size 그대로, 빈 배지 없음 (Figma Size=20 높이를 고정으로)", recommended: true },
      { id: "figma", label: "Size=20 아이콘만일 때 14px 높이를 의도한 것 — 코드도 맞춤" },
      { id: "dot", label: "빈 배지는 점(dot) 배지를 의도한 것 — 별도 변형으로 정의" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "5",
    title: "destructive만 글자 굵기가 Semi Bold",
    status: "open",
    figma: "destructive = Text-xs/Semi Bold, Text-sm/Semi Bold. 나머지 Style은 Medium. 그래서 같은 라벨인데 destructive만 약 0.3px 넓음.",
    code: "Figma 그대로.",
    columns: [
      {
        label: "나란히 비교",
        render: () => (
          <>
            <Spec label="default"><Badge>Badge</Badge></Spec>
            <Spec label="destructive"><Badge variant="destructive">Badge</Badge></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "keep", label: "의도된 강조 — 유지", recommended: true },
      { id: "medium", label: "모두 Medium으로 통일" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "6",
    title: "표시 전용 — 클릭 · 삭제 없음",
    status: "info",
    figma: "컴포넌트 설명: 클릭/선택/삭제가 필요하면 Chips 사용.",
    code: "<span>으로 렌더링, 이벤트 없음. 라벨 없는 배지는 role=\"img\" + aria-label로 읽힘.",
    columns: [],
  },
]
