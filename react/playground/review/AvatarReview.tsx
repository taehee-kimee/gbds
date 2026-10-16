import { Avatar } from "../../src"
import sample from "../assets/avatar-sample.jpg"
import { Spec, vars, type ReviewItem } from "./Review"

/* Freezes the Image type with the same 1px border the other types draw. */
const imageStroke = vars({ "avatar-border": "var(--gb-border-subtler)" })

export const items: ReviewItem[] = [
  {
    id: "1",
    title: "Initial이 텍스트가 아니라 아웃라인 벡터",
    status: "open",
    figma:
      "Type=Initial 안의 \"S\"는 VECTOR 레이어(텍스트를 outline한 것). 텍스트 속성이 없어서 인스턴스에서 글자를 바꿀 수 없음. 측정 결과 Inter Black 20px과 정확히 일치 (12.19 × 14.91).",
    code: "alt(이름)의 첫 글자를 대문자로 바꿔 실제 텍스트로 렌더링 — Inter Black(900) 20px, icon/default 색.",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="S"><Avatar alt="Sam" /></Spec>
            <Spec label="K"><Avatar alt="Kim" /></Spec>
            <Spec label="M"><Avatar alt="Min" /></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "text", label: "Figma를 TEXT 레이어(Inter Black 20) + 텍스트 속성 \"Initials\"로 교체", recommended: true },
      { id: "keep", label: "벡터 유지 (디자인에서는 글자를 바꾸지 않음)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "2",
    title: "이니셜은 alt의 첫 글자 — 한글 이름은?",
    status: "open",
    figma: "라틴 대문자 한 글자(\"S\") 예시뿐. 이니셜을 어디서 가져오는지, 한글 이름일 때 규칙 없음.",
    code: "alt의 첫 번째 글자(문자만, 공백·숫자·기호 건너뜀)를 대문자로 표시. 항상 한 글자. 한글 이름은 첫 음절 — Inter에 한글이 없어 시스템 폰트로 대체됨. alt=\"\"이면 아이콘.",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="Sam Lee"><Avatar alt="Sam Lee" /></Spec>
            <Spec label="sam lee"><Avatar alt="sam lee" /></Spec>
            <Spec label="김태희"><Avatar alt="김태희" /></Spec>
            <Spec label="&quot;&quot;"><Avatar alt="" /></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "any", label: "한글도 첫 음절 표시 (현재 코드)", recommended: true },
      { id: "latin", label: "라틴 알파벳만 — 없으면 아이콘" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "3",
    title: "Initial 세로 위치가 Figma보다 0.74px 위",
    status: "open",
    figma: "벡터가 y=9 (박스 중앙보다 약 0.45px 아래).",
    code: "line-height 1로 기하학적 중앙 정렬 → 글자 윗변 y=8.26. 가로 위치·크기는 일치 (x 9.9 vs 10).",
    columns: [
      {
        label: "코드 (중앙 정렬)",
        render: () => (
          <Spec label="y 8.26"><Avatar alt="Sam" /></Spec>
        ),
      },
      {
        label: "Figma 위치로 내린 경우",
        render: () => (
          <Spec label="y 9">
            {/* review.css: .rv-figma-offset moves the glyph down to the Figma vector's y=9. */}
            <span className="rv-figma-offset"><Avatar alt="Sam" /></span>
          </Spec>
        ),
      },
    ],
    options: [
      { id: "center", label: "코드 유지 — 1px 미만 차이, Figma 벡터를 중앙에 다시 정렬", recommended: true },
      { id: "figma", label: "코드를 Figma 위치에 맞춤 (translateY 0.74px)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "4",
    title: "Type=Image에는 테두리가 없음",
    status: "open",
    figma: "Initial · Icon은 border/subtler 1px INSIDE 스트로크 + background/default. Image는 둘 다 없음.",
    code: "Figma 그대로. 배경과 비슷한 밝은(또는 어두운) 사진은 윤곽이 사라지고, 투명 PNG는 뒤 배경이 비침.",
    columns: [
      {
        label: "Figma (현재 코드)",
        render: () => (
          <>
            <Spec label="rounded"><Avatar src={sample} alt="Sam Lee" /></Spec>
            <Spec label="circle"><Avatar src={sample} alt="Sam Lee" shape="circle" /></Spec>
          </>
        ),
      },
      {
        label: "다른 Type과 같은 테두리를 그리면",
        render: () => (
          <>
            <Spec label="rounded"><Avatar src={sample} alt="Sam Lee" style={imageStroke} /></Spec>
            <Spec label="circle"><Avatar src={sample} alt="Sam Lee" shape="circle" style={imageStroke} /></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "keep", label: "Figma 유지 (테두리 없음)" },
      { id: "stroke", label: "Image에도 border/subtler 테두리 추가" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "5",
    title: "크기가 32px 하나뿐",
    status: "open",
    figma: "Size 속성 없음. 모든 변형이 32 × 32.",
    code: "32px 고정 (--gb-space-32). size prop 없음.",
    columns: [],
    options: [
      { id: "keep", label: "32px 하나 유지 — 다른 크기가 필요한 컴포넌트(Chatbox 등)를 만들 때 다시 결정", recommended: true },
      { id: "add", label: "지금 Figma에 Size 속성 추가" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "6",
    title: "Type은 prop이 아니라 내용에서 결정됨",
    status: "info",
    figma: "Type=Image | Initial | Icon을 디자이너가 직접 고름.",
    code: "src가 로드되면 Image. 로딩 중이거나 실패하면 alt의 첫 글자(Initial), alt가 비어 있으면 Icon. 실제 데이터에서 사진이 없거나 깨진 사용자를 자동으로 처리하기 위함.",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="src 로드됨"><Avatar src={sample} alt="Sam Lee" /></Spec>
            <Spec label="src 실패"><Avatar src="/does-not-exist.jpg" alt="Sam Lee" /></Spec>
            <Spec label="src 실패, alt &quot;&quot;"><Avatar src="/does-not-exist.jpg" alt="" /></Spec>
          </>
        ),
      },
    ],
  },
  {
    id: "7",
    title: "접근성 이름(alt)이 필수",
    status: "info",
    figma: "해당 없음.",
    code: "alt가 타입 수준에서 필수. 루트가 role=\"img\" + aria-label이라 사진이 깨져 이니셜로 바뀌어도 같은 이름으로 읽힘. 이름이 옆에 보이면 aria-hidden으로 숨김 (alt=\"\"로 숨기면 이니셜도 사라지고 아이콘이 됨).",
    columns: [],
  },
]
