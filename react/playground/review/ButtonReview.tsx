import { CircleDashed } from "lucide-react"

import { Button } from "../../src"
import { Measure, Review, Spec, vars, type ReviewItem } from "./Review"

const icon = <CircleDashed />

/* Figma State=active, frozen inline so it can sit next to default without hovering. */
const activeFilled = vars({
  "button-bg": "var(--gs-background-mute)",
  "button-fg": "var(--gs-text-static-white)",
  "button-border": "transparent",
})
const activeIcon = vars({
  "button-bg": "var(--gs-background-mute)",
  "button-fg": "var(--gs-icon-static-white)",
  "button-border": "transparent",
})
const activeOpacity = vars({ "button-opacity": "var(--gs-opacity-90)" })
const activeGhost = vars({ "button-fg": "var(--gs-icon-subtlest)", "button-radius": "var(--gs-radius-md)" })
const activeLink = vars({ "button-fg": "var(--gs-text-subtle)", "button-underline": "var(--gs-border-mute-subtle)" })
const focusRing = { boxShadow: "var(--gs-ring-focus), inset 0 0 0 var(--gs-stroke-1) var(--button-border)" }
/** Dashed outline so a transparent button's shape is visible. */
const shape = { outline: "1px dashed var(--gs-border-mute)", outlineOffset: 0 }

