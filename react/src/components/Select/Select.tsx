import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react"
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react"

import { useField } from "../Input/Field"
import { usePopupPosition } from "../Dropdown/popup"
import dropdown from "../Dropdown/Dropdown.module.css"
import scroll from "../ScrollArea/ScrollArea.module.css"
import own from "./Select.module.css"

export type SelectOption = {
  value: string
  /** Shown in the list and, once picked, in the trigger. Also what typing a letter jumps to. */
  label: string
  /** Figma `Leading Icon` — a 16px lucide icon before the label. */
  icon?: ReactNode
  /** Figma code column (`-> Placeholder1`, e.g. "+82") — a fixed 50px column before the label. */
  code?: ReactNode
  /** Figma `Status=disabled` — shown but cannot be picked. */
  disabled?: boolean
}

export type SelectProps = Omit<ComponentPropsWithRef<"button">, "type" | "value" | "defaultValue" | "onChange" | "children"> & {
  options: readonly SelectOption[]
  /** Picked value, controlled. `null` = nothing picked (placeholder shows). */
  value?: string | null
  /** Picked value when uncontrolled. */
  defaultValue?: string | null
  onValueChange?: (value: string) => void
  /** Figma `-> Placeholder` — shown while nothing is picked (Status=default). */
  placeholder?: string
  /** Figma `Style`. On type="side", primary opens to the right and reverse to the left. */
  variant?: "primary" | "reverse" | "mute" | "ghost"
  /** Figma `Type`. side — small text trigger whose list opens beside it. */
  type?: "default" | "side"
  /** Marks the trigger invalid (also set by a surrounding Field with an error). */
  invalid?: boolean
  /** Submitted with forms through a hidden input. */
  name?: string
  /** What the trigger shows for the picked option. Default: its label. (Input tel shows only "+82".) */
  renderValue?: (option: SelectOption) => ReactNode
  /** Called when the list opens or closes. */
  onOpenChange?: (open: boolean) => void
}

