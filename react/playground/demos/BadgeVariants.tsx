import { Bell, CircleDashed } from "lucide-react"

import { Badge } from "../../src"
import { Row, Themes } from "../shell/theme"

const variants = ["default", "reverse", "alarm", "success", "destructive", "outline"] as const

function Matrix({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className="grid" style={{ ["--cols" as string]: variants.length }}>
      <span />
      {variants.map((variant) => (
        <span key={variant} className="head">{variant}</span>
      ))}
      <Row label="20">
        {variants.map((variant) => (
          <Badge key={variant} variant={variant} data-testid={`${theme}-${variant}-20`}>Badge</Badge>
        ))}
      </Row>
      <Row label="28">
        {variants.map((variant) => (
          <Badge key={variant} variant={variant} size={28} data-testid={`${theme}-${variant}-28`}>Badge</Badge>
        ))}
      </Row>
      <Row label="20 + icon">
        {variants.map((variant) => (
          <Badge key={variant} variant={variant} icon={<CircleDashed />} data-testid={`${theme}-${variant}-20-icon`}>Badge</Badge>
        ))}
      </Row>
      <Row label="28 + icon">
        {variants.map((variant) => (
          <Badge key={variant} variant={variant} size={28} icon={<CircleDashed />} data-testid={`${theme}-${variant}-28-icon`}>Badge</Badge>
        ))}
      </Row>
      <Row label="icon only">
        {variants.map((variant) => (
          <Badge key={variant} variant={variant} icon={<Bell />} aria-label="알림" />
        ))}
      </Row>
    </div>
  )
}

export function BadgeVariants() {
  return <Themes render={(theme) => <Matrix theme={theme} />} />
}
