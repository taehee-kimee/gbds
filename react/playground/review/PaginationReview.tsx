import { Pagination } from "../../src"
import { Spec, type ReviewItem } from "./Review"

export const items: ReviewItem[] = [
  {
    id: "1",
    title: "dot — 현재 페이지가 오히려 흐림",
    status: "open",
    figma: "Part/pagination Type=dot: default = icon/default 채움 · active(현재) = icon/pressed 채움 + icon/faint 테두리 1px. 현재 페이지가 다른 점보다 연해 보임.",
    code: "Figma 그대로. 현재 점은 aria-current=\"page\"라 스크린 리더에는 구분됨.",
    columns: [
      {
        label: "코드 (Figma 그대로)",
        render: () => (
          <>
            <Spec label="1 / 5"><Pagination variant="dot" totalPages={5} defaultPage={1} /></Spec>
            <Spec label="3 / 5"><Pagination variant="dot" totalPages={5} defaultPage={3} /></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "swap", label: "뒤집기 — 현재 = 진하게(icon/default), 나머지 = 연하게", recommended: true },
      { id: "keep", label: "Figma 유지" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "2",
    title: "hover 상태가 없음",
    status: "open",
    figma: "Part/pagination Status = default · active. hover 없음.",
    code: "hover 표시 없음.",
    columns: [
      {
        label: "코드 — 마우스를 올려 보세요",
        render: () => <Spec label="number"><Pagination totalPages={5} defaultPage={2} /></Spec>,
      },
    ],
    options: [
      { id: "add", label: "Figma에 hover 추가 (예: background/subtlest — Calendar와 같게)", recommended: true },
      { id: "none", label: "hover 없이 유지" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "3",
    title: "처음 · 끝에서 이전 · 다음 버튼",
    status: "open",
    figma: "chevron에 disabled 변형이 없음.",
    code: "1페이지에서 이전, 마지막 페이지에서 다음이 disabled (아이콘 icon/static-gray, 클릭 안 됨).",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="1 / 5"><Pagination totalPages={5} defaultPage={1} /></Spec>
            <Spec label="5 / 5"><Pagination totalPages={5} defaultPage={5} /></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "disabled", label: "disabled로 흐리게 (현재) — Figma에 변형 추가", recommended: true },
      { id: "hide", label: "끝에서는 숨기기" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "4",
    title: "페이지가 많을 때 — 마지막 페이지 표시",
    status: "open",
    figma: "예시 ‹ 1 2 3 … › — 마지막 페이지 번호가 없음. 설명: 페이지가 많으면 현재 주변만 남기고 … 로 줄임.",
    code: "처음 · 끝 페이지는 항상 표시. 이전 · 다음 사이 칸 수는 maxItems (기본 7, … 포함)로 고정 — 넘겨도 넓이가 일정함.",
    columns: [
      {
        label: "코드 — 10페이지",
        render: () => (
          <>
            <Spec label="1"><Pagination totalPages={10} defaultPage={1} /></Spec>
            <Spec label="5"><Pagination totalPages={10} defaultPage={5} /></Spec>
            <Spec label="10"><Pagination totalPages={10} defaultPage={10} /></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "boundary", label: "처음 · 끝 항상 표시 (현재)", recommended: true },
      { id: "figma", label: "Figma처럼 끝 번호 없이 … 만" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "5",
    title: "ellipsis · chevron의 active 변형",
    status: "info",
    figma: "Part/pagination에 Type=ellipsis · chevron도 Status=active(테두리) 변형이 있음.",
    code: "쓰지 않음 — …은 누를 수 없는 표시(aria-hidden), 이전 · 다음은 현재 페이지가 될 수 없음. 포커스는 ring/focus.",
    columns: [],
  },
  {
    id: "6",
    title: "구조 · 접근성",
    status: "info",
    figma: "gap 4 · number 36 × 36 radius md Text-sm/Medium · 아이콘 16 · dot 6 × 6.",
    code: "<nav aria-label=\"Pagination\">, 페이지는 버튼 (aria-label \"Page n\", 현재는 aria-current=\"page\"). dot은 보이는 크기 6, 클릭 영역 14. 이름은 previousLabel · nextLabel · pageLabel로 바꿈. 링크(href)로 넘기는 방식은 아직 없음.",
    columns: [],
  },
]
