import { useState } from "react"

import { Chip } from "../../src"
import { Row, Themes } from "../shell/theme"

const variants = ["primary", "outline", "secondary", "ghost"] as const

function Matrix({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className="grid" style={{ ["--cols" as string]: 4 }}>
      <span />
      <span className="head">default</span>
      <span className="head">active</span>
      <span className="head">disabled</span>
      <span className="head">Delete icon</span>
      {variants.map((v) => (
        <Row key={v} label={v}>
          <Chip variant={v} data-testid={`${theme}-${v}`}>Chips</Chip>
          <Chip variant={v} defaultSelected data-testid={`${theme}-${v}-active`}>Chips</Chip>
          <Chip variant={v} disabled data-testid={`${theme}-${v}-disabled`}>Chips</Chip>
          <Chip variant={v} onRemove={() => {}} data-testid={`${theme}-${v}-delete`}>Chips</Chip>
        </Row>
      ))}
    </div>
  )
}

/** Filter chips: toggle any number on, remove with X. */
function Filters() {
  const [tags, setTags] = useState(["React", "Figma", "TypeScript", "Design system"])
  const [on, setOn] = useState<string[]>(["React"])
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {tags.map((t) => (
        <Chip
          key={t}
          variant="outline"
          isSelected={on.includes(t)}
          onSelectedChange={(s) => setOn(s ? [...on, t] : on.filter((x) => x !== t))}
          onRemove={() => setTags(tags.filter((x) => x !== t))}
          removeLabel={`${t} 삭제`}
        >
          {t}
        </Chip>
      ))}
    </div>
  )
}

export function ChipVariants() {
  return (
    <Themes
      render={(theme) => (
        <>
          <Matrix theme={theme} />
          <h2 className="sub">필터 (여러 개 켜기 · X로 삭제)</h2>
          <Filters />
        </>
      )}
    />
  )
}
