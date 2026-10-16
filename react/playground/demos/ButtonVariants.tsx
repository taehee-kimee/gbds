// lucide/circle-dashed — the placeholder icon used by the Figma component.
import { CircleDashed } from "lucide-react"
import type { CSSProperties } from "react"

import { Button } from "../../src"
import { Row, Themes } from "../shell/theme"

const textStyles = ["default", "mute", "outline", "link"] as const
const iconStyles = ["default", "ghost", "ghost-rounded"] as const

function Matrix({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className="grid" style={{ "--cols": 4 } as CSSProperties}>
      <span />
      <span className="head">default</span>
      <span className="head">disabled</span>
      <span className="head">isSelected (= active)</span>
      <span className="head">Show icon</span>
      {textStyles.map((s) => (
        <Row key={s} label={`default / ${s}`}>
          <Button variant={s} data-testid={`${theme}-default-${s}`}>Button</Button>
          <Button variant={s} disabled data-testid={`${theme}-default-${s}-disabled`}>Button</Button>
          <Button variant={s} isSelected data-testid={`${theme}-default-${s}-active`}>Button</Button>
          <Button variant={s} icon={<CircleDashed />} data-testid={`${theme}-default-${s}-icon`}>Button</Button>
        </Row>
      ))}
      <Row label="default / ghost">
        <Button variant="ghost" data-testid={`${theme}-default-ghost`}>Button</Button>
        <Button variant="ghost" disabled data-testid={`${theme}-default-ghost-disabled`}>Button</Button>
        <Button variant="ghost" isSelected data-testid={`${theme}-default-ghost-active`}>Button</Button>
        <span />
      </Row>
      {iconStyles.map((s) => (
        <Row key={s} label={`icon / ${s}`}>
          <Button variant={s} icon={<CircleDashed />} aria-label="Placeholder" data-testid={`${theme}-icon-${s}`} />
          <Button variant={s} icon={<CircleDashed />} aria-label="Placeholder" disabled data-testid={`${theme}-icon-${s}-disabled`} />
          <Button variant={s} icon={<CircleDashed />} aria-label="Placeholder" isSelected data-testid={`${theme}-icon-${s}-active`} />
          <span />
        </Row>
      ))}
      <Row label="google">
        <Button variant="google" data-testid={`${theme}-google`}>Continue with Google</Button>
        <Button variant="google" disabled data-testid={`${theme}-google-disabled`}>Continue with Google</Button>
        <Button variant="google" isSelected data-testid={`${theme}-google-active`}>Continue with Google</Button>
        <span />
      </Row>
    </div>
  )
}

export function ButtonVariants() {
  return <Themes render={(theme) => <Matrix theme={theme} />} />
}
