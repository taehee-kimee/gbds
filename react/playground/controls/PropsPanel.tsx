import { isValidElement, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactElement, type ReactNode } from "react"

import { useThemes } from "../shell/theme"
import "./controls.css"

/* ── Data shape ────────────────────────────────────────────────────────── */

type ControlBase = {
  /** Figma property name verbatim, or the React prop name for code controls. */
  name: string
  /** "figma" (default) mirrors componentPropertyDefinitions; "code" is a React prop with no Figma property. */
  source?: "figma" | "code"
  /** Property type shown in the Type column, e.g. "boolean", '"button" | "submit"'. Derived from the kind when omitted. */
  type?: string
  description?: string
}

export type FigmaControl = ControlBase &
  (
    | { kind: "VARIANT"; options: readonly string[]; default: string }
    | { kind: "BOOLEAN"; default: boolean }
    | { kind: "TEXT"; default: string }
    | { kind: "INSTANCE_SWAP"; options: Record<string, ReactElement>; default: string }
  )

export type FigmaValues = Record<string, string | boolean>

type Handler = (...args: unknown[]) => void

export type StoryTools = {
  /** The element picked in an INSTANCE_SWAP control. */
  icon: (name: string) => ReactElement | undefined
  set: (name: string, value: string | boolean) => void
  /** Handlers for every event in `story.events` — each one logs to the Actions panel. Spread onto the component. */
  actions: Record<string, Handler>
  /** One logged handler that also runs `fn` (e.g. to write the new state back to the controls). */
  on: (event: string, fn?: Handler) => Handler
}

export type Story = {
  /** Figma component set, e.g. "Checkbox (76:8617)". */
  figma: string
  controls: FigmaControl[]
  /** Event props logged in the Actions panel. The first one is also printed in the code. */
  events: string[]
  /**
   * Map control values to the React element. The same element is printed as code.
   * `set` lets the preview write back, so clicking the component updates its controls.
   */
  render: (values: FigmaValues, tools: StoryTools) => ReactElement
  /** Shown under the code when a Figma value has no 1:1 prop (e.g. a frozen hover state). */
  note?: (values: FigmaValues) => string | undefined
}

type Action = { id: number; time: string; event: string; detail: string }

/** A short, readable summary of an event argument for the Actions log. */
function describe(arg: unknown): string {
  const e = arg as { type?: string; key?: string; target?: { type?: string; checked?: boolean; indeterminate?: boolean } }
  if (!e || typeof e !== "object") return ""
  // Calendar onChange: a Date, or a { start, end? } range.
  const day = (d: unknown) => (d instanceof Date ? d.toLocaleDateString("en-CA") : "…")
  if (arg instanceof Date) return day(arg)
  if ("start" in e) return `${day((e as { start: unknown }).start)} → ${day((e as { end?: unknown }).end)}`
  if (e.type === "change" && e.target?.type === "checkbox") return `checked: ${e.target.checked}`
  if (e.key) return `key: "${e.key}"`
  return e.type ?? ""
}

/* ── Panel: component + code on top, resizable controls below ─────────── */

