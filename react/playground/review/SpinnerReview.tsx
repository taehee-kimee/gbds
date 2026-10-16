import { Spinner } from "../../src"
import { Spec, type ReviewItem } from "./Review"

export const items: ReviewItem[] = [
  {
    id: "1",
    title: "라벨 없는 고리만 쓰는 경우",
    status: "open",
    figma: "Spinner는 항상 테두리 상자 + 고리 + 라벨. 버튼 안 · 목록 끝 등에 넣을 고리만 있는 형태가 없음.",
    code: "Figma대로 상자 + 라벨만 제공.",
    columns: [{ label: "코드", render: () => <Spec label="outline"><Spinner /></Spec> }],
    options: [
      { id: "ring", label: "고리만 쓰는 형태(크기 12 · 16 · 24) 추가 — 버튼 loading 등에", recommended: true },
      { id: "keep", label: "지금처럼 라벨 상자만" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "2",
    title: "회전 속도 · 동작 줄이기",
    status: "open",
    figma: "Part/Spinner Progress -90 · 0 · 90 · 180 = 회전 장면. 속도 정의 없음.",
    code: "1초에 한 바퀴(2 × --gb-duration-500, linear). 동작 줄이기 설정이면 3초에 한 바퀴 — 멈추면 고장처럼 보여서 느리게만.",
    columns: [],
    options: [
      { id: "keep", label: "현재 (1초 · 동작 줄이기면 3초)", recommended: true },
      { id: "stop", label: "동작 줄이기면 멈춤" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "3",
    title: "구조 · 접근성",
    status: "info",
    figma: "높이 20 · 패딩 2/8 · gap 4 · radius md, 고리 12 (호 144° · 두께 1.2), Text-xs/Medium. outline = border/default · reversed = surface-secondary · primary = background/bold + invert.",
    code: "role=status — 나타날 때 라벨을 화면 낭독기가 조용히 읽음. 고리는 장식(aria-hidden), SVG 없이 CSS(conic-gradient + mask). 라벨 기본값 \"Processing\" — 한국어 화면이면 label을 바꿔 주세요.",
    columns: [],
  },
]
