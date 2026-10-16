import { useState } from "react"

import { Field, Input } from "../../src"
import { Row, Themes } from "../shell/theme"
import { inputActive } from "../stories/input"

const w = { width: 320 }

function Matrix({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className="grid" style={{ ["--cols" as string]: 2 }}>
      <span />
      <span className="head">아이콘 (type="url" → 지구본)</span>
      <span className="head">아이콘 없음 (type="text")</span>
      <Row label="default">
        <Input style={w} type="url" placeholder="Email or Username" data-testid={`${theme}-default`} />
        <Input style={w} placeholder="Email or Username" />
      </Row>
      <Row label="active">
        <Input style={{ ...w, ...inputActive }} type="url" placeholder="Email or Username" data-testid={`${theme}-active`} />
        <Input style={{ ...w, ...inputActive }} placeholder="Email or Username" />
      </Row>
      <Row label="filled">
        <Input style={w} type="url" defaultValue="Email or Username" data-testid={`${theme}-filled`} />
        <Input style={w} defaultValue="Email or Username" />
      </Row>
      <Row label="error">
        <Input style={w} invalid type="url" placeholder="Email or Username" data-testid={`${theme}-error`} />
        <Input style={w} invalid placeholder="Email or Username" />
      </Row>
      <Row label="disabled">
        <Input style={w} disabled type="url" placeholder="Email or Username" data-testid={`${theme}-disabled`} />
        <Input style={w} disabled placeholder="Email or Username" />
      </Row>
    </div>
  )
}

/** Figma Input (field): Title, Textfield · Upload · Link rows, Description. Select row waits for Select. */
function Fields({ theme }: { theme: "light" | "dark" }) {
  return (
    <div style={{ display: "flex", gap: 40, flexWrap: "wrap", alignItems: "flex-start" }}>
      <Field label="File Upload" description="The uploaded image will be used to generate your base brand kit." style={w} data-testid={`${theme}-field`}>
        <Input placeholder="Email or Username" aria-label="Email or Username" />
        <Input type="file" placeholder="File upload" aria-label="File upload" />
        <Input type="url" placeholder="https://gabrielle.ai" aria-label="Website" />
      </Field>
      <Field label="Email" description="로그인에 쓰는 주소" style={w}>
        <Input type="email" placeholder="name@example.com" />
      </Field>
      <Field label="Email" error="이메일 형식이 아니에요." style={w}>
        <Input type="email" defaultValue="taehee@" />
      </Field>
    </div>
  )
}

/** Built-in right-end buttons: show/hide on type="password", clear on text and search. */
function TrailingButtons({ theme }: { theme: "light" | "dark" }) {
  const [q, setQ] = useState("지울 수 있는 텍스트")
  return (
    <div className="stack">
      <Input style={w} type="password" defaultValue="secret-password" aria-label="Password" data-testid={`${theme}-password`} />
      <Input
        style={w}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Query"
        clearLabel="지우기"
        data-testid={`${theme}-clear`}
      />
      <Input type="search" style={w} defaultValue="검색어" aria-label="Search" clearLabel="검색어 지우기" data-testid={`${theme}-search-clear`} />
      <Input style={w} disabled defaultValue="disabled — X 없음" aria-label="Disabled" />
    </div>
  )
}

export function InputVariants() {
  return (
    <Themes
      render={(theme) => (
        <>
          <Matrix theme={theme} />
          <h2 className="sub">type="search" (Figma Input search)</h2>
          <div className="stack">
            <Input type="search" style={{ width: 344 }} placeholder="Search placeholder" aria-label="Search" data-testid={`${theme}-search`} />
            <Input type="search" style={{ width: 344, ...inputActive, ["--input-shadow" as string]: "0 0 0 0 transparent" }} placeholder="Search placeholder" aria-label="Search" />
            <Input type="search" style={{ width: 344 }} defaultValue="Search placeholder" aria-label="Search" />
            <Input type="search" style={{ width: 344 }} disabled placeholder="Search placeholder" aria-label="Search" data-testid={`${theme}-search-disabled`} />
          </div>
          <h2 className="sub">type="time" (Figma Input time) · type="tel" (Figma Input phone)</h2>
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap", alignItems: "flex-start" }}>
            <div className="stack" style={w}>
              <Field label="Time to post" style={w}><Input type="time" data-testid={`${theme}-time`} /></Field>
              <Field label="Time to post" style={w}><Input type="time" defaultValue="11:00" defaultPeriod="PM" data-testid={`${theme}-time-clear`} /></Field>
              <Field label="Time to post" style={w} error="Minutes must be between 0 and 59."><Input type="time" defaultValue="11:6" /></Field>
              <Field label="Time to post" style={w}><Input type="time" defaultValue="11:00" disabled data-testid={`${theme}-time-disabled`} /></Field>
            </div>
            <div className="stack" style={w}>
              <Field label="Where can we reach you?" style={w}><Input type="tel" data-testid={`${theme}-tel`} /></Field>
              <Field label="Where can we reach you?" style={w}><Input type="tel" defaultCountry="KR" preferredCountries={["KR", "US"]} locale="ko" defaultValue="010-1234-5678" /></Field>
              <Field label="Where can we reach you?" style={w}><Input type="tel" disabled data-testid={`${theme}-tel-disabled`} /></Field>
            </div>
          </div>
          <h2 className="sub">type="password" · 지우기 (text · search, 내용이 있을 때만)</h2>
          <TrailingButtons theme={theme} />
          <h2 className="sub">Field (Figma Input) — 라벨 · 설명 · 에러</h2>
          <Fields theme={theme} />
        </>
      )}
    />
  )
}
