import { House } from "lucide-react"

import { Button, ButtonGroup } from "../../src"
import { Spec, type ReviewItem } from "./Review"

const home = <House />

function Menu({ current }: { current?: string }) {
  return (
    <ButtonGroup variant="menu" aria-label="주 메뉴">
      <Button variant="ghost-rounded" icon={home} aria-label="Home" />
      {["Assets", "Compass", "Content Studio"].map((name) => (
        <Button key={name} variant="ghost" isSelected={current === name || undefined} aria-current={current === name ? "page" : undefined}>
          {name}
        </Button>
      ))}
    </ButtonGroup>
  )
}

export const items: ReviewItem[] = [
  {
    id: "1",
    title: "menu에 현재 페이지(선택) 상태가 없음",
    status: "open",
    figma: "Type=menu의 항목이 모두 ghost Status=default. 어느 페이지에 있는지 표시하는 변형이 없음.",
    code: "현재 항목에 isSelected + aria-current=\"page\" → Button Status=active 모양(background/mute + 흰 글자). 스크린 리더는 \"현재 페이지\"로 읽음.",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="선택 없음 (Figma)"><Menu /></Spec>
            <Spec label="Compass 선택"><Menu current="Compass" /></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "active", label: "Button Status=active 모양을 선택 표시로 사용 (현재 코드)", recommended: true },
      { id: "figma", label: "Figma에 선택 항목 스타일을 따로 정의" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "2",
    title: "menu가 링크가 아니라 버튼",
    status: "open",
    figma: "menu 항목은 Button 인스턴스.",
    code: "적용됨 (2026-10-16): Button에 href를 주면 <a href>로 렌더링 — 새 탭 열기 · 주소 복사 · 가운데 클릭 가능. 모양은 같음. disabled면 href를 빼고 aria-disabled.",
    columns: [],
    options: [
      { id: "href", label: "Button에 href 지원 추가 (href가 있으면 <a>로 렌더링)", recommended: true },
      { id: "button", label: "버튼 유지 (앱 내부 라우팅만 사용)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "3",
    title: "menu 높이 53 vs 52",
    status: "open",
    figma: "높이 53 고정 (padding 8 + 버튼 36 + 8 = 52인데 1px 더 큼) → 버튼이 y=8.5에 놓임.",
    code: "padding 토큰(sp-8 / sp-10)으로 높이를 계산 → 52. 가로 위치는 Figma와 같음 (10 / 58 / 148 / 255).",
    columns: [
      {
        label: "코드 (52)",
        render: () => <Spec label="52px"><Menu /></Spec>,
      },
    ],
    options: [
      { id: "52", label: "52로 맞춤 — Figma 높이를 hug로", recommended: true },
      { id: "53", label: "53 유지 — 코드도 53" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "4",
    title: "버튼 쌍 Type 5개는 라벨만 다름",
    status: "open",
    figma: "skippable · back or forth · save · confirm · Error — 모두 outline + default 버튼, 각 167px. 차이는 라벨(Later/Go Next, Go back/Go Next, Cancel/Save, Cancel/Confirm, Refresh/Back to Dashboard)뿐.",
    code: "Type 구분 없이 variant 하나(actions). 두 Button을 children으로 넘기고 라벨은 자유롭게.",
    columns: [
      {
        label: "코드 — 같은 컴포넌트, 라벨만 다름",
        render: () => (
          <>
            <Spec label="save">
              <ButtonGroup style={{ width: 344 }}>
                <Button variant="outline">Cancel</Button>
                <Button>Save</Button>
              </ButtonGroup>
            </Spec>
            <Spec label="Error">
              <ButtonGroup style={{ width: 344 }}>
                <Button variant="outline">Refresh</Button>
                <Button>Back to Dashboard</Button>
              </ButtonGroup>
            </Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "presets", label: "Figma는 라벨 프리셋으로 유지, 코드는 하나로 (현재)", recommended: true },
      { id: "merge", label: "Figma도 Type 하나로 합치고 라벨은 텍스트 속성으로" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "5",
    title: "버튼 쌍 너비",
    status: "info",
    figma: "344 고정, 두 버튼이 fill로 반씩 (167 + gap 10 + 167).",
    code: "부모 너비를 채우고 두 버튼이 같은 너비로 나눔. 344 안에서는 Figma와 같은 167 / 177 위치 (실측). 너비는 쓰는 쪽에서 정함 (예: 다이얼로그 하단).",
    columns: [],
  },
  {
    id: "6",
    title: "Status=disabled는 그룹 전체에",
    status: "info",
    figma: "Status=disabled는 안의 버튼이 모두 disabled. 컨테이너 모양은 그대로.",
    code: "disabled prop → 안의 모든 Button이 disabled (context). 개별 Button에 disabled={false}를 주면 그 버튼만 활성.",
    columns: [],
  },
]
