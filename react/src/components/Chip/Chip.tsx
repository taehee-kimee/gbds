import { X } from "lucide-react"
import { useState, type ComponentPropsWithRef, type CSSProperties, type ReactNode } from "react"

import styles from "./Chip.module.css"

type NativeButtonProps = Omit<ComponentPropsWithRef<"button">, "children" | "className" | "style" | "onChange">

export type ChipProps = NativeButtonProps & {
  /** The label. Figma `-> Label`. */
  children: ReactNode
  /** Figma `Type`. */
  variant?: "primary" | "secondary" | "outline" | "ghost"
  /** Figma `Status=active` — the chip is switched on. Controlled; pair with onSelectedChange. Sets aria-pressed. */
  isSelected?: boolean
  /** Initial selection when uncontrolled. */
  defaultSelected?: boolean
  /** Called with the new selection when the chip is clicked. */
  onSelectedChange?: (selected: boolean) => void
  /**
   * Figma `Delete icon` — shows the X badge on the corner; called when it is pressed (or Delete /
   * Backspace on the chip). Hidden while disabled.
   */
  onRemove?: () => void
  /** Accessible name of the X. Default "Remove". */
  removeLabel?: string
  /** Applied to the outer wrapper (chip + X). */
  className?: string
  /** Applied to the outer wrapper (chip + X). */
  style?: CSSProperties
}

export function Chip(props: ChipProps) {
  const {
    children,
    variant = "primary",
    isSelected,
    defaultSelected = false,
    onSelectedChange,
    onRemove,
    removeLabel = "Remove",
    className,
    style,
    disabled,
    onClick,
    onKeyDown,
    type = "button",
    ...rest
  } = props

  const [inner, setInner] = useState(defaultSelected)
  const selected = isSelected ?? inner
  const removable = !!onRemove && !disabled

  return (
    <span
      className={className ? `${styles.root} ${className}` : styles.root}
      style={style}
      data-variant={variant}
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
    >
      <button
        {...rest}
        type={type}
        className={styles.chip}
        disabled={disabled}
        aria-pressed={selected}
        onClick={(e) => {
          onClick?.(e)
          if (e.defaultPrevented) return
          if (isSelected === undefined) setInner(!selected)
          onSelectedChange?.(!selected)
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e)
          // Removable chips also go away from the keyboard, as in most tag inputs.
          if (!e.defaultPrevented && removable && (e.key === "Delete" || e.key === "Backspace")) {
            e.preventDefault()
            onRemove!()
          }
        }}
      >
        {children}
      </button>
      {removable && (
        <button type="button" className={styles.remove} aria-label={removeLabel} onClick={onRemove}>
          {/* 1.5 at 16px ≈ the 1px stroke of the Figma icon (lucide default is 2). */}
          <X strokeWidth={1.5} />
        </button>
      )}
    </span>
  )
}