export function Select(props: SelectProps) {
  const {
    options,
    value: valueProp,
    defaultValue = null,
    onValueChange,
    placeholder = "Select",
    variant = "primary",
    type = "default",
    invalid,
    name,
    onOpenChange,
    renderValue,
    disabled,
    className,
    style,
    id,
    ref,
    onKeyDown,
    onBlur,
    ...rest
  } = props

  const field = useField()
  const autoId = useId()
  const triggerId = id ?? field.inputId ?? `${autoId}-trigger`
  const listId = `${autoId}-list`
  const optionId = (i: number) => `${autoId}-option-${i}`

  const [inner, setInner] = useState<string | null>(defaultValue)
  const value = valueProp !== undefined ? valueProp : inner
  const selectedIndex = options.findIndex((o) => o.value === value)
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const typed = useRef({ text: "", at: 0 })

  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node
      assignRef(ref, node)
    },
    [ref]
  )

  const side = type === "side"
  const placement = side ? (variant === "reverse" ? "left-start" : "right-start") : "bottom-start"
  usePopupPosition(triggerRef, listRef, open, placement)

  const enabled = (i: number) => i >= 0 && i < options.length && !options[i]!.disabled
  const step = (from: number, dir: 1 | -1) => {
    for (let i = from + dir; i >= 0 && i < options.length; i += dir) if (enabled(i)) return i
    return from
  }
  const first = () => step(-1, 1)
  const last = () => step(options.length, -1)

  // The native popover owns open / close (trigger click, outside click, Escape); mirror it in state.
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const onToggle = (e: Event) => {
      const isOpen = (e as ToggleEvent).newState === "open"
      setOpen(isOpen)
      if (isOpen) setActive((a) => (enabled(a) ? a : enabled(selectedIndex) ? selectedIndex : first()))
      else setActive(-1)
      onOpenChange?.(isOpen)
    }
    list.addEventListener("toggle", onToggle)
    return () => list.removeEventListener("toggle", onToggle)
  })

  // Keep the highlighted option in view.
  useEffect(() => {
    if (open && active >= 0) document.getElementById(optionId(active))?.scrollIntoView({ block: "nearest" })
  }, [open, active])

  const show = (index?: number) => {
    if (index !== undefined) setActive(index)
    if (!listRef.current?.matches(":popover-open")) listRef.current?.showPopover()
  }
  const hide = () => {
    if (listRef.current?.matches(":popover-open")) listRef.current.hidePopover()
  }
  const pick = (i: number) => {
    if (!enabled(i)) return
    const next = options[i]!.value
    if (valueProp === undefined) setInner(next)
    if (next !== value) onValueChange?.(next)
    hide()
  }

  // Typing letters jumps to the next option whose label starts with them (APG select-only combobox).
  const typeahead = (char: string) => {
    const now = Date.now()
    const t = typed.current
    t.text = now - t.at > 500 ? char : t.text + char
    t.at = now
    const query = t.text.toLowerCase()
    const start = open ? active : selectedIndex
    const order = options.map((_, i) => (start + 1 + i) % options.length)
    // A repeated single letter cycles through the matches.
    const same = query.split("").every((c) => c === query[0])
    const match = order.find((i) => enabled(i) && options[i]!.label.toLowerCase().startsWith(same ? query[0]! : query))
    return match
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e)
    if (e.defaultPrevented || disabled) return
    const key = e.key
    if (!open) {
      if (key === "ArrowDown" || key === "ArrowUp" || key === "Enter" || key === " ") {
        e.preventDefault()
        show(enabled(selectedIndex) ? selectedIndex : key === "ArrowUp" ? last() : first())
      } else if (key === "Home" || key === "End") {
        e.preventDefault()
        show(key === "Home" ? first() : last())
      } else if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const match = typeahead(key)
        if (match !== undefined) {
          e.preventDefault()
          show(match)
        }
      }
      return
    }
    switch (key) {
      case "ArrowDown":
        e.preventDefault()
        if (e.altKey) break
        setActive((a) => step(a, 1))
        break
      case "ArrowUp":
        e.preventDefault()
        if (e.altKey) pick(active)
        else setActive((a) => step(a, -1))
        break
      case "Home":
        e.preventDefault()
        setActive(first())
        break
      case "End":
        e.preventDefault()
        setActive(last())
        break
      case "PageDown":
        e.preventDefault()
        setActive((a) => { let n = a; for (let k = 0; k < 10; k++) n = step(n, 1); return n })
        break
      case "PageUp":
        e.preventDefault()
        setActive((a) => { let n = a; for (let k = 0; k < 10; k++) n = step(n, -1); return n })
        break
      case "Enter":
      case " ":
        e.preventDefault()
        pick(active)
        break
      case "Tab":
        // Tab keeps the highlighted option, closes, and lets focus move on.
        pick(active)
        break
      default:
        if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const match = typeahead(key)
          if (match !== undefined) {
            e.preventDefault()
            setActive(match)
          }
        }
    }
  }

  const isInvalid = invalid ?? field.invalid
  const Icon = side ? (variant === "reverse" ? (open ? ChevronRight : ChevronLeft) : open ? ChevronLeft : ChevronRight) : open ? ChevronUp : ChevronDown

  return (
    <div
      className={[own.root, dropdown.root, className].filter(Boolean).join(" ")}
      style={style}
      data-type={type}
      data-variant={variant}
      data-open={open || undefined}
      data-filled={selected ? "" : undefined}
      data-invalid={isInvalid || undefined}
      data-disabled={disabled || undefined}
    >
      <button
        aria-describedby={field.describedBy}
        {...rest}
        ref={setRefs}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        aria-invalid={isInvalid || undefined}
        disabled={disabled}
        popoverTarget={listId}
        className={dropdown.trigger}
        onKeyDown={handleKeyDown}
        onBlur={(e) => {
          onBlur?.(e)
          // Focus left (e.g. clicked elsewhere without light-dismissing) — close.
          if (!listRef.current?.contains(e.relatedTarget as Node | null)) hide()
        }}
      >
        <span className={dropdown.value}>{selected ? (renderValue ? renderValue(selected) : selected.label) : placeholder}</span>
        <Icon className={dropdown.chevron} aria-hidden="true" />
      </button>
      <div
        ref={listRef}
        id={listId}
        popover="auto"
        role="listbox"
        aria-labelledby={triggerId}
        // Figma Dropdown slot holds a Scroll bar Type=Thick — ScrollArea's class gives the list that bar.
        className={`${dropdown.list} ${scroll.root}`}
        data-scrollbar="thick"
        data-orientation="vertical"
        data-placement={placement}
      >
        {options.map((o, i) => (
          <div
            key={o.value}
            id={optionId(i)}
            role="option"
            aria-selected={i === selectedIndex}
            aria-disabled={o.disabled || undefined}
            data-active={i === active || undefined}
            className={dropdown.option}
            // Keep focus on the trigger (aria-activedescendant pattern).
            onMouseDown={(e) => e.preventDefault()}
            onMouseMove={() => enabled(i) && i !== active && setActive(i)}
            onClick={() => pick(i)}
          >
            {o.icon != null && (
              <span className={dropdown.optionIcon} aria-hidden="true">
                {o.icon}
              </span>
            )}
            {o.code != null && <span className={dropdown.code}>{o.code}</span>}
            <span className={dropdown.label}>{o.label}</span>
          </div>
        ))}
      </div>
      {name != null && <input type="hidden" name={name} value={value ?? ""} disabled={disabled} />}
    </div>
  )
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value)
  else if (ref) ref.current = value
}
