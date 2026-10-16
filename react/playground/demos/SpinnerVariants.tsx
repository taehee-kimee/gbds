import { useState } from "react"

import { Button, Spinner } from "../../src"
import { Row, Themes } from "../shell/theme"

function Save({ theme }: { theme: "light" | "dark" }) {
  const [busy, setBusy] = useState(false)
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Button
        variant="outline"
        disabled={busy}
        onClick={() => {
          setBusy(true)
          setTimeout(() => setBusy(false), 2500)
        }}
      >
        저장
      </Button>
      {/* The status region stays mounted so the announcement is reliable; only its content changes. */}
      <div aria-live="polite" data-testid={`${theme}-save`}>{busy && <Spinner label="저장 중" />}</div>
    </div>
  )
}

export function SpinnerVariants() {
  return (
    <Themes
      render={(theme) => (
        <>
          <div className="grid" style={{ ["--cols" as string]: 3 }}>
            <span />
            <span className="head">outline</span>
            <span className="head">reversed</span>
            <span className="head">primary</span>
            <Row label="Figma">
              <Spinner data-testid={`${theme}-outline`} />
              <Spinner variant="reversed" data-testid={`${theme}-reversed`} />
              <Spinner variant="primary" data-testid={`${theme}-primary`} />
            </Row>
          </div>
          <h2 className="sub">작업 중 표시</h2>
          <Save theme={theme} />
        </>
      )}
    />
  )
}
