import { Chip } from "../../src"
import { Spec, type ReviewItem } from "./Review"

const noop = () => {}

export const items: ReviewItem[] = [
  {
    id: "1",
    title: "disabled는 primary에만 있음",
    status: "open",
    figma: "Status=disabled 변형은 Type=primary 하나 (opacity 70 + text/subtle). outline · secondary · ghost에는 없음.",
    code: "같은 규칙(opacity 70 + text/subtle)을 모든 Type에 적용.",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="primary (Figma)"><Chip disabled>Chips</Chip></Spec>
            <Spec label="outline"><Chip variant="outline" disabled>Chips</Chip></Spec>
            <Spec label="secondary"><Chip variant="secondary" disabled>Chips</Chip></Spec>
            <Spec label="ghost"><Chip variant="ghost" disabled>Chips</Chip></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "same", label: "모든 Type에 같은 규칙 (현재 코드) — Figma에 변형 추가", recommended: true },
      { id: "per-type", label: "Type별로 disabled 모양을 따로 정의" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "2",
    title: "hover 상태가 없음",
    status: "open",
    figma: "Status = default · active · disabled. active는 '켜짐(선택)'이라 Button처럼 hover로 쓸 수 없음.",
    code: "hover 표시 없음. 마우스를 올려도 변화가 없어 누를 수 있는지 알기 어려움.",
    columns: [
      {
        label: "코드 — 마우스를 올려 보세요",
        render: () => (
          <>
            <Spec label="primary"><Chip>Chips</Chip></Spec>
            <Spec label="outline"><Chip variant="outline">Chips</Chip></Spec>
            <Spec label="ghost"><Chip variant="ghost">Chips</Chip></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "add", label: "Figma에 hover 변형 추가 (예: 한 단계 진한 배경)", recommended: true },
      { id: "none", label: "hover 없이 유지" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "3",
    title: "삭제 X가 칩 밖으로 튀어나오고 작음 (16px)",
    status: "open",
    figma: "Delete icon = 16 × 16 Button(icon, default)이 오른쪽 위 모서리에 걸침 (x = 너비 − 12, y = −5).",
    code: "Figma 그대로 (측정 X @ 58.4, −5). 칩 사이 간격이 8이면 X가 옆 칩 쪽으로 4px 넘어감, overflow: hidden 컨테이너에서는 잘림. 터치 대상 16px — WCAG 2.5.8 최소 24 × 24 미달.",
    columns: [
      {
        label: "코드 — 간격 8로 나열",
        render: () => (
          <Spec label="filters">
            <div style={{ display: "flex", gap: 8 }}>
              <Chip variant="outline" onRemove={noop}>React</Chip>
              <Chip variant="outline" onRemove={noop}>Figma</Chip>
              <Chip variant="outline" onRemove={noop}>TypeScript</Chip>
            </div>
          </Spec>
        ),
      },
    ],
    options: [
      { id: "keep", label: "Figma 유지 (모서리 배지)" },
      { id: "inside", label: "X를 칩 안 오른쪽(라벨 뒤)으로 — 크기 · 클릭 영역 확보", recommended: true },
      { id: "hit-area", label: "모서리 유지, 보이지 않는 클릭 영역만 24px로 확장" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "4",
    title: "선택 · 삭제 동작",
    status: "info",
    figma: "Status=active = 켜짐. 여러 개를 켤 수 있음 (컴포넌트 설명).",
    code: "칩 = 토글 버튼 (aria-pressed). isSelected(제어) 또는 defaultSelected + onSelectedChange. onRemove를 넘기면 X 표시 — X 클릭 또는 칩에 포커스한 채 Delete / Backspace로 삭제. disabled면 X 숨김. X와 칩은 형제 버튼 (버튼 안에 버튼을 넣을 수 없음), X 이름은 removeLabel (예: \"React 삭제\").",
    columns: [],
  },
]
