import { useState } from "react"

import { Field, Slider } from "../../src"
import { Row, Themes } from "../shell/theme"

function Live({ theme }: { theme: "light" | "dark" }) {
  const [v, setV] = useState(40)
  return (
    <Field label={`Opacity ${v}%`} style={{ width: 300 }}>
      <Slider value={v} onValueChange={setV} step={10} data-testid={`${theme}-live`} />
    </Field>
  )
}

export function SliderVariants() {
  return (
    <Themes
      render={(theme) => (
        <>
          <div className="grid" style={{ ["--cols" as string]: 1 }}>
            {[0, 20, 50, 100].map((p) => (
              <Row key={p} label={`${p}%`}>
                <div style={{ width: 435 }}>
                  <Slider defaultValue={p} aria-label={`${p}%`} data-testid={`${theme}-${p}`} />
                </div>
              </Row>
            ))}
            <Row label="disabled">
              <div style={{ width: 435 }}>
                <Slider defaultValue={40} disabled aria-label="Disabled" />
              </div>
            </Row>
          </div>
          <h2 className="sub">Field 안에서 · step 10</h2>
          <Live theme={theme} />
        </>
      )}
    />
  )
}