export function PropsPanel({ story }: { story: Story }) {
  const themes = useThemes()
  const initial = Object.fromEntries(story.controls.map((c) => [c.name, c.default])) as FigmaValues
  const [values, setValues] = useState(initial)
  const [actions, setActions] = useState<Action[]>([])
  const [copied, setCopied] = useState(false)
  const nextId = useRef(0)
  const { split, rootRef, separator } = useSplit()
  const set = (name: string, value: string | boolean) => setValues((v) => ({ ...v, [name]: value }))

  const icon = (name: string) => {
    const control = story.controls.find((c) => c.kind === "INSTANCE_SWAP" && c.name === name)
    return control?.kind === "INSTANCE_SWAP" ? control.options[String(values[name])] : undefined
  }
  const on = (event: string, fn?: Handler): Handler => (...args) => {
    const d = new Date()
    const time = [d.getHours(), d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, "0")).join(":") + "." + String(d.getMilliseconds()).padStart(3, "0")
    setActions((list) => [{ id: nextId.current++, time, event, detail: describe(args[0]) }, ...list].slice(0, 50))
    fn?.(...args)
  }
  const handlers = Object.fromEntries(story.events.map((e) => [e, on(e)]))

  const element = story.render(values, { icon, set, actions: handlers, on })
  const code = toJsx(element, "", new Set(story.events.slice(1)))
  const note = story.note?.(values)
  const changed = story.controls.some((c) => values[c.name] !== c.default)
  const figmaControls = story.controls.filter((c) => c.source !== "code")
  const codeControls = story.controls.filter((c) => c.source === "code")

  const copy = () =>
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    })

  const row = (c: FigmaControl) => <ControlRow key={c.name} control={c} value={values[c.name]!} onChange={(v) => set(c.name, v)} />

  return (
    <section ref={rootRef} className="pp" style={{ gridTemplateRows: `${split * 100}% auto minmax(0, 1fr)` }}>
      <div className="pp-top">
        <div className="pp-stage">
          {themes.map((theme) => (
            <div key={theme} className="pp-theme" data-theme={theme}>
              <span className="pp-theme-label">{theme}</span>
              {element}
            </div>
          ))}
        </div>

        <div className="pp-codebar">
          <pre className="pp-code">{code}</pre>
          <button type="button" className="pp-copy" onClick={copy}>
            {copied ? "복사됨" : "복사"}
          </button>
          {note && <p className="pp-note">{note}</p>}
        </div>
      </div>

      <div {...separator} className="pp-split" />

      <div className="pp-addons">
        <div className="pp-pane">
          <div className="pp-bar">
            <span className="pp-title">Controls</span>
            <span className="pp-source">{story.figma}</span>
            <button type="button" className="pp-reset" disabled={!changed} onClick={() => setValues(initial)}>
              초기화
            </button>
          </div>
          <table className="pp-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Description</th>
                <th>Default</th>
                <th>Control</th>
              </tr>
            </thead>
            <tbody>
              <tr className="pp-section"><td colSpan={5}>Figma properties</td></tr>
              {figmaControls.map(row)}
              {codeControls.length > 0 && <tr className="pp-section"><td colSpan={5}>Code properties — Figma에 없는 React props</td></tr>}
              {codeControls.map(row)}
            </tbody>
          </table>
        </div>

        <div className="pp-pane pp-actions">
          <div className="pp-bar">
            <span className="pp-title">Actions</span>
            <span className="pp-source" />
            <button type="button" className="pp-reset" disabled={actions.length === 0} onClick={() => setActions([])}>
              지우기
            </button>
          </div>
          {story.events.length === 0 ? (
            <p className="pp-empty">이 컴포넌트는 이벤트가 없습니다 (표시 전용).</p>
          ) : actions.length === 0 ? (
            <p className="pp-empty">
              컴포넌트를 클릭하거나 Tab · Space로 조작하면 이벤트가 기록됩니다.
              <br />
              <code>{story.events.join(" · ")}</code>
            </p>
          ) : (
            <ol className="pp-log">
              {actions.map((a) => (
                <li key={a.id}>
                  <time>{a.time}</time>
                  <code>{a.event}</code>
                  <span>{a.detail}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  )
}

/* ── Resizable split between the component area and the controls ───────── */

const SPLIT_KEY = "gb-playground-split"
const DEFAULT_SPLIT = 0.55
const clamp = (n: number) => Math.min(0.85, Math.max(0.15, n))

function readSplit() {
  try {
    const n = Number(localStorage.getItem(SPLIT_KEY))
    return n ? clamp(n) : DEFAULT_SPLIT
  } catch {
    return DEFAULT_SPLIT
  }
}

/** Drag (or arrow keys on) the separator to resize; double-click resets. Remembered per browser. */
function useSplit() {
  const rootRef = useRef<HTMLElement>(null)
  const [split, setSplitState] = useState(readSplit)
  const setSplit = (n: number) => {
    const v = clamp(n)
    setSplitState(v)
    try {
      localStorage.setItem(SPLIT_KEY, String(v))
    } catch {
      /* storage unavailable — the split just isn't remembered */
    }
  }
  const fromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const r = rootRef.current?.getBoundingClientRect()
    if (r) setSplit((e.clientY - r.top) / r.height)
  }

  const separator = {
    role: "separator",
    tabIndex: 0,
    "aria-orientation": "horizontal" as const,
    "aria-label": "컴포넌트 영역과 컨트롤 영역 크기 조절",
    "aria-valuemin": 15,
    "aria-valuemax": 85,
    "aria-valuenow": Math.round(split * 100),
    title: "드래그해서 높이 조절 · 더블클릭하면 초기화",
    onPointerDown: (e: PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId)
      e.preventDefault()
    },
    onPointerMove: (e: PointerEvent<HTMLDivElement>) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) fromPointer(e)
    },
    onDoubleClick: () => setSplit(DEFAULT_SPLIT),
    onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowUp") setSplit(split - 0.05)
      else if (e.key === "ArrowDown") setSplit(split + 0.05)
      else return
      e.preventDefault()
    },
  }
  return { split, rootRef, separator }
}

