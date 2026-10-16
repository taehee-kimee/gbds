import { Select } from "../../src"
import { selectRoles } from "../stories/select"
import { Spec, type ReviewItem } from "./Review"

const roles = selectRoles

export const items: ReviewItem[] = [
  {
    id: "1",
    title: "Select · Menu 분리",
    status: "decided",
    figma: "select 세트 하나에 값 고르기(Type=default · side)와 동작 메뉴(Type=icon \"+\", Dropdown slot Type=menu)가 함께 있음.",
    code: "결정(2026-10-16): <Select>(값 고르기, role=listbox, value/onValueChange) + <Menu>(동작, role=menu, onAction). 트리거 · 목록 모양과 위치 계산은 공유(Dropdown). 옵션은 배열 options / items.",
    columns: [],
  },
  {
    id: "2",
    title: "목록에서 고른 값이 표시되지 않음",
    status: "open",
    figma: "Part/dropdown slot Status = default · active · disabled. active = 마우스/키보드로 가리킨 항목 (background/mute). 이미 고른 값을 표시하는 상태가 없음.",
    code: "열면 고른 값이 가리킨 상태로 시작하지만, 마우스를 움직이면 어느 것이 골라져 있었는지 안 보임. 화면 낭독기에는 aria-selected로 알려짐.",
    columns: [
      { label: "코드 — 열어서 마우스를 움직여 보세요", render: () => <Spec label="filled"><Select options={roles} defaultValue="Sunday Baker" aria-label="Role" /></Spec> },
    ],
    options: [
      { id: "check", label: "고른 항목 오른쪽에 체크(lucide check) 추가", recommended: true },
      { id: "weight", label: "고른 항목 글자를 Medium으로" },
      { id: "none", label: "표시 없음 (Figma 그대로)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "3",
    title: "hovered가 '눌린 것'처럼 진함",
    status: "open",
    figma: "Status=hovered = background/mute 채움 + 흰 글자 + static-gray 테두리 + Focus ring. pressed(열림)는 원래 배경 + 테두리 + Focus ring.",
    code: "Figma 그대로. 마우스만 올려도 포커스 링이 생겨 포커스와 구분이 안 되고, 열리면 오히려 연해짐.",
    columns: [
      { label: "코드 — 마우스를 올린 뒤 눌러 보세요", render: () => <Spec label="primary"><Select options={roles} defaultValue="Data Scientist" aria-label="Role" /></Spec> },
    ],
    options: [
      { id: "light", label: "hovered를 한 단계 연한 배경(background/subtlest)으로, 링은 포커스 · 열림에만", recommended: true },
      { id: "keep", label: "Figma 유지" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "4",
    title: "disabled · error는 primary만 / 없음",
    status: "open",
    figma: "Status=disabled는 Style=primary에만. 에러 상태 없음.",
    code: "disabled 모양을 모든 Style에 적용. Field error면 Input과 같은 border/warning 테두리.",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="reverse disabled"><Select options={roles} defaultValue="Data Scientist" variant="reverse" disabled aria-label="Role" /></Spec>
            <Spec label="invalid"><Select options={roles} invalid placeholder="Choose" aria-label="Role" /></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "add", label: "Figma에 모든 Style의 disabled + error 추가", recommended: true },
      { id: "keep", label: "코드에만 두기" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "5",
    title: "side의 chevron 방향",
    status: "open",
    figma: "Type=side: 닫힘 primary ›, reverse ‹ · 열림(pressed)에서는 반대 방향(‹ / ›)으로 바뀜. hovered는 글자가 static-gray로 흐려짐.",
    code: "Figma 그대로. 목록은 primary = 오른쪽, reverse = 왼쪽으로 열림 (공간이 없으면 반대쪽).",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="side"><Select type="side" options={roles} defaultValue="Data Scientist" aria-label="Role" /></Spec>
            <Spec label="side reverse"><Select type="side" variant="reverse" options={roles} defaultValue="Data Scientist" aria-label="Role" /></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "keep", label: "Figma 유지", recommended: true },
      { id: "fixed", label: "열려도 방향 그대로 (열리는 쪽을 가리킴)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "6",
    title: "구조 · 키보드 · 접근성",
    status: "info",
    figma: "트리거 36 높이 · 패딩 12 · gap 8 · radius md, Text-sm/Medium. 목록 210 너비 · 패딩 4 · gap 4 · background/surface · border/default · shadow-md, 6개 넘으면 스크롤. 항목 32 높이 · radius sm, Text-sm/Regular, 코드 칸 50.",
    code: "WAI-ARIA select-only combobox: 포커스는 트리거에 남고 aria-activedescendant로 항목을 가리킴. ↑↓ · Home/End · PageUp/Down · 글자 입력(같은 글자 반복 시 순환) · Enter/Space 선택 · Tab 선택 후 이동 · Esc/바깥 클릭 닫힘. 목록은 네이티브 popover(최상위 층)라 overflow: hidden 부모에 잘리지 않고, 아래 공간이 없으면 위로 열림. 너비는 트리거보다 좁아지지 않음. Field 안이면 라벨 · 설명 · 에러 연결, name이면 숨은 input으로 form 제출. 스크롤바는 Scrollbar 컴포넌트 전까지 브라우저 thin 스크롤바(색은 Figma).",
    columns: [],
  },
]
