import { useState } from "react"

import { Checkbox } from "../../src"
import { Row, Themes } from "../shell/theme"

const label = "Accept terms and conditions"

function Matrix({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className="grid">
      <span />
      <span className="head">default</span>
      <span className="head">mute</span>
      <span className="head">no label</span>
      <Row label="unchecked">
        <Checkbox data-testid={`${theme}-default`}>{label}</Checkbox>
        <Checkbox variant="mute" data-testid={`${theme}-mute`}>{label}</Checkbox>
        <Checkbox aria-label={label} />
      </Row>
      <Row label="checked">
        <Checkbox defaultChecked data-testid={`${theme}-checked`}>{label}</Checkbox>
        <Checkbox variant="mute" defaultChecked>{label}</Checkbox>
        <Checkbox aria-label={label} defaultChecked />
      </Row>
      <Row label="part">
        <Checkbox indeterminate data-testid={`${theme}-part`}>{label}</Checkbox>
        <Checkbox variant="mute" indeterminate>{label}</Checkbox>
        <Checkbox aria-label={label} indeterminate />
      </Row>
      <Row label="disabled">
        <Checkbox disabled data-testid={`${theme}-disabled`}>{label}</Checkbox>
        <Checkbox variant="mute" disabled>{label}</Checkbox>
        <Checkbox aria-label={label} disabled />
      </Row>
      <Row label="disabled checked">
        <Checkbox disabled defaultChecked>{label}</Checkbox>
        <Checkbox variant="mute" disabled defaultChecked>{label}</Checkbox>
        <Checkbox aria-label={label} disabled defaultChecked />
      </Row>
      <Row label="disabled part">
        <Checkbox disabled indeterminate>{label}</Checkbox>
        <Checkbox variant="mute" disabled indeterminate>{label}</Checkbox>
        <Checkbox aria-label={label} disabled indeterminate />
      </Row>
    </div>
  )
}

/** Parent/child "select all" — the real use of Type=Part. */
function SelectAll() {
  const items = ["알림 메일", "마케팅 메일", "SMS"]
  const [checked, setChecked] = useState([true, false, false])
  const all = checked.every(Boolean)
  const some = checked.some(Boolean)
  return (
    <div className="stack">
      <Checkbox checked={all} indeterminate={some && !all} onChange={() => setChecked(items.map(() => !all))}>
        전체 선택
      </Checkbox>
      <div className="stack indent">
        {items.map((item, i) => (
          <Checkbox
            key={item}
            checked={checked[i] ?? false}
            onChange={(e) => setChecked(checked.map((c, j) => (j === i ? e.target.checked : c)))}
          >
            {item}
          </Checkbox>
        ))}
      </div>
    </div>
  )
}

export function CheckboxVariants() {
  return (
    <Themes
      render={(theme) => (
        <>
          <Matrix theme={theme} />
          <h2 className="sub">전체 선택 (indeterminate)</h2>
          <SelectAll />
        </>
      )}
    />
  )
}
