import { Field, Input, Select } from "../../src"
import { inputActive } from "../stories/input"
import { Spec, type ReviewItem } from "./Review"

const w = { width: 300 }

export const items: ReviewItem[] = [
  {
    id: "1",
    title: "Field 에러 메시지가 Figma Input에 없음",
    status: "open",
    figma: "Input(필드)에는 Status = default · active · filled 뿐. 에러 문구는 Input time Status=error에만 있음 (Text-sm/Medium, text/warning, 입력 아래 12).",
    code: "Field error prop — Input time과 같은 모양으로 표시하고 입력을 invalid(Part/Input Status=error)로 만듦.",
    columns: [
      {
        label: "코드",
        render: () => (
          <Spec label="error">
            <Field label="Email" error="이메일 형식이 아니에요." style={w}>
              <Input type="email" defaultValue="taehee@" />
            </Field>
          </Spec>
        ),
      },
    ],
    options: [
      { id: "add", label: "Figma Input에 Status=error (에러 문구) 추가", recommended: true },
      { id: "code", label: "코드에만 두기" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "2",
    title: "에러가 있으면 설명을 대신함",
    status: "open",
    figma: "설명과 에러가 함께 있는 예시가 없음.",
    code: "error가 있으면 description 자리에 error를 표시 (한 줄만). 스크린 리더도 그 문구를 읽음.",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="description">
              <Field label="Email" description="로그인에 쓰는 주소" style={w}><Input type="email" /></Field>
            </Spec>
            <Spec label="+ error">
              <Field label="Email" description="로그인에 쓰는 주소" error="이메일 형식이 아니에요." style={w}><Input type="email" defaultValue="taehee@" /></Field>
            </Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "replace", label: "에러가 설명을 대신 (현재)", recommended: true },
      { id: "both", label: "둘 다 표시 (에러 위, 설명 아래)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "3",
    title: "라벨 하나에 입력 여러 개 (Figma Input)",
    status: "open",
    figma: "Input(필드) = 라벨 \"File Upload\" 아래에 Textfield · Upload · Select · Link 네 줄을 boolean으로 켜고 끔. 각 줄에는 자기 라벨이 없음.",
    code: "Field에 Input이 하나면 라벨이 그 입력의 이름(<label for>), 여러 개면 라벨이 그룹 이름(role=group)이 되고 각 Input은 aria-label이 따로 필요.",
    columns: [
      {
        label: "코드 — 여러 줄",
        render: () => (
          <Spec label="group">
            <Field label="File Upload" description="The uploaded image will be used to generate your base brand kit." style={w}>
              <Input placeholder="Email or Username" aria-label="Email or Username" />
              <Input type="file" placeholder="File upload" aria-label="File upload" />
              <Input type="url" placeholder="https://gabrielle.ai" aria-label="Website" />
            </Field>
          </Spec>
        ),
      },
    ],
    options: [
      { id: "showcase", label: "Figma Input은 줄 종류 견본 — 실제 화면은 필드마다 라벨 하나", recommended: true },
      { id: "group", label: "여러 입력을 한 라벨로 묶는 그룹도 정식 패턴으로" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "4",
    title: "hover 상태가 없음",
    status: "open",
    figma: "Part/Input Status = default · active · filled · error · disabled. hover 없음.",
    code: "hover 표시 없음.",
    columns: [
      {
        label: "코드 — 마우스를 올려 보세요",
        render: () => <Spec label="default"><Input style={w} type="url" placeholder="Email or Username" /></Spec>,
      },
    ],
    options: [
      { id: "add", label: "Figma에 hover 추가 (예: 한 단계 진한 테두리)", recommended: true },
      { id: "none", label: "hover 없이 유지" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "5",
    title: "Select 줄 = Field 안의 Select",
    status: "info",
    figma: "Input(필드)의 Select 줄(MBTI 드롭다운 목록)은 Select 컴포넌트를 씀.",
    code: "<Field label><Select options /></Field> — 라벨 · 설명 · 에러가 Select 트리거에 연결됨 (2026-10-16). (Input time · Input phone은 type=\"time\" · \"tel\" — 8 · 9번)",
    columns: [
      {
        label: "코드",
        render: () => (
          <Spec label="Select row">
            <Field label="MBTI" style={w}>
              <Select options={["ISTJ", "ISFJ", "INFJ", "INTJ", "ENFP", "ENTP"].map((l) => ({ value: l, label: l }))} placeholder="Choose your MBTI" />
            </Field>
          </Spec>
        ),
      },
    ],
  },
  {
    id: "6",
    title: "상태 · 동작",
    status: "info",
    figma: "Part/Input 320 × 36 고정, 패딩 12, gap 8, radius md, Text-sm/Medium, 아이콘 16 (icon/subtle).",
    code: "active = 포커스 (border/static-gray + ring/focus) · filled = 값이 있으면 기본 글자색 · error = invalid · disabled. 에러 중 포커스는 빨간 테두리 + ring. 상자 아무 데나 누르면 입력에 포커스. type=\"file\"이면 Upload 줄 모양으로 파일 이름 표시. 너비는 Figma 320 고정 대신 부모를 채움.",
    columns: [
      {
        label: "코드 — error + focus",
        render: () => <Spec label="error · active"><Input style={{ ...w, ...inputActive }} invalid placeholder="Email or Username" /></Spec>,
      },
    ],
  },
  {
    id: "7",
    title: "Input search = type=\"search\"",
    status: "info",
    figma: "Input search = 왼쪽 lucide/search (icon/default) · gap 12 · Box Shadow/shadow-xs · 344 × 36. active는 shadow 대신 Focus ring. 지우기(×) 버튼 없음.",
    code: "별도 컴포넌트 없이 <Input type=\"search\"> (2026-10-16: type과 역할이 겹쳐 합침) — 왼쪽 검색 아이콘 자동 (leadingIcon으로 교체 가능). 측정: 아이콘 @12,10 · 텍스트 x40 w292 (Figma와 같음). 브라우저 기본 지우기 버튼은 숨김. 검색 실행(제출)은 쓰는 쪽에서 — 예: <form role=\"search\">.",
    columns: [
      {
        label: "코드",
        render: () => <Spec label="search"><Input type="search" style={{ width: 344 }} placeholder="Search placeholder" aria-label="Search" /></Spec>,
      },
    ],
  },
  {
    id: "8",
    title: "type=\"time\" (Figma Input time)",
    status: "open",
    figma: "hh:mm 입력 + AM/PM Toggle (2 options) + Delete(X 18px) — 코드에서는 제외 (2026-10-16 결정). 시 1–12, 분 00–59만 입력되게 제한. 쉬는 상태 placeholder \"11:00\", 포커스 시 \"_ _:_ _\". 에러 문구 \"Minutes must be between 0 and 59.\".",
    code: "Input type=\"time\" — 입력 마스크(숫자만, 5 → 05, 13 · 00 · 분 6x는 막음, 콜론 자동) + AM/PM 라디오 그룹(←→로 전환) Toggle 컴포넌트는 아직 없어 Figma Toggle 모양을 그대로 그림. hourCycle={24}(2026-10-16 결정, 기본 12)면 00–23시 · AM/PM 없음. 입력이 제한되므로 에러는 '덜 입력됨'(예: 11:6) 같은 경우에만 — 판단과 문구는 Field error로 쓰는 쪽에서. 측정: 입력 232 · 토글 @240 w80 (Figma 231 · 239 · 81).",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="default"><Field label="Time to post" style={w}><Input type="time" /></Field></Spec>
            <Spec label="PM"><Field label="Time to post" style={w}><Input type="time" defaultValue="11:00" defaultPeriod="PM" /></Field></Spec>
            <Spec label="error"><Field label="Time to post" error="Minutes must be between 0 and 59." style={w}><Input type="time" defaultValue="11" /></Field></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "consumer", label: "에러 판단은 쓰는 쪽 (현재) — 덜 입력된 채 blur하면 Field error", recommended: true },
      { id: "auto", label: "컴포넌트가 blur 때 자동으로 에러 표시" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "9",
    title: "type=\"tel\" (Figma Input phone) — libphonenumber-js",
    status: "decided",
    figma: "국가번호 select(88, chevron-down) + 번호 입력, gap 10. Status=default에서는 \"+1\"도 흐린 색(text/subtle), filled에서 기본색. 목록은 쓰는 쪽이 공급.",
    code: "결정(2026-10-16): 국가 데이터는 libphonenumber-js — 245개국 전체가 기본, countries로 제한, preferredCountries로 맨 위 고정, 나라 이름은 locale (Intl). 목록은 '대한민국 +82', 상자는 '+82'. 번호는 blur 때 나라 형식으로 정리 (010-1234-5678), onPhoneChange로 { country, callingCode, national, e164, valid }. 국가 선택은 GB Select (상자 '+82', 목록은 Figma Dropdown slot phone number '+82  대한민국', 글자 입력으로 이동). 측정: 88 + 222 @98 (Figma와 같음).",
    columns: [
      {
        label: "코드",
        render: () => (
          <>
            <Spec label="default"><Field label="Where can we reach you?" style={w}><Input type="tel" /></Field></Spec>
            <Spec label="KR · ko · preferred"><Field label="Where can we reach you?" style={w}><Input type="tel" defaultCountry="KR" preferredCountries={["KR", "US"]} locale="ko" defaultValue="010-1234-5678" /></Field></Spec>
          </>
        ),
      },
    ],
    options: [
      { id: "library", label: "libphonenumber-js — 전체 목록 + 제한 · 우선 옵션", recommended: true },
      { id: "native", label: "넘겨준 목록만 (이전 방식)" },
      { id: "other", label: "기타 (메모에 기록)" },
    ],
  },
  {
    id: "10",
    title: "지우기(X) — 입력된 내용이 있을 때만",
    status: "decided",
    figma: "Part/Input · Input search에 지우기 버튼 없음.",
    code: "결정(2026-10-16): type=\"text\" · \"search\"는 내용이 있을 때만 오른쪽에 X (lucide/x, 24px 클릭 영역). 누르면 비우고 onChange(\"\") · 입력으로 포커스 — controlled도 동작. disabled · readOnly면 없음, clearable={false}로 끄기, 이름은 clearLabel (기본 \"Clear\"). Figma에 추가 필요.",
    columns: [
      {
        label: "코드 — 입력하면 X가 나타남",
        render: () => (
          <>
            <Spec label="text"><Input style={w} defaultValue="hello" aria-label="Text" /></Spec>
            <Spec label="search"><Input type="search" style={{ width: 344 }} defaultValue="검색어" aria-label="Search" clearLabel="검색어 지우기" /></Spec>
            <Spec label="empty"><Input style={w} placeholder="비어 있으면 X 없음" aria-label="Empty" /></Spec>
          </>
        ),
      },
    ],
  },
  {
    id: "11",
    title: "type=\"password\" — 보이기/숨기기 내장",
    status: "decided",
    figma: "Input 페이지에 비밀번호 입력 없음.",
    code: "결정(2026-10-16): type=\"password\"면 오른쪽 눈 아이콘(lucide eye / eye-off, 24px 클릭 영역)이 기본 — 누르면 글자 보이기 ↔ 숨기기, 값과 커서 유지. 버튼 이름 \"Show password\" ↔ \"Hide password\" (showPasswordLabel · hidePasswordLabel). disabled면 버튼도 disabled. Figma에 추가 필요.",
    columns: [
      {
        label: "코드 — 눈 아이콘을 눌러 보세요",
        render: () => <Spec label="password"><Input type="password" style={w} defaultValue="secret-password" aria-label="Password" /></Spec>,
      },
    ],
  },
]
