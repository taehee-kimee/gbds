import { Plus } from "lucide-react"
import { useState } from "react"

import { Menu } from "../../src"
import { Row, Themes } from "../shell/theme"
import { menuItems } from "../stories/menu"

const styles = ["primary", "reverse", "mute", "ghost"] as const

export function MenuVariants() {
  const [last, setLast] = useState("—")
  return (
    <Themes
      render={(theme) => (
        <>
          <div className="grid" style={{ ["--cols" as string]: 3 }}>
            <span />
            <span className="head">icon</span>
            <span className="head">default</span>
            <span className="head">disabled</span>
            {styles.map((s) => (
              <Row key={s} label={s}>
                <Menu type="icon" icon={<Plus />} label="Add" items={menuItems} variant={s} onAction={setLast} data-testid={`${theme}-${s}-icon`} />
                <Menu label="Actions" items={menuItems} variant={s} onAction={setLast} data-testid={`${theme}-${s}`} />
                <Menu type="icon" icon={<Plus />} label="Add" items={menuItems} variant={s} disabled />
              </Row>
            ))}
          </div>
          <h2 className="sub">마지막 실행: <span data-testid={`${theme}-last`}>{last}</span></h2>
        </>
      )}
    />
  )
}
