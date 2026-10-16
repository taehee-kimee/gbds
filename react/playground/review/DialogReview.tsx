import { CircleDashed } from "lucide-react"

import { Checkbox, Dialog } from "../../src"
import { Spec, type ReviewItem } from "./Review"

const title = "Heading to ‘Content Studio’ to create your post?"
const description = "Exit this page and start creating a post in ‘Content Studio’."

export const items: ReviewItem[] = [
  {
    id: "1",
    title: "이름 — Figma Popover → 코드 Dialog",
    status: "decided",
    figma: "Popover: 트리거 없이 화면 가운데 뜨는 모달 (설명: anchor 없음, 열림은 부모가 결정).",
    code: "결정(2026-10-16): <Dialog>. 웹에서 Popover는 보통 트리거에 붙는 패널이라 이름을 바꿈. Figma 이름도 Dialog로 바꿀지 검토 필요. Date select의 달력 드롭다운은 이 컴포넌트를 쓸 수 없음 (위치 지정 없음) — 따로 만들어야 함.",
    columns: [],
  },
  {
    id: "2",
    title: "뒤 배경(backdrop)이 Figma에 없음",
    status: "open",
    figma: "패널만 있음. 열렸을 때 뒤 화면 처리 예시 없음.",
    code: "background/backdrop (검정 30%) 토큰으로 뒤를 어둡게 함. 뒤 페이지는 클릭 · 스크롤 안 됨.",
    columns: [],
    options: [
      { id: "backdrop", label: "background/backdrop 사용 (현재) — Figma에 열린 화면 예시 추가", recommended: true },
      { id: "blur", label: "어둡게 + 흐림(blur)" },
      { id: "none", label: "배경 처리 없음" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "3",
    title: "warning: 테두리는 border/warning, 제목은 text/error",
    status: "open",
    figma: "Type=warning — 테두리 border/warning, 제목 text/error, 아이콘은 변수 없는 #F87171 (notification 아이콘도 변수 없는 #FAFAFA).",
    code: "Figma 변수 그대로. 아이콘은 제목 색을 따름 (currentColor) — notification text/default · warning text/error.",
    columns: [
      {
        label: "코드",
        render: () => (
          <Spec label="warning">
            <Dialog open modal={false} variant="warning" icon={<CircleDashed />} title={title} description={description} />
          </Spec>
        ),
      },
    ],
    options: [
      { id: "error", label: "둘 다 error 계열로 통일 (border/error · text/error)", recommended: true },
      { id: "keep", label: "Figma 유지" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "4",
    title: "warning의 확인 버튼",
    status: "open",
    figma: "warning도 Confirm은 기본(default) 버튼. 위험한 동작(삭제 등)용 destructive 버튼 스타일이 Button에 없음.",
    code: "Figma 그대로 default. 바꾸려면 actions에 직접 버튼을 넘김.",
    columns: [],
    options: [
      { id: "keep", label: "기본 버튼 유지", recommended: true },
      { id: "destructive", label: "Button에 destructive 스타일 추가 후 warning에서 사용" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "5",
    title: "Checkbox가 Type=warning에 없음",
    status: "open",
    figma: "Checkbox(\"Do not ask again.\")는 notification에만 있음. 또 Button을 끄면 Checkbox도 함께 숨겨짐 (같은 Wrapper).",
    code: "checkbox · actions는 서로 독립, Type과 무관하게 넣을 수 있음.",
    columns: [
      {
        label: "코드",
        render: () => (
          <Spec label="warning + checkbox">
            <Dialog open modal={false} variant="warning" icon={<CircleDashed />} title={title} description={description} checkbox={<Checkbox variant="mute">Do not ask again.</Checkbox>} />
          </Spec>
        ),
      },
    ],
    options: [
      { id: "both", label: "두 Type 모두 Checkbox 허용 (현재) — Figma warning에도 추가", recommended: true },
      { id: "notification", label: "notification에서만" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "6",
    title: "동작 · 접근성",
    status: "info",
    figma: "560 × hug, 패딩 24, gap 16 (제목 줄 · 설명 8, 체크박스 · 버튼 8), radius lg, shadow-lg. 제목 Text-lg/Semi Bold, 설명 Text-sm/Regular text/subtle, 아이콘 24.",
    code: "네이티브 <dialog> showModal — role=alertdialog, 제목 = 이름 · 설명 = 설명(aria-describedby). 열리면 Cancel에 포커스, Tab은 안에서만 돌고 Esc = Cancel(onCancel → onOpenChange(false)). 바깥 클릭으로는 닫히지 않음 (응답을 기다리는 창). 닫히면 연 버튼으로 포커스 복귀. 열려 있는 동안 뒤 페이지 스크롤 막음. 너비는 화면이 좁으면 양쪽 16 남기고 줄어듦. modal={false}면 페이지 안 제자리에 표시.",
    columns: [],
  },
]
