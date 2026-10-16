import { useEffect, useState } from "react"

import { Button, Progress } from "../../src"
import { Row, Themes } from "../shell/theme"

const steps = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

function Matrix({ theme }: { theme: "light" | "dark" }) {
  return (
    <>
      <div className="grid" style={{ ["--cols" as string]: 2 }}>
        <span />
        <span className="head">in progress</span>
        <span className="head">completed</span>
        <Row label="Text">
          <Progress style={{ width: 226 }} value={10} label="Loading image.." data-testid={`${theme}-progress`} />
          <Progress style={{ width: 226 }} value={100} label="Loading image.." data-testid={`${theme}-completed`} />
        </Row>
        <Row label="no Text">
          <Progress style={{ width: 226 }} value={10} aria-label="Loading image" />
          <Progress style={{ width: 226 }} value={100} aria-label="Loading image" />
        </Row>
      </div>
      <h2 className="sub">Part/Progress — Percentage(%)</h2>
      <div style={{ display: "grid", gap: 12, width: 400 }}>
        {steps.map((p) => (
          <Progress key={p} value={p} aria-label={`${p}%`} data-testid={`${theme}-bar-${p}`} />
        ))}
      </div>
    </>
  )
}

/** Simulated upload: the label switches to Completed at the end. */
function Upload() {
  const [value, setValue] = useState<number | null>(null)
  useEffect(() => {
    if (value === null || value >= 12) return
    const t = setTimeout(() => setValue(value + 1), 250)
    return () => clearTimeout(t)
  }, [value])
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "end" }}>
      <Progress style={{ width: 226 }} value={value ?? 0} max={12} label={`Uploading ${value ?? 0} / 12 files`} completedLabel="12 files uploaded" />
      <Button variant="outline" onClick={() => setValue(0)}>
        업로드 시작
      </Button>
    </div>
  )
}

export function ProgressVariants() {
  return (
    <Themes
      render={(theme) => (
        <>
          <Matrix theme={theme} />
          <h2 className="sub">실제 사용 (max=12)</h2>
          <Upload />
        </>
      )}
    />
  )
}
