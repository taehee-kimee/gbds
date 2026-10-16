import { Chatbox } from "../../src"
import { slotExamples } from "../stories/chatbox"
import { Spec, type ReviewItem } from "./Review"

const wide = { width: 520 }

export const items: ReviewItem[] = [
  {
    id: "1",
    title: "비어 있을 때도 전송 버튼이 활성",
    status: "open",
    figma: "Status=default(빈 상태)에서도 전송 버튼이 Status=default — 누를 수 있어 보임.",
    code: "Figma 그대로 활성. 대신 비어 있으면(공백만 있어도) 눌러도 아무 일 없음 — 사용자는 왜 안 되는지 알 수 없음.",
    columns: [
      {
        label: "코드 — 빈 상태에서 전송을 눌러 보세요",
        render: () => <Spec label="empty"><Chatbox style={wide} /></Spec>,
      },
    ],
    options: [
      { id: "disable", label: "비어 있으면 전송 버튼 disabled (Figma default에 반영)", recommended: true },
      { id: "keep", label: "활성 유지, 눌러도 무시 (현재)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "2",
    title: "입력 글자 16 통일 + 박스 size",
    status: "decided",
    figma: "텍스트 = Text-xs/Regular (12 / 16).",
    code: "결정(2026-10-16, 다시 결정): 글자는 모든 size에서 Text-base 16/24 (Figma는 12/16 — iOS 확대 문제도 해결). size는 박스 크기만: sm 240 · md 280 · lg 320 (패딩 20 · radius 3xl) · custom = height · width prop으로 직접 (예: height={200}, height=\"40vh\"). 코드에만.",
    columns: [
      {
        label: "코드 — size",
        render: () => (
          <>
            <Spec label="sm · 240"><Chatbox style={wide} defaultValue="오늘 회의 내용을 세 줄로 요약해줘" /></Spec>
            <Spec label="custom · 160"><Chatbox size="custom" height={160} width={520} defaultValue="오늘 회의 내용을 세 줄로 요약해줘" /></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "presets", label: "글자 16 통일 + size sm · md · lg · custom (코드에만)", recommended: true },
      { id: "keep", label: "12px 하나만" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "3",
    title: "높이 — size별 고정, 넘치면 스크롤",
    status: "decided",
    figma: "\"늘어나는 텍스트 영역\" — 한 줄 예시만 있고 최대 높이 규칙 없음.",
    code: "결정(2026-10-16, 다시 결정): maxRows(줄 수 상한) 대신 컨테이너 높이를 size별로 고정 — sm 240 · md 280 · lg 320. 텍스트가 슬롯과 버튼 줄 사이를 채우고, 넘치면 텍스트만 스크롤 (버튼은 항상 보임). --chatbox-height로 덮어쓰기. Figma는 112 그대로 (코드에만).",
    columns: [
      {
        label: "코드 — 여러 줄",
        render: () => (
          <>
            <Spec label="sm 240 · 30줄 입력">
              <Chatbox style={wide} defaultValue={Array.from({ length: 30 }, (_, i) => String(i + 1)).join("\n")} />
            </Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "fixed", label: "size별 고정 높이 (240 · 280 · 320), 넘치면 스크롤", recommended: true },
      { id: "none", label: "상한 없음 (현재)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "4",
    title: "전송 버튼 아이콘이 sparkles",
    status: "decided",
    figma: "전송 위치의 버튼 아이콘 = lucide/sparkles (AI 생성 느낌). 속성 이름은 \"Button\".",
    code: "결정(2026-10-16): 버튼을 직접 넣는 슬롯 — end에 <Button>을 넘겨 교체 (전송 버튼은 type=\"submit\" → onSubmit). 생략하면 sparkles 기본 전송 버튼 (Figma 그대로). 버튼 컴포넌트를 그대로 쓰므로 아이콘 · 스타일 · 개수 자유.",
    columns: [
      {
        label: "코드",
        render: () => <Spec label="send"><Chatbox style={wide} defaultValue="Hello" /></Spec>,
      },
    ],
    options: [
      { id: "keep", label: "sparkles 유지 — AI 대화 전용 입력", recommended: true },
      { id: "send", label: "보내기 아이콘(lucide/send · arrow-up)으로" },
      { id: "prop", label: "아이콘을 바꿀 수 있게 (INSTANCE_SWAP 추가)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "5",
    title: "첨부(+) 버튼은 항상 보임",
    status: "decided",
    figma: "+ 버튼은 켜고 끄는 속성이 없음 (전송 버튼만 \"Button\"으로 숨김 가능).",
    code: "결정(2026-10-16): start 슬롯 — 생략하면 + 버튼(onAttach), Button을 넘기면 교체, null이면 비움. 슬롯의 Button은 Chatbox disabled를 따라감.",
    columns: [],
    options: [
      { id: "auto", label: "onAttach가 없으면 + 숨김 (Figma에 boolean 추가)", recommended: true },
      { id: "keep", label: "항상 표시 (현재)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "6",
    title: "Slot (텍스트 위 영역) → content",
    status: "info",
    figma: "Slot boolean + -> Slot(SLOT 속성). 내용에 맞춰 크기가 정해지는 빈 영역, 텍스트와의 간격 28.",
    code: "content prop → 컴포넌트 안의 슬롯(data-slot=\"content\")에 렌더링. 아무 React 노드나 (2026-10-16 요청: 이름은 content, 내부는 slot). 플레이그라운드 content 컨트롤(Figma Slot 표시 + -> Slot 내용을 하나로, 없음 = 숨김)에서 예시 코드 — 추천 칩(Chip) · 첨부 파일(Avatar + Badge) · 옵션(Checkbox) · 도구(Button) — 를 바꿔 볼 수 있고 코드 바에 JSX로 표시됨.",
    columns: [
      {
        label: "코드 — 예시 4가지",
        render: () => (
          <>
            {Object.entries(slotExamples).map(([name, node]) => (
              <Spec key={name} label={name}><Chatbox style={wide} content={node} /></Spec>
            ))}
          </>
        ),
      },
    ],
  },
  {
    id: "7",
    title: "상태 · 키보드",
    status: "info",
    figma: "Status = default · active · disabled · filled.",
    code: "active = 입력에 포커스 (테두리 border/static-gray + ring/focus) · filled = 값이 있음 · disabled = disabled prop (두 버튼도 disabled). Enter = 전송, Shift+Enter = 줄바꿈, 한글 조합 중 Enter는 전송하지 않음. 빈 곳을 클릭하면 입력으로 포커스. 너비는 Figma 700 고정 대신 부모를 채움.",
    columns: [],
  },
]
