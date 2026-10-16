import { useState } from "react"

import { Field, Select } from "../../src"
import { Row, Themes } from "../shell/theme"
import { selectRoles } from "../stories/select"

const styles = ["primary", "reverse", "mute", "ghost"] as const
const roles = selectRoles

function Matrix({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className="grid" style={{ ["--cols" as string]: 3 }}>
      <span />
      <span className="head">default (placeholder)</span>
      <span className="head">filled</span>
      <span className="head">disabled</span>
      {styles.map((s) => (
        <Row key={s} label={s}>
          <Select options={roles} placeholder="Data Scientist" variant={s} aria-label="Role" data-testid={`${theme}-${s}`} />
          <Select options={roles} defaultValue="Data Scientist" variant={s} aria-label="Role" data-testid={`${theme}-${s}-filled`} />
          <Select options={roles} defaultValue="Data Scientist" variant={s} disabled aria-label="Role" />
        </Row>
      ))}
      <Row label="side">
        <Select type="side" options={roles} defaultValue="Data Scientist" aria-label="Role" data-testid={`${theme}-side`} />
        <Select type="side" variant="reverse" options={roles} defaultValue="Data Scientist" aria-label="Role" data-testid={`${theme}-side-reverse`} />
        <Select type="side" options={roles} defaultValue="Data Scientist" disabled aria-label="Role" />
      </Row>
    </div>
  )
}

/** Controlled, inside Field, submitted with a form. */
function Form({ theme }: { theme: "light" | "dark" }) {
  const [role, setRole] = useState<string | null>(null)
  const [sent, setSent] = useState("")
  return (
    <form
      style={{ display: "flex", gap: 16, alignItems: "end", flexWrap: "wrap" }}
      onSubmit={(e) => {
        e.preventDefault()
        setSent(new URLSearchParams(new FormData(e.currentTarget) as unknown as Record<string, string>).toString())
      }}
    >
      <Field label="Role" style={{ width: 200 }}>
        <Select options={roles} value={role} onValueChange={setRole} placeholder="Choose" name="role" data-testid={`${theme}-role`} />
      </Field>
      <button type="submit" data-testid={`${theme}-submit`}>submit</button>
      <span style={{ font: "var(--gb-typography-xs)", color: "var(--gb-text-subtle)" }} data-testid={`${theme}-sent`}>{sent}</span>
    </form>
  )
}

export function SelectVariants() {
  return (
    <Themes
      render={(theme) => (
        <>
          <Matrix theme={theme} />
          <h2 className="sub">Field 안에서 · form 제출</h2>
          <Form theme={theme} />
        </>
      )}
    />
  )
}
