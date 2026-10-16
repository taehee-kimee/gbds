import { Slider } from "../../src"
import { Spec, type ReviewItem } from "./Review"

const w = { width: 300 }

export const items: ReviewItem[] = [
  {
    id: "1",
    title: "hover · focus · 누름 상태가 없음",
    status: "open",
    figma: "Slider 하나 (변형 없음).",
    code: "키보드 포커스 때만 버튼에 ring/focus. 마우스를 올리거나 끌 때 변화 없음.",
    columns: [{ label: "코드 — Tab으로 포커스 · 끌어 보세요", render: () => <Spec label="default"><div style={w}><Slider defaultValue={30} aria-label="Sample" /></div></Spec> }],
    options: [
      { id: "add", label: "Figma에 hover(버튼 테두리 강조) · focus(ring) · active 추가", recommended: true },
      { id: "focus", label: "focus ring만 (현재)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "2",
    title: "disabled 모양",
    status: "open",
    figma: "없음.",
    code: "막대 background/disabled-bold, 버튼 테두리 border/default, 커서 not-allowed.",
    columns: [{ label: "코드", render: () => <Spec label="disabled"><div style={w}><Slider defaultValue={40} disabled aria-label="Sample" /></div></Spec> }],
    options: [
      { id: "keep", label: "현재 모양으로 Figma에 추가", recommended: true },
      { id: "opacity", label: "전체 opacity 70 (Chip과 같게)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "3",
    title: "값 표시 · 범위(두 손잡이)",
    status: "open",
    figma: "값 라벨 · 눈금 · 두 손잡이(범위) 없음.",
    code: "손잡이 하나. 값 표시는 쓰는 쪽에서 (예: Field label \"Opacity 40%\").",
    columns: [],
    options: [
      { id: "none", label: "지금처럼 단일 값만", recommended: true },
      { id: "range", label: "범위(최소 · 최대 두 손잡이) 추가" },
      { id: "tooltip", label: "끄는 동안 값 말풍선 표시 (Tooltip 이후)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "4",
    title: "구조 · 접근성",
    status: "info",
    figma: "트랙 435 × 6 background/subtler · 채움 Bar background/bold · Button 16 원 background/default + 안쪽 1px border/bolder, 버튼 중심 = 채움 끝.",
    code: "네이티브 <input type=\"range\">에 Figma 모양 — ←→↑↓ · Home/End · PageUp/Down, 화면 낭독기 값 읽기, form 제출(name)이 브라우저 기본. 너비는 부모를 채움. Field 안이면 라벨 연결. 채움은 버튼 중심까지.",
    columns: [],
  },
]