export const items: ReviewItem[] = [
  {
    id: "1",
    title: "Figma의 State=active는 hover인가, pressed인가",
    status: "open",
    figma: "State 변형이 default / active / disabled 3개뿐. hover와 pressed의 구분이 없음.",
    code: "active 스타일을 :hover(마우스 기기만)와 :active(누르는 중) 둘 다에 적용 중.",
    columns: [
      {
        label: "Figma 3개 상태",
        render: () => (
          <>
            <Spec label="default"><Button>Button</Button></Spec>
            <Spec label="active"><Button style={{ ...activeFilled, ...activeOpacity }}>Button</Button></Spec>
            <Spec label="disabled"><Button disabled>Button</Button></Spec>
          </>
        ),
      },
      {
        label: "코드 — 직접 hover · 클릭해 보세요",
        render: () => (
          <>
            <Spec label="primary"><Button>Button</Button></Spec>
            <Spec label="outline"><Button variant="outline">Button</Button></Spec>
            <Spec label="icon"><Button variant="icon" aria-label="Placeholder">{icon}</Button></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "same", label: "hover와 pressed가 같은 스타일 (현재 코드 유지)" },
      { id: "split", label: "Figma에 hover / pressed 변형을 따로 추가", recommended: true },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "2",
    title: "키보드 포커스 상태가 Figma에 없음",
    status: "open",
    figma: "Button에 focus 변형 없음. 이펙트 스타일 \"Box Shadow/Focus ring\"은 다른 곳에서 290회 사용 중.",
    code: ":focus-visible(키보드 포커스)일 때 --gs-ring-focus 표시. 접근성상 코드에서는 빠질 수 없음.",
    columns: [
      {
        label: "Figma — focus 없음",
        render: () => (
          <>
            <Spec label="primary"><Button>Button</Button></Spec>
            <Spec label="outline"><Button variant="outline">Button</Button></Spec>
            <Spec label="ghost"><Button variant="ghost" aria-label="Placeholder">{icon}</Button></Spec>
          </>
        ),
      },
      {
        label: "코드 — focus-visible (Tab 키로도 확인)",
        render: () => (
          <>
            <Spec label="primary"><Button style={focusRing}>Button</Button></Spec>
            <Spec label="outline"><Button variant="outline" style={focusRing}>Button</Button></Spec>
            <Spec label="ghost"><Button variant="ghost" aria-label="Placeholder" style={focusRing}>{icon}</Button></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "add-figma", label: "Figma에 Focus 변형 추가 (코드와 동일한 ring)", recommended: true },
      { id: "code-only", label: "코드에만 두고 Figma는 그대로" },
      { id: "restyle", label: "ring 스타일 변경 (메모에 기록)" },
    ],
  },
  {
    id: "5",
    title: "Ghost 버튼만 disabled일 때 배경과 테두리가 생김",
    status: "open",
    figma: "ghost default는 배경·테두리 없음. disabled에서만 background/disabled + border/overlay가 생김.",
    code: "Figma를 그대로 따름.",
    columns: [
      {
        label: "Figma = 현재 코드",
        render: () => (
          <>
            <Spec label="default"><Button variant="ghost" aria-label="Placeholder">{icon}</Button></Spec>
            <Spec label="disabled"><Button variant="ghost" aria-label="Placeholder" disabled>{icon}</Button></Spec>
          </>
        ),
      },
      {
        label: "제안 — disabled도 투명",
        render: () => (
          <>
            <Spec label="default"><Button variant="ghost" aria-label="Placeholder">{icon}</Button></Spec>
            <Spec label="disabled">
              <Button
                variant="ghost"
                aria-label="Placeholder"
                disabled
                style={vars({ "button-bg": "transparent", "button-border": "transparent", "button-radius": "var(--gs-radius-full)" })}
              >
                {icon}
              </Button>
            </Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "keep", label: "Figma 유지 (disabled에 배경·테두리)" },
      { id: "transparent", label: "disabled도 투명, 아이콘 색만 흐리게", recommended: true },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "6",
    title: "모든 채움형 버튼이 hover 시 같은 색이 됨",
    status: "open",
    figma: "primary · mute · outline · icon · icon-rounded 모두 active에서 background/mute로 바뀜 → hover하면 서로 구분되지 않음.",
    code: "Figma를 그대로 따름.",
    stacked: true,
    columns: [
      {
        label: "Figma = 현재 코드 (위: default · 아래: active)",
        render: () => (
          <div className="rv-pairs">
            <Spec label="primary"><Button>Button</Button><Button style={{ ...activeFilled, ...activeOpacity }}>Button</Button></Spec>
            <Spec label="mute"><Button variant="mute">Button</Button><Button variant="mute" style={{ ...activeFilled, ...activeOpacity }}>Button</Button></Spec>
            <Spec label="outline"><Button variant="outline">Button</Button><Button variant="outline" style={activeFilled}>Button</Button></Spec>
            <Spec label="icon"><Button variant="icon" aria-label="Placeholder">{icon}</Button><Button variant="icon" aria-label="Placeholder" style={activeIcon}>{icon}</Button></Spec>
            <Spec label="icon-rounded"><Button variant="icon-rounded" aria-label="Placeholder">{icon}</Button><Button variant="icon-rounded" aria-label="Placeholder" style={activeIcon}>{icon}</Button></Spec>
          </div>
        ),
      },
      {
        label: "제안 예시 — 변형별 한 단계 진하게 (값은 리뷰에서 확정)",
        render: () => (
          <div className="rv-pairs">
            <Spec label="primary → bolder"><Button>Button</Button><Button style={vars({ "button-bg": "var(--gs-background-bolder)" })}>Button</Button></Spec>
            <Spec label="mute → subtle"><Button variant="mute">Button</Button><Button variant="mute" style={vars({ "button-bg": "var(--gs-background-subtle)" })}>Button</Button></Spec>
            <Spec label="outline → subtlest"><Button variant="outline">Button</Button><Button variant="outline" style={vars({ "button-bg": "var(--gs-background-subtlest)" })}>Button</Button></Spec>
            <Spec label="icon → subtlest"><Button variant="icon" aria-label="Placeholder">{icon}</Button><Button variant="icon" aria-label="Placeholder" style={vars({ "button-bg": "var(--gs-background-subtlest)" })}>{icon}</Button></Spec>
            <Spec label="icon-rounded → subtlest"><Button variant="icon-rounded" aria-label="Placeholder">{icon}</Button><Button variant="icon-rounded" aria-label="Placeholder" style={vars({ "button-bg": "var(--gs-background-subtlest)" })}>{icon}</Button></Spec>
          </div>
        ),
      },
    ],
    options: [
      { id: "keep", label: "Figma 유지 (모두 background/mute)" },
      { id: "per-variant", label: "변형별 hover 색 따로 정의", recommended: true },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "3",
    title: "Ghost 버튼의 상태별 radius",
    status: "decided",
    figma: "default radius/full · active radius/md · disabled radius/lg",
    code: "Figma와 동일 (2026-10-01 Figma를 따르기로 결정). 점선 = 버튼 영역.",
    columns: [
      {
        label: "Figma = 코드",
        render: () => (
          <>
            <Spec label="default · full"><Button variant="ghost" aria-label="Placeholder" style={shape}>{icon}</Button></Spec>
            <Spec label="active · md"><Button variant="ghost" aria-label="Placeholder" style={{ ...activeGhost, ...shape }}>{icon}</Button></Spec>
            <Spec label="disabled · lg"><Button variant="ghost" aria-label="Placeholder" disabled style={shape}>{icon}</Button></Spec>
          </>
        ),
      },
    ],
  },
  {
    id: "4",
    title: "icon-rounded disabled의 아이콘 색",
    status: "decided",
    figma: "icon-rounded disabled만 icon/default. 다른 아이콘 변형은 icon/subtlest.",
    code: "Figma와 동일 (2026-10-01 Figma를 따르기로 결정).",
    columns: [
      {
        label: "disabled 비교",
        render: () => (
          <>
            <Spec label="icon"><Button variant="icon" aria-label="Placeholder" disabled>{icon}</Button></Spec>
            <Spec label="ghost"><Button variant="ghost" aria-label="Placeholder" disabled>{icon}</Button></Spec>
            <Spec label="icon-rounded"><Button variant="icon-rounded" aria-label="Placeholder" disabled>{icon}</Button></Spec>
          </>
        ),
      },
    ],
  },
  {
    id: "7",
    title: "테두리 구현 방식",
    status: "info",
    figma: "1px stroke, INSIDE",
    code: "inset box-shadow로 구현 → 테두리 유무와 상관없이 같은 너비. CSS border를 쓰면 2px 넓어짐.",
    columns: [
      {
        label: "너비 비교 (px)",
        render: () => (
          <>
            <Spec label="mute (테두리 없음)"><Measure><Button variant="mute">Button</Button></Measure></Spec>
            <Spec label="outline · inset (코드)"><Measure><Button variant="outline">Button</Button></Measure></Spec>
            <Spec label="outline · CSS border였다면">
              <Measure>
                <Button variant="outline" style={{ border: "1px solid var(--gs-border-default)", boxShadow: "none" }}>Button</Button>
              </Measure>
            </Spec>
          </>
        ),
      },
    ],
  },
  {
    id: "8",
    title: "Link 밑줄",
    status: "info",
    figma: "20px 텍스트 박스 아래 별도 Line 노드(1px). stroke는 icon/bold · border/mute-subtle · border/static-gray.",
    code: "text-decoration underline, offset 4px. 시각적으로 동일하고 텍스트 줄바꿈을 따라감.",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="default"><Button variant="link">Button</Button></Spec>
            <Spec label="active"><Button variant="link" style={activeLink}>Button</Button></Spec>
            <Spec label="disabled"><Button variant="link" disabled>Button</Button></Spec>
          </>
        ),
      },
    ],
  },
  {
    id: "9",
    title: "너비 (폰트 렌더링)",
    status: "info",
    figma: "77 × 36 — Figma는 Inter 3.19로 렌더링.",
    code: "@gs/tokens/fonts.css가 같은 Inter 3.19를 제공. Chrome 실측 76.61 × 36. Inter 4(Google Fonts)였다면 75.84.",
    columns: [
      {
        label: "이 브라우저 실측 (px) — Figma 77 × 36",
        render: () => (
          <>
            <Spec label="primary"><Measure><Button>Button</Button></Measure></Spec>
            <Spec label="outline"><Measure><Button variant="outline">Button</Button></Measure></Spec>
          </>
        ),
      },
    ],
  },
  {
    id: "10",
    title: "isSelected(선택 상태)가 Figma Button에 없음",
    status: "decided",
    figma:
      "Button에 selected 변형 없음. Floating pill(Button Group, 76:8691)의 선택 항목은 Button 인스턴스가 아닌 별도 프레임으로 background/mute를 채움.",
    code: "isSelected → aria-pressed + data-selected. 모양은 State=active를 그대로 유지 (hover·pressed와 같은 색). ghost·link는 active가 더 흐린 색이라 선택된 쪽이 오히려 비활성처럼 보임. ButtonGroup에서 사용 예정. (2026-10-02 현재 모양 유지로 결정)",
    columns: [
      {
        label: "코드 — default · isSelected",
        render: () => (
          <>
            <Spec label="primary"><Button>Button</Button></Spec>
            <Spec label="primary selected"><Button isSelected>Button</Button></Spec>
            <Spec label="outline"><Button variant="outline">Button</Button></Spec>
            <Spec label="outline selected"><Button variant="outline" isSelected>Button</Button></Spec>
            <Spec label="ghost"><Button variant="ghost" aria-label="Placeholder">{icon}</Button></Spec>
            <Spec label="ghost selected"><Button variant="ghost" aria-label="Placeholder" isSelected>{icon}</Button></Spec>
            <Spec label="link selected"><Button variant="link" isSelected>Button</Button></Spec>
          </>
        ),
      },
    ],
  },
]
