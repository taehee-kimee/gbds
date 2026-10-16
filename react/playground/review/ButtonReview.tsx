import { CircleDashed } from "lucide-react"

import { Button } from "../../src"
import { Measure, Review, Spec, vars, type ReviewItem } from "./Review"

const icon = <CircleDashed />

/* Figma State=active, frozen inline so it can sit next to default without hovering. */
const activeFilled = vars({
  "button-bg": "var(--gb-background-mute)",
  "button-fg": "var(--gb-text-static-white)",
  "button-border": "transparent",
})
const activeIcon = vars({
  "button-bg": "var(--gb-background-mute)",
  "button-fg": "var(--gb-icon-static-white)",
  "button-border": "transparent",
})
const activeOpacity = vars({ "button-opacity": "var(--gb-opacity-90)" })
const activeLink = vars({ "button-fg": "var(--gb-text-subtle)", "button-underline": "var(--gb-border-mute-subtle)" })
const focusRing = { boxShadow: "var(--gb-ring-focus), inset 0 0 0 var(--gb-stroke-1) var(--button-border)" }
/** Dashed outline so a transparent button's shape is visible. */
const shape = { outline: "1px dashed var(--gb-border-mute)", outlineOffset: 0 }

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
            <Spec label="default"><Button>Button</Button></Spec>
            <Spec label="outline"><Button variant="outline">Button</Button></Spec>
            <Spec label="icon"><Button aria-label="Placeholder" icon={icon} /></Spec>
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
    code: ":focus-visible(키보드 포커스)일 때 --gb-ring-focus 표시. 접근성상 코드에서는 빠질 수 없음.",
    columns: [
      {
        label: "Figma — focus 없음",
        render: () => (
          <>
            <Spec label="default"><Button>Button</Button></Spec>
            <Spec label="outline"><Button variant="outline">Button</Button></Spec>
            <Spec label="ghost"><Button variant="ghost" aria-label="Placeholder" icon={icon} /></Spec>
          </>
        ),
      },
      {
        label: "코드 — focus-visible (Tab 키로도 확인)",
        render: () => (
          <>
            <Spec label="default"><Button style={focusRing}>Button</Button></Spec>
            <Spec label="outline"><Button variant="outline" style={focusRing}>Button</Button></Spec>
            <Spec label="ghost"><Button variant="ghost" aria-label="Placeholder" icon={icon} style={focusRing} /></Spec>
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
    title: "Ghost 버튼 disabled의 배경과 테두리",
    status: "decided",
    figma: "2026-10-16 Figma 재구성에서 해결: icon/ghost · icon/ghost-rounded · 텍스트 ghost 모두 disabled에서도 배경·테두리 없음, 아이콘·글자만 static/gray. (이전: ghost disabled에만 background/disabled + border/overlay)",
    code: "Figma와 동일 — 리뷰 제안(\"disabled도 투명\")이 반영됨.",
    columns: [
      {
        label: "Figma = 코드",
        render: () => (
          <>
            <Spec label="icon ghost"><Button variant="ghost" aria-label="Placeholder" icon={icon} disabled /></Spec>
            <Spec label="icon ghost-rounded"><Button variant="ghost-rounded" aria-label="Placeholder" icon={icon} disabled /></Spec>
            <Spec label="text ghost"><Button variant="ghost" disabled>Button</Button></Spec>
          </>
        ),
      },
    ],
  },
  {
    id: "6",
    title: "모든 채움형 버튼이 hover 시 같은 색이 됨",
    status: "open",
    figma: "default · mute · outline · ghost · google · icon 세 Style 모두 Status=active에서 background/mute로 바뀜 → hover하면 서로 구분되지 않음.",
    code: "Figma를 그대로 따름.",
    stacked: true,
    columns: [
      {
        label: "Figma = 현재 코드 (위: default · 아래: active)",
        render: () => (
          <div className="rv-pairs">
            <Spec label="default"><Button>Button</Button><Button style={{ ...activeFilled, ...activeOpacity }}>Button</Button></Spec>
            <Spec label="mute"><Button variant="mute">Button</Button><Button variant="mute" style={{ ...activeFilled, ...activeOpacity }}>Button</Button></Spec>
            <Spec label="outline"><Button variant="outline">Button</Button><Button variant="outline" style={activeFilled}>Button</Button></Spec>
            <Spec label="icon"><Button aria-label="Placeholder" icon={icon} /><Button aria-label="Placeholder" icon={icon} style={activeIcon} /></Spec>
            <Spec label="ghost-rounded"><Button variant="ghost-rounded" aria-label="Placeholder" icon={icon} /><Button variant="ghost-rounded" aria-label="Placeholder" icon={icon} style={activeIcon} /></Spec>
          </div>
        ),
      },
      {
        label: "제안 예시 — 변형별 한 단계 진하게 (값은 리뷰에서 확정)",
        render: () => (
          <div className="rv-pairs">
            <Spec label="default → bolder"><Button>Button</Button><Button style={vars({ "button-bg": "var(--gb-background-bolder)" })}>Button</Button></Spec>
            <Spec label="mute → subtle"><Button variant="mute">Button</Button><Button variant="mute" style={vars({ "button-bg": "var(--gb-background-subtle)" })}>Button</Button></Spec>
            <Spec label="outline → subtlest"><Button variant="outline">Button</Button><Button variant="outline" style={vars({ "button-bg": "var(--gb-background-subtlest)" })}>Button</Button></Spec>
            <Spec label="icon → subtlest"><Button aria-label="Placeholder" icon={icon} /><Button aria-label="Placeholder" icon={icon} style={vars({ "button-bg": "var(--gb-background-subtlest)" })} /></Spec>
            <Spec label="ghost-rounded → subtlest"><Button variant="ghost-rounded" aria-label="Placeholder" icon={icon} /><Button variant="ghost-rounded" aria-label="Placeholder" icon={icon} style={vars({ "button-bg": "var(--gb-background-subtlest)" })} /></Spec>
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
    title: "Icon ghost 버튼의 상태별 radius",
    status: "decided",
    figma: "2026-10-16 재구성 후: default radius/full · active radius/lg · disabled radius/full. (이전: full · md · lg)",
    code: "Figma와 동일. 점선 = 버튼 영역.",
    columns: [
      {
        label: "Figma = 코드",
        render: () => (
          <>
            <Spec label="default · full"><Button variant="ghost" aria-label="Placeholder" icon={icon} style={shape} /></Spec>
            <Spec label="active · lg"><Button variant="ghost" aria-label="Placeholder" icon={icon} isSelected style={shape} /></Spec>
            <Spec label="disabled · full"><Button variant="ghost" aria-label="Placeholder" icon={icon} disabled style={shape} /></Spec>
          </>
        ),
      },
    ],
  },
  {
    id: "4",
    title: "아이콘 버튼 disabled의 아이콘 색",
    status: "decided",
    figma: "2026-10-16 재구성 후: 세 Style 모두 icon/static/gray로 통일. (이전: icon-rounded만 icon/default, 나머지 icon/subtlest)",
    code: "Figma와 동일.",
    columns: [
      {
        label: "disabled 비교",
        render: () => (
          <>
            <Spec label="icon default"><Button aria-label="Placeholder" icon={icon} disabled /></Spec>
            <Spec label="icon ghost"><Button variant="ghost" aria-label="Placeholder" icon={icon} disabled /></Spec>
            <Spec label="icon ghost-rounded"><Button variant="ghost-rounded" aria-label="Placeholder" icon={icon} disabled /></Spec>
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
                <Button variant="outline" style={{ border: "1px solid var(--gb-border-default)", boxShadow: "none" }}>Button</Button>
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
    figma: "20px 텍스트 박스 아래 별도 Line 노드(1px). 2026-10-16 재구성 후 밑줄은 프레임 아래쪽 1px stroke: border/invert · border/mute-subtle(active) · border/static/gray(disabled).",
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
    code: "@gb/tokens/fonts.css가 같은 Inter 3.19를 제공. Chrome 실측 76.61 × 36. Inter 4(Google Fonts)였다면 75.84.",
    columns: [
      {
        label: "이 브라우저 실측 (px) — Figma 77 × 36",
        render: () => (
          <>
            <Spec label="default"><Measure><Button>Button</Button></Measure></Spec>
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
    code: "isSelected → aria-pressed + data-selected. 모양은 Status=active를 그대로 유지 (hover·pressed와 같은 색). (2026-10-02 현재 모양 유지로 결정) 2026-10-16 재구성 후 ghost active는 회색 채움이 되어 더 이상 흐려 보이지 않음 — link만 여전히 active가 더 흐림.",
    columns: [
      {
        label: "코드 — default · isSelected",
        render: () => (
          <>
            <Spec label="default"><Button>Button</Button></Spec>
            <Spec label="default selected"><Button isSelected>Button</Button></Spec>
            <Spec label="outline"><Button variant="outline">Button</Button></Spec>
            <Spec label="outline selected"><Button variant="outline" isSelected>Button</Button></Spec>
            <Spec label="ghost"><Button variant="ghost" aria-label="Placeholder" icon={icon} /></Spec>
            <Spec label="ghost selected"><Button variant="ghost" aria-label="Placeholder" icon={icon} isSelected /></Spec>
            <Spec label="link selected"><Button variant="link" isSelected>Button</Button></Spec>
          </>
        ),
      },
    ],
  },
  {
    id: "11",
    title: "새 Style: 텍스트 ghost (알약 모양)",
    status: "open",
    figma: "Type=default, Style=ghost — 채움 없음, radius/full, padding 8/16, 높이 36. 아이콘 슬롯(Show icon) 없음. Button Group의 menu 항목이 이 변형을 사용.",
    code: "variant=\"ghost\" + children. icon prop은 타입 수준에서 막음 (Figma에 슬롯 없음).",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="default"><Button variant="ghost">Assets</Button></Spec>
            <Spec label="active"><Button variant="ghost" isSelected>Assets</Button></Spec>
            <Spec label="disabled"><Button variant="ghost" disabled>Assets</Button></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "keep", label: "아이콘 없이 유지", recommended: true },
      { id: "icon", label: "Figma에 Show icon 슬롯 추가 (다른 텍스트 Style과 통일)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "12",
    title: "새 Type: google — 라벨이 Figma 속성이 아님",
    status: "open",
    figma: "Type=google — background/bolder + border/muted, Google 로고(16px) + \"Continue with Google\" (gap 6). 텍스트가 -> Label 속성에 연결돼 있지 않아 인스턴스에서 문구를 바꿀 수 없음. Style은 default 하나.",
    code: "variant=\"google\" + children(라벨). 로고는 컴포넌트에 내장 (브랜드 색 고정).",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="default"><Button variant="google">Continue with Google</Button></Spec>
            <Spec label="active"><Button variant="google" isSelected>Continue with Google</Button></Spec>
            <Spec label="disabled"><Button variant="google" disabled>Continue with Google</Button></Spec>
            <Spec label="한국어"><Button variant="google">Google로 계속하기</Button></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "bind", label: "Figma에서 텍스트를 -> Label 속성에 연결", recommended: true },
      { id: "fixed", label: "문구 고정 (코드도 children 대신 고정 문구)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "13",
    title: "Figma 재구성에 맞춘 코드 API 변경",
    status: "info",
    figma: "2026-10-16: Type(default · icon · google) × Style(default · mute · outline · link · ghost · ghost-rounded) × Status, 27개. Trailing icon → Show icon.",
    code: "variant = Figma Style (primary → default, icon → 생략, icon-rounded → ghost-rounded). Type=icon은 children 없이 icon + aria-label. trailingIcon → icon (link도 12px 아이콘 지원). data-type / data-variant로 Figma 값을 그대로 노출.",
    columns: [
      {
        label: "예시",
        render: () => (
          <>
            <Spec label="<Button>"><Button>Button</Button></Spec>
            <Spec label="icon={…}"><Button icon={icon}>Button</Button></Spec>
            <Spec label="link + icon"><Button variant="link" icon={icon}>Button</Button></Spec>
            <Spec label="icon only"><Button icon={icon} aria-label="Placeholder" /></Spec>
          </>
        ),
      },
    ],
  },
]
