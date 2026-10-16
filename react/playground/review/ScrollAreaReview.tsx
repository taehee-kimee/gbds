import { ScrollArea } from "../../src"
import { Spec, type ReviewItem } from "./Review"

const lines = Array.from({ length: 20 }, (_, i) => <p key={i} style={{ margin: "0 0 8px" }}>Line {i + 1}</p>)
const box = { width: 160, height: 160, padding: 12, boxSizing: "border-box", color: "var(--gb-text-default)", font: "var(--gb-typography-sm)" } as const

export const items: ReviewItem[] = [
  {
    id: "1",
    title: "이름 — Figma Scroll bar → 코드 ScrollArea",
    status: "info",
    figma: "Scroll bar = 스크롤바 막대 하나 (Type Thick 10 · Thin 5, Position Start · Center · End).",
    code: "웹에서는 스크롤바만 따로 만들 수 없어 '스크롤되는 영역'(<ScrollArea>)이 그 안의 스크롤바 모양을 바꿈. Position은 스크롤 위치에 따라 브라우저가 정함. Select · Menu 목록도 같은 스크롤바 (Figma Dropdown slot의 Scroll bar Thick).",
    columns: [],
  },
  {
    id: "2",
    title: "트랙 위아래 여백 16",
    status: "open",
    figma: "Scroll bar 프레임에 위아래 패딩 16이 있지만 막대(Indicator)는 0부터 시작 — 여백이 실제로 적용되는지 불분명.",
    code: "여백 없이 트랙 전체 높이 사용.",
    columns: [{ label: "코드", render: () => <Spec label="thick"><ScrollArea style={box} aria-label="Sample">{lines}</ScrollArea></Spec> }],
    options: [
      { id: "none", label: "여백 없음 (현재) — Figma 패딩 제거", recommended: true },
      { id: "inset", label: "트랙 위아래 16 띄우기" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "3",
    title: "hover · 드래그 상태 없음",
    status: "open",
    figma: "막대 색은 background/subtle 하나.",
    code: "마우스를 올리거나 끌어도 색이 같음.",
    columns: [{ label: "코드 — 막대를 끌어 보세요", render: () => <Spec label="thick"><ScrollArea style={box} aria-label="Sample">{lines}</ScrollArea></Spec> }],
    options: [
      { id: "add", label: "hover · 드래그 때 한 단계 진하게 (background/bold 계열)", recommended: true },
      { id: "keep", label: "그대로" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "4",
    title: "브라우저별 차이",
    status: "info",
    figma: "—",
    code: "Chrome · Edge · Safari = Figma 그대로(폭 10 / 5, 둥근 트랙 · 막대). Firefox = 폭 지정 불가, 브라우저의 thin(약 8px) + Figma 색. 모바일 · 트랙패드 오버레이 스크롤바 환경에서도 이 모양이 항상 보임. 포커스 가능(tabIndex 0)해서 키보드로 스크롤 가능 — 포커스 시 ring/focus.",
    columns: [],
  },
]
