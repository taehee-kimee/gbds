import { Fragment, isValidElement, useId, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactElement, type ReactNode } from "react"

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
  /** Figma property type shown under the name when it differs from the control kind (e.g. "SLOT"). */
  figmaKind?: string
  /** Show the row only when this returns true (e.g. height only for size="custom"). */
  visibleWhen?: (values: FigmaValues) => boolean
}

export type FigmaControl = ControlBase &
  (
    | { kind: "VARIANT"; options: readonly string[]; default: string }
    | { kind: "BOOLEAN"; default: boolean }
    | { kind: "TEXT"; default: string; /** A number field instead of text; the value stays a string. */ inputType?: "number"; unit?: string; min?: number }
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
  // Chatbox onSubmit hands over the text itself.
  if (typeof arg === "string") return JSON.stringify(arg.length > 40 ? arg.slice(0, 40) + "…" : arg)
  // Chip onSelectedChange hands over the new state.
  if (typeof arg === "boolean") return `selected: ${arg}`
  if (!e || typeof e !== "object") return ""
  // Calendar onChange: a Date, or a { start, end? } range.
  const day = (d: unknown) => (d instanceof Date ? d.toLocaleDateString("en-CA") : "…")
  if (arg instanceof Date) return day(arg)
  // Input type="tel" onPhoneChange: { country, e164, valid }.
  if ("callingCode" in e) {
    const ph = e as unknown as { country: string; e164?: string; valid: boolean }
    return `${ph.country} ${ph.e164 ?? "—"} valid: ${ph.valid}`
  }
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
  const shown = story.controls.filter((c) => c.visibleWhen?.(values) ?? true)
  const figmaControls = shown.filter((c) => c.source !== "code")
  const codeControls = shown.filter((c) => c.source === "code")

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

/**
 * Figma's instance-swap picker: a button showing the current icon; clicking it opens a searchable grid.
 * The grid is a native popover (top layer), so the controls table never clips it; Esc and outside clicks close it.
 */
function SwapPicker({ labelledBy, options, value, onChange }: { labelledBy: string; options: Record<string, ReactElement>; value: string; onChange: (v: string) => void }) {
  const popoverId = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [q, setQ] = useState("")
  const names = Object.keys(options)
  const shown = q ? names.filter((n) => n.toLowerCase().includes(q.trim().toLowerCase())) : names

  // Place the panel under the trigger, or above it when there is no room below.
  const place = () => {
    const r = trigger.current?.getBoundingClientRect()
    const el = panel.current
    if (!r || !el) return
    const below = window.innerHeight - r.bottom > el.offsetHeight + 8
    el.style.left = `${Math.min(r.left, window.innerWidth - el.offsetWidth - 8)}px`
    el.style.top = `${below ? r.bottom + 4 : Math.max(8, r.top - el.offsetHeight - 4)}px`
  }
  const pick = (name: string) => {
    onChange(name)
    panel.current?.hidePopover()
    trigger.current?.focus()
  }

  return (
    <>
      <button ref={trigger} type="button" className="pp-swap" popoverTarget={popoverId} aria-labelledby={labelledBy} aria-describedby={`${popoverId}-value`}>
        <span className="pp-swap-icon">{options[value]}</span>
        <span id={`${popoverId}-value`}>{value.replace(/^lucide\//, "")}</span>
      </button>
      <div
        ref={panel}
        id={popoverId}
        popover="auto"
        className="pp-swap-panel"
        onToggle={(e) => {
          if (e.newState === "open") {
            place()
            panel.current?.querySelector("input")?.focus()
          } else setQ("")
        }}
      >
        <input type="search" placeholder={`아이콘 검색 (${names.length})`} aria-label="아이콘 검색" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="pp-swap-grid" role="listbox" aria-label="아이콘">
          {shown.map((name) => (
            <button
              key={name}
              type="button"
              role="option"
              aria-selected={name === value}
              title={name}
              aria-label={name.replace(/^lucide\//, "")}
              onClick={() => pick(name)}
            >
              {options[name]}
            </button>
          ))}
          {shown.length === 0 && <p>결과 없음</p>}
        </div>
      </div>
    </>
  )
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
      input =
        control.inputType === "number" ? (
          <label className="pp-number">
            <input
              type="number"
              inputMode="numeric"
              min={control.min}
              aria-labelledby={id}
              value={String(value)}
              onChange={(e) => onChange(e.target.value)}
            />
            {control.unit && <span>{control.unit}</span>}
          </label>
        ) : (
          <input type="text" aria-labelledby={id} value={String(value)} onChange={(e) => onChange(e.target.value)} />
        )
      break
    case "INSTANCE_SWAP":
      // Icon swaps get the visual picker; other swaps (example content, button combos) keep a plain list.
      input = Object.keys(control.options).every((o) => o.startsWith("lucide/")) ? (
        <SwapPicker labelledBy={id} options={control.options} value={String(value)} onChange={onChange} />
      ) : (
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
        <small className="pp-kind">{control.source === "code" ? "React prop" : `Figma ${control.figmaKind ?? control.kind}`}</small>
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

/** new Date(2026, 8, 11) — local calendar date, the way Calendar stories build them. */
function printDate(d: Date) {
  return `new Date(${d.getFullYear()}, ${d.getMonth()}, ${d.getDate()})`
}

/** { icon: <X />, label: "지우기", onClick: handleClick } — elements as JSX, functions as handler names. */
function printObject(o: Record<string, unknown>, owner: string): string {
  const parts = Object.entries(o)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => {
      if (isValidElement(v)) return `${k}: ${toJsx(v)}`
      if (v instanceof Date) return `${k}: ${printDate(v)}`
      if (typeof v === "function") {
        const key = k.replace(/^on/, "")
        return `${k}: handle${owner[0]!.toUpperCase()}${owner.slice(1)}${key[0]!.toUpperCase()}${key.slice(1)}`
      }
      return `${k}: ${JSON.stringify(v)}`
    })
  return `{ ${parts.join(", ")} }`
}

function elementName(type: unknown) {
  const t = type as AnyType
  if (type === Fragment) return "" // prints <>…</>
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
    // false is printed (clearable={false}, showSend={false}); stories pass undefined for "not set".
    .filter(([k, v]) => v !== undefined && !(typeof v === "function" && hidden.has(k)))
    .map(([k, v]) => {
      if (v === true) return k
      if (v === false) return `${k}={false}`
      if (typeof v === "string") return `${k}=${JSON.stringify(v)}`
      if (isValidElement(v)) return `${k}={${toJsx(v)}}`
      if (typeof v === "function") return `${k}={${k.replace(/^on/, "handle")}}`
      if (v instanceof Date) return `${k}={${printDate(v)}}`
      if (v && typeof v === "object" && !Array.isArray(v)) return `${k}={${printObject(v as Record<string, unknown>, k)}}`
      return `${k}={${JSON.stringify(v)}}`
    })
  const open = [name, ...attrs].join(" ")
  const inner = toJsx(children, indent + "  ", hidden)
  if (!inner) return `${indent}<${open} />`
  if (!inner.includes("\n") && inner.trim().length + open.length < 60) return `${indent}<${open}>${inner.trim()}</${name}>`
  return `${indent}<${open}>\n${inner}\n${indent}</${name}>`
}
