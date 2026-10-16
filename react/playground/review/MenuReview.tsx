import { Plus } from "lucide-react"

import { Menu } from "../../src"
import { menuItems } from "../stories/menu"
import { Spec, type ReviewItem } from "./Review"

export const items: ReviewItem[] = [
  {
    id: "1",
    title: "Type=icon은 primary만 있음",
    status: "open",
    figma: "select Type=icon(\"+\")은 Style=primary의 default · hovered · pressed · disabled만.",
    code: "Select와 같은 Style 규칙을 icon 트리거에도 적용 (reverse · mute · ghost).",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="primary"><Menu type="icon" icon={<Plus />} label="Add" items={menuItems} /></Spec>
            <Spec label="reverse"><Menu type="icon" icon={<Plus />} label="Add" items={menuItems} variant="reverse" /></Spec>
            <Spec label="ghost"><Menu type="icon" icon={<Plus />} label="Add" items={menuItems} variant="ghost" /></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "all", label: "모든 Style 허용 (현재) — Figma에 추가", recommended: true },
      { id: "primary", label: "primary만" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "2",
    title: "Menu vs Button",
    status: "info",
    figma: "\"+\" 트리거는 select 세트 안에 있음 (Button 세트가 아님).",
    code: "<Menu type=\"icon\">로 구현 — 모양은 Select 트리거, 동작은 메뉴 버튼(aria-haspopup=menu). 열리면 첫 항목에 포커스, ↑↓ · Home/End · 글자 입력 · Enter/Space 실행 · Esc는 닫고 버튼으로 포커스 복귀 · Tab은 닫고 다음으로. 고른 동작은 onAction(id).",
    columns: [],
  },
]
