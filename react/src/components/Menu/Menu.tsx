import { ChevronDown, ChevronUp } from "lucide-react"
import { useCallback, useEffect, useId, useRef, useState, type ComponentPropsWithRef, type KeyboardEvent, type ReactNode, type Ref } from "react"

import { usePopupPosition } from "../Dropdown/popup"
import dropdown from "../Dropdown/Dropdown.module.css"
import scroll from "../ScrollArea/ScrollArea.module.css"
import own from "./Menu.module.css"

export type MenuItem = {
  /** Passed to onAction. */
  id: string
  label: string
  /** Figma `Leading Icon` — 16px lucide icon (Dropdown slot Type=menu). */
  icon?: ReactNode
  /** Figma code column — a fixed 50px column before the label. */
  code?: ReactNode
  disabled?: boolean
}

type CommonProps = Omit<ComponentPropsWithRef<"button">, "type" | "children"> & {
  items: readonly MenuItem[]
  /** Called with the item's id when it is chosen (click, Enter or Space). The menu then closes. */
  onAction?: (id: string) => void
  /** Figma `Style` of the trigger. */
  variant?: "primary" | "reverse" | "mute" | "ghost"
  onOpenChange?: (open: boolean) => void
}

/** Figma select `Type=default` as a menu button — the label shows on the trigger, with a chevron. */
export type TextMenuProps = CommonProps & {
  type?: "default"
  label: string
  icon?: undefined
}

/** Figma select `Type=icon` — a 36 × 36 trigger showing only `icon`; `label` becomes its accessible name. */
export type IconMenuProps = CommonProps & {
  type: "icon"
  label: string
  icon: ReactNode
}

export type MenuProps = TextMenuProps | IconMenuProps

export function Menu(props: MenuProps) {
  const { items, onAction, variant = "primary", type = "default", label, icon, onOpenChange, disabled, className, style, ref, onKeyDown, ...rest } = props

  const autoId = useId()
  const triggerId = `${autoId}-trigger`
  const menuId = `${autoId}-menu`
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const openWith = useRef<"first" | "last">("first")
  const typed = useRef({ text: "", at: 0 })

  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node
      assignRef(ref, node)
    },
    [ref]
  )

  usePopupPosition(triggerRef, menuRef, open, "bottom-start")

  const enabled = (i: number) => i >= 0 && i < items.length && !items[i]!.disabled
  const focusItem = (i: number) => itemRefs.current[i]?.focus()
  const firstEnabled = () => items.findIndex((_, i) => enabled(i))
  const lastEnabled = () => items.map((_, i) => i).filter(enabled).at(-1) ?? -1
  const current = () => itemRefs.current.findIndex((el) => el === document.activeElement)
  const move = (dir: 1 | -1) => {
    const n = items.length
    for (let k = 1, i = current(); k <= n; k++) {
      const next = (i + dir * k + n) % n
      if (enabled(next)) return focusItem(next)
    }
  }

  // The native popover owns open / close (trigger click, outside click, Escape) and returns focus.
  useEffect(() => {
    const menu = menuRef.current
    if (!menu) return
    const onToggle = (e: Event) => {
      const isOpen = (e as ToggleEvent).newState === "open"
      setOpen(isOpen)
      onOpenChange?.(isOpen)
      const fromEnd = openWith.current === "last"
      openWith.current = "first"
      if (isOpen) requestAnimationFrame(() => focusItem(fromEnd ? lastEnabled() : firstEnabled()))
    }
    menu.addEventListener("toggle", onToggle)
    return () => menu.removeEventListener("toggle", onToggle)
  })

  const hide = () => {
    if (menuRef.current?.matches(":popover-open")) menuRef.current.hidePopover()
    triggerRef.current?.focus()
  }
  const choose = (i: number) => {
    if (!enabled(i)) return
    hide()
    onAction?.(items[i]!.id)
  }

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(e)
    if (e.defaultPrevented || disabled) return
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      openWith.current = e.key === "ArrowUp" ? "last" : "first"
      menuRef.current?.showPopover()
    }
  }

  const handleMenuKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        move(1)
        break
      case "ArrowUp":
        e.preventDefault()
        move(-1)
        break
      case "Home":
        e.preventDefault()
        focusItem(firstEnabled())
        break
      case "End":
        e.preventDefault()
        focusItem(lastEnabled())
        break
      case "Enter":
      case " ":
        e.preventDefault()
        choose(current())
        break
      case "Tab":
        // Close and let focus continue from the trigger.
        menuRef.current?.hidePopover()
        break
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const now = Date.now()
          const t = typed.current
          t.text = now - t.at > 500 ? e.key : t.text + e.key
          t.at = now
          const q = t.text.toLowerCase()
          const start = current()
          const match = items.map((_, k) => (start + 1 + k) % items.length).find((i) => enabled(i) && items[i]!.label.toLowerCase().startsWith(q))
          if (match !== undefined) focusItem(match)
        }
    }
  }

  const Chevron = open ? ChevronUp : ChevronDown

  return (
    <div
      className={[own.root, dropdown.root, className].filter(Boolean).join(" ")}
      style={style}
      data-type={type}
      data-variant={variant}
      data-open={open || undefined}
      data-filled=""
      data-disabled={disabled || undefined}
    >
      <button
        {...rest}
        ref={setRefs}
        id={triggerId}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={type === "icon" ? label : rest["aria-label"]}
        disabled={disabled}
        popoverTarget={menuId}
        className={dropdown.trigger}
        onKeyDown={handleTriggerKeyDown}
      >
        {type === "icon" ? (
          <span className={dropdown.triggerIcon} aria-hidden="true">
            {icon}
          </span>
        ) : (
          <>
            <span className={dropdown.value}>{label}</span>
            <Chevron className={dropdown.chevron} aria-hidden="true" />
          </>
        )}
      </button>
      <div
        ref={menuRef}
        id={menuId}
        popover="auto"
        role="menu"
        aria-labelledby={triggerId}
        // Figma Dropdown slot holds a Scroll bar Type=Thick — ScrollArea's class gives the list that bar.
        className={`${dropdown.list} ${scroll.root}`}
        data-scrollbar="thick"
        data-orientation="vertical"
        data-placement="bottom-start"
        onKeyDown={handleMenuKeyDown}
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            role="menuitem"
            tabIndex={-1}
            aria-disabled={item.disabled || undefined}
            className={dropdown.option}
            onMouseMove={(e) => enabled(i) && document.activeElement !== e.currentTarget && e.currentTarget.focus()}
            onClick={() => choose(i)}
          >
            {item.icon != null && (
              <span className={dropdown.optionIcon} aria-hidden="true">
                {item.icon}
              </span>
            )}
            {item.code != null && <span className={dropdown.code}>{item.code}</span>}
            <span className={dropdown.label}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value)
  else if (ref) ref.current = value
}
