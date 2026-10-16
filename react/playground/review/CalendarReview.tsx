import { Calendar } from "../../src"
import { demoMarker } from "../stories/calendar"
import { Spec, type ReviewItem } from "./Review"

const sep = new Date(2026, 8, 1)
const today = new Date(2026, 8, 4)

export const items: ReviewItem[] = [
  {
    id: "1",
    title: "날짜 셀에 hover 상태가 없음",
    status: "decided",
    figma: "Part/Calendar Status = default · active · disabled · auto-selected. hover 변형 없음.",
    code: "결정(2026-10-16): hover = background/subtlest (10번 결정으로 subtle → subtlest). 선택 안 된 · 선택 가능한 날짜와 월 · 연도 셀. 키보드 포커스는 ring/focus. Figma Part/Calendar에 Status=hover 변형(day · month & year) 추가함.",
    columns: [
      {
        label: "코드 — 마우스를 올려 보세요",
        render: () => <Spec label="default"><Calendar defaultMonth={sep} today={today} /></Spec>,
      },
    ],
    options: [
      { id: "add", label: "Figma에 hover 변형 추가 (예: background/subtler)", recommended: true },
      { id: "none", label: "hover 없이 유지" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "2",
    title: "이전 · 다음 달 날짜",
    status: "decided",
    figma: "그리드 앞뒤의 다른 달 날짜(30, 31 / 1, 2, 3)를 Status=disabled 셀로 표시.",
    code: "결정(2026-10-16): 그대로 둠 — 회색, 클릭 · 포커스 불가 (aria-hidden). 선택 불가 날짜(min/max · isDateDisabled)와 같은 색.",
    columns: [
      {
        label: "코드 — 30·31·1·2·3 vs min/max로 막힌 날",
        render: () => (
          <Spec label="min 9/8 · max 9/24">
            <Calendar defaultMonth={sep} today={today} min={new Date(2026, 8, 8)} max={new Date(2026, 8, 24)} />
          </Spec>
        ),
      },
    ],
    options: [
      { id: "keep", label: "회색 · 비활성 유지 (현재)", recommended: true },
      { id: "click", label: "클릭하면 그 달로 이동 + 선택" },
      { id: "hide", label: "다른 달 날짜는 숨김 (빈칸)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "3",
    title: "항상 6줄 — 높이 고정",
    status: "decided",
    figma: "2026년 9월 = 5줄 → 높이 288. 6줄이 필요한 달(예: 2026년 8월)이나 4줄인 달(2026년 2월) 예시는 없음.",
    code: "결정(2026-10-16): 항상 6줄 → 264 × 324. 달은 최소 4줄(28일 2월이 주 첫날에 시작) · 최대 6줄이고 7줄은 없음 (앞쪽 최대 6일 + 31일 = 37 ≤ 42). 남는 줄은 다음 달 날짜(회색). Figma도 6줄로 갱신함 (default 264 × 324, range 488 × 308).",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="2026-02 · 4줄 + 다음 달 2줄"><Calendar defaultMonth={new Date(2026, 1, 1)} today={today} /></Spec>
            <Spec label="2026-09 · 5줄 + 1줄"><Calendar defaultMonth={sep} today={today} /></Spec>
            <Spec label="2026-08 · 6줄"><Calendar defaultMonth={new Date(2026, 7, 1)} today={today} /></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "six", label: "항상 6줄 (높이 고정, 남는 줄은 다음 달 날짜)", recommended: true },
      { id: "fit", label: "필요한 줄만 (현재 코드)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "4",
    title: "보기를 바꿔도 크기 일정",
    status: "decided",
    figma: "Type=default 264 × 288 → Type=month · year 250 × 232. 헤더 버튼 위치가 바뀜.",
    code: "결정(2026-10-16): 일 · 월 · 연도 보기 모두 264 × 324, range는 모든 보기에서 488 × 308. 월 · 연도 셀(70 × 32)은 날짜 그리드 영역(224 × 232)에 3 × 4 — 위아래 16, 줄 사이 24 (sp-16 · sp-24). Figma 월 · 연도 보기도 264 × 324로 갱신함.",
    columns: [
      {
        label: "코드 — Sep / 2026 버튼으로 전환해 보세요",
        render: () => (
          <>
            <Spec label="day"><Calendar defaultMonth={sep} today={today} /></Spec>
            <Spec label="month"><Calendar defaultMonth={sep} today={today} defaultView="month" /></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "keep", label: "Figma 유지 (크기 변함)" },
      { id: "fixed", label: "세 보기 모두 264 × 288로 고정", recommended: true },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "5",
    title: "range에서 월 · 연도 선택",
    status: "open",
    figma: "Type=range에 Sep · Oct · 2026 버튼이 있지만 누른 뒤의 모습(range × month/year)이 없음.",
    code: "버튼을 누르면 두 달 대신 단일 달력 크기의 월 · 연도 보기로 바뀌고, 고르면 왼쪽 달이 그 달인 두 달 보기로 돌아옴.",
    columns: [
      {
        label: "코드 — Sep 또는 2026을 눌러 보세요",
        render: () => <Spec label="range"><Calendar mode="range" defaultMonth={sep} today={today} /></Spec>,
      },
    ],
    options: [
      { id: "keep", label: "현재 코드 방식 확정", recommended: true },
      { id: "figma", label: "Figma에 range × month / year 화면 추가" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "6",
    title: "range 끝 날짜 미리보기",
    status: "decided",
    figma: "시작 · 끝이 정해진 결과(active + auto-selected 띠)만 있음.",
    code: "결정(2026-10-16): 띠 미리보기 추가. 시작만 고른 상태에서 마우스를 올린(또는 키보드로 포커스한) 날까지 auto-selected 모양(background/selected)의 띠를 그림 — 끝 칸은 radius md. 시작보다 앞쪽도 미리보기됨. 선택이 아니라서 aria-selected는 그대로, 클릭(Enter)해야 확정. 첫 클릭 = 시작, 두 번째 = 끝, 앞을 누르면 둘을 바꿈.",
    columns: [
      {
        label: "코드 — 날짜 하나를 클릭한 뒤 마우스를 움직여 보세요",
        render: () => <Spec label="range"><Calendar mode="range" defaultMonth={sep} today={today} /></Spec>,
      },
    ],
    options: [
      { id: "preview", label: "hover 시 띠 미리보기 추가", recommended: true },
      { id: "none", label: "미리보기 없이 유지" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "7",
    title: "이벤트 마커 (Data)",
    status: "info",
    figma: "4px 점, 바닥에서 4px. published = icon/default 점 · reserved = icon/default 테두리 원 · draft = icon/warning 점. 선택된 날은 icon/invert (draft는 그대로 빨강).",
    code: "marker(date) 함수로 날짜별 마커를 지정. 색만으로 구분되므로 스크린 리더에는 날짜 뒤에 이름을 붙여 읽음 (예: \"Friday, September 4, 2026, Published\" — markerLabels로 변경).",
    columns: [
      {
        label: "코드",
        render: () => <Spec label="Data=True"><Calendar defaultMonth={sep} today={today} defaultValue={new Date(2026, 8, 11)} marker={demoMarker} /></Spec>,
      },
    ],
  },
  {
    id: "8",
    title: "오늘 + 선택이 겹칠 때",
    status: "info",
    figma: "Type=today는 Status=default 변형만 있음.",
    code: "선택 색(background/bold) 위에 today 테두리(border/static-gray)를 그대로 유지.",
    columns: [
      {
        label: "코드 — 9월 4일 = today",
        render: () => <Spec label="today 선택"><Calendar defaultMonth={sep} today={today} defaultValue={today} /></Spec>,
      },
    ],
  },
  {
    id: "9",
    title: "키보드 · 스크린 리더",
    status: "info",
    figma: "해당 없음.",
    code: "WAI-ARIA 날짜 그리드 패턴: ←→ 하루 · ↑↓ 한 주 · Home/End 주 시작/끝 · PageUp/PageDown 한 달 · Shift+PageUp/PageDown 1년 · Enter/Space 선택. Tab으로 들어오는 날은 하나 (선택된 날 또는 1일). 오늘은 aria-current=\"date\", 달이 바뀌면 aria-live로 \"September 2026\"을 읽음.",
    columns: [],
  },
  {
    id: "10",
    title: "다크 모드: hover 색 = range 띠 색",
    status: "decided",
    figma: "다크 모드 background/subtle과 background/selected가 둘 다 neutral-700.",
    code: "결정(2026-10-16): hover = background/subtlest (라이트 n50 · 다크 n900) → 두 모드 모두 달력 배경 · range 띠와 구분됨. subtle은 다크에서 띠와 같고(n700), subtler는 라이트에서 띠와 같고(n100) 다크에서 배경과 같아(n800) 제외.",
    columns: [
      {
        label: "코드 — 다크 쪽에서 범위 밖 날짜에 마우스를 올려 보세요",
        render: () => <Spec label="range"><Calendar mode="range" defaultMonth={sep} today={today} defaultValue={{ start: new Date(2026, 8, 7), end: new Date(2026, 8, 12) }} /></Spec>,
      },
    ],
    options: [
      { id: "subtlest", label: "hover를 background/subtlest로 (두 모드 모두 배경 · 띠와 구분)", recommended: true },
      { id: "keep", label: "그대로 (같은 색 허용)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
]