/** The value type a control edits. Figma kinds map to: BOOLEAN → boolean, TEXT → string, VARIANT → union, INSTANCE_SWAP → ReactNode. */
function typeOf(control: FigmaControl) {
  if (control.type) return control.type
  switch (control.kind) {
    case "BOOLEAN":
      return "boolean"
    case "TEXT":
      return "string"
    case "VARIANT":
      return control.options.map((o) => JSON.stringify(o)).join(" | ")
    case "INSTANCE_SWAP":
      return "ReactNode"
  }
}

function ControlRow({ control, value, onChange }: { control: FigmaControl; value: string | boolean; onChange: (v: string | boolean) => void }) {
  const id = `pp-${control.name.replace(/\W+/g, "-")}`
  let input: ReactNode
  switch (control.kind) {
    case "VARIANT":
      input = (
        <div className="pp-segment" role="radiogroup" aria-labelledby={id}>
          {control.options.map((o) => (
            <button key={o} type="button" role="radio" aria-checked={value === o} onClick={() => onChange(o)}>
              {o}
            </button>
          ))}
        </div>
      )
      break
    case "BOOLEAN":
      input = (
        <label className="pp-bool">
          <input type="checkbox" aria-labelledby={id} checked={value === true} onChange={(e) => onChange(e.target.checked)} />
          {String(value)}
        </label>
      )
      break
    case "TEXT":
      input = <input type="text" aria-labelledby={id} value={String(value)} onChange={(e) => onChange(e.target.value)} />
      break
    case "INSTANCE_SWAP":
      input = (
        <select aria-labelledby={id} value={String(value)} onChange={(e) => onChange(e.target.value)}>
          {Object.keys(control.options).map((o) => <option key={o}>{o}</option>)}
        </select>
      )
      break
  }
  const fallback = control.kind === "TEXT" && control.default === "" ? "—" : String(control.default)
  return (
    <tr>
      <td>
        <span id={id} className="pp-name">{control.name}</span>
        <small className="pp-kind">{control.source === "code" ? "React prop" : `Figma ${control.kind}`}</small>
      </td>
      <td><code className="pp-type">{typeOf(control)}</code></td>
      <td className="pp-desc">{control.description}</td>
      <td><code className="pp-default">{fallback}</code></td>
      <td className="pp-input">{input}</td>
    </tr>
  )
}

/* ── JSX printer ───────────────────────────────────────────────────────── */

type AnyType = string | { displayName?: string; name?: string }

function elementName(type: unknown) {
  const t = type as AnyType
  return typeof t === "string" ? t : (t.displayName ?? t.name ?? "Component")
}

/**
 * Prints an element as JSX. `style` is skipped — the playground only uses it to freeze states.
 * Handlers named in `hidden` are skipped too: they are wired only to feed the Actions log.
 */
function toJsx(node: ReactNode, indent = "", hidden: Set<string> = new Set()): string {
  if (node == null || node === false || node === true) return ""
  if (typeof node === "string" || typeof node === "number") return indent + String(node)
  if (Array.isArray(node)) return node.map((n) => toJsx(n, indent, hidden)).filter(Boolean).join("\n")
  if (!isValidElement(node)) return ""

  const name = elementName(node.type)
  const { children, style: _style, ...props } = node.props as Record<string, unknown> & { children?: ReactNode }
  const attrs = Object.entries(props)
    .filter(([k, v]) => v !== undefined && v !== false && !(typeof v === "function" && hidden.has(k)))
    .map(([k, v]) => {
      if (v === true) return k
      if (typeof v === "string") return `${k}=${JSON.stringify(v)}`
      if (isValidElement(v)) return `${k}={${toJsx(v)}}`
      if (typeof v === "function") return `${k}={${k.replace(/^on/, "handle")}}`
      return `${k}={${JSON.stringify(v)}}`
    })
  const open = [name, ...attrs].join(" ")
  const inner = toJsx(children, indent + "  ", hidden)
  if (!inner) return `${indent}<${open} />`
  if (!inner.includes("\n") && inner.trim().length + open.length < 60) return `${indent}<${open}>${inner.trim()}</${name}>`
  return `${indent}<${open}>\n${inner}\n${indent}</${name}>`
}
