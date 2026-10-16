import { Progress } from "../../src"
import { Spec, type ReviewItem } from "./Review"

export const items: ReviewItem[] = [
  {
    id: "1",
    title: "completed 라벨이 고정 문구",
    status: "open",
    figma: "Status=completed의 라벨은 \"Completed\" 고정 — -> Placeholder · Text 속성과 연결되지 않음 (Text를 꺼도 보임).",
    code: "label을 넘긴 경우에만 라벨 줄을 보이고, 완료되면 completedLabel(기본 \"Completed\")로 바꿈. 라벨이 없으면 완료돼도 라벨 없음.",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="label"><Progress style={{ width: 226 }} value={100} label="Loading image.." /></Spec>
            <Spec label="completedLabel"><Progress style={{ width: 226 }} value={100} label="Loading image.." completedLabel="Image ready" /></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "prop", label: "completed 라벨도 속성으로 (Figma에 텍스트 속성 연결)", recommended: true },
      { id: "fixed", label: "\"Completed\" 고정" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "2",
    title: "진행 중 · 완료가 화면 낭독기에 알려지지 않음",
    status: "open",
    figma: "알림 방식 정의 없음.",
    code: "role=progressbar + aria-valuenow만 — 값이 바뀌어도 자동으로 읽히지 않음 (포커스해야 읽힘). 완료를 알리려면 쓰는 쪽이 별도 알림(live region)을 둬야 함.",
    columns: [],
    options: [
      { id: "consumer", label: "쓰는 쪽에서 알림 (현재)", recommended: true },
      { id: "live", label: "완료 라벨을 컴포넌트가 aria-live로 알림" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "3",
    title: "채워질 때 애니메이션",
    status: "decided",
    figma: "모션 정의 없음.",
    code: "결정(2026-10-16): 모션 토큰을 새로 만들고 적용 — 바가 새 값까지 --gb-duration-300 · --gb-easing-standard로 차오름. 화면 동작 줄이기(prefers-reduced-motion) 설정이면 바로 바뀜.",
    columns: [],
  },
  {
    id: "4",
    title: "값 · 구조",
    status: "info",
    figma: "Part/Progress Percentage(%) = 0 · 10 · … · 100 (11 변형), 바 8 높이 radius full, 바탕 background/subtler · 채움 background/bolder. Progress = 라벨(Text-xs/Semi Bold, text/subtle) + 8 + 바, 226 너비.",
    code: "value / max (기본 100) — 10 단위가 아니라 아무 값. 너비는 부모를 채움. Status는 prop이 아니라 value가 max면 completed. 라벨이 진행 막대의 이름(aria-labelledby). 진행량을 모르면 Spinner.",
    columns: [],
  },
]
