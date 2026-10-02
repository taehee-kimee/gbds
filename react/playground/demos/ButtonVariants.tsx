// lucide/circle-dashed — the placeholder icon used by the Figma component.
import { CircleDashed } from "lucide-react"
import type { CSSProperties } from "react"

import { Button } from "../../src"
import { Row, Themes } from "../shell/theme"

const textVariants = ["primary", "mute", "outline", "link"] as const
const iconVariants = ["icon", "ghost", "icon-rounded"] as const

function Matrix({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className="grid" style={{ "--cols": 4 } as CSSProperties}>
      <span />
      <span className="head">default</span>
      <span className="head">disabled</span>
      <span className="head">isSelected</span>
      <span className="head">trailing icon</span>
      {textVariants.map((v) => (
        <Row key={v} label={v}>
          <Button variant={v} data-testid={`${theme}-${v}`}>Button</Button>
          <Button variant={v} disabled>Button</Button>
          <Button variant={v} isSelected>Button</Button>
          {v === "link" ? <span /> : <Button variant={v} trailingIcon={<CircleDashed />}>Button</Button>}
        </Row>
      ))}
      {iconVariants.map((v) => (
        <Row key={v} label={v}>
          <Button variant={v} aria-label="Placeholder" data-testid={`${theme}-${v}`}><CircleDashed /></Button>
          <Button variant={v} aria-label="Placeholder" disabled><CircleDashed /></Button>
          <Button variant={v} aria-label="Placeholder" isSelected><CircleDashed /></Button>
          <span />
        </Row>
      ))}
    </div>
  )
}

export function ButtonVariants() {
  return <Themes render={(theme) => <Matrix theme={theme} />} />
}
