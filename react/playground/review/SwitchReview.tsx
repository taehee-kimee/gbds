import { Switch } from "../../src"
import { Spec, type ReviewItem } from "./Review"

export const items: ReviewItem[] = [
  {
    id: "1",
    title: "hover · focus 상태가 없음",
    status: "open",
    figma: "Status = default · disabled.",
    code: "키보드 포커스 때 트랙에 ring/focus. 마우스 hover 표시는 없음.",
    columns: [{ label: "코드 — Tab으로 포커스", render: () => <Spec label="default"><Switch>switch</Switch></Spec> }],
    options: [
      { id: "add", label: "Figma에 focus(ring) 추가, hover는 없이", recommended: true },
      { id: "hover", label: "hover도 추가 (트랙 한 단계 진하게)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "2",
    title: "꺼짐 트랙 대비",
    status: "open",
    figma: "On=off 트랙 background/selected (Light #f5f5f5), 손잡이 static/white — 흰 배경 위에서 트랙 · 손잡이 구분이 shadow-xs뿐.",
    code: "Figma 그대로.",
    columns: [{ label: "코드", render: () => <Spec label="off"><Switch>switch</Switch></Spec> }],
    options: [
      { id: "darker", label: "꺼짐 트랙을 한 단계 진하게 (background/subtle)", recommended: true },
      { id: "keep", label: "Figma 유지" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "3",
    title: "동작 · 접근성",
    status: "info",
    figma: "트랙 44 × 24 (small 40 × 22) · 패딩 2 · 손잡이 20 (18) · shadow-xs, 라벨 Text-sm/Medium 간격 6, disabled = opacity 50 + 꺼짐 트랙 background/disabled.",
    code: "네이티브 체크박스 + role=\"switch\" — 클릭 · Space로 켜고 끔, 화면 낭독기는 '스위치, 켜짐/꺼짐', form 제출(name · value). 라벨을 눌러도 켜짐. 손잡이는 150ms로 미끄러짐(--gb-duration-150). checked / defaultChecked / onChange + onCheckedChange(boolean).",
    columns: [],
  },
]
