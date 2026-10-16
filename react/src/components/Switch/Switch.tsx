import type { ComponentPropsWithRef, ReactNode } from "react"

import type { AccessibleName } from "../Button/Button"
import styles from "./Switch.module.css"

type NativeInputProps = Omit<ComponentPropsWithRef<"input">, "type" | "role" | "size" | "children">

type CommonProps = NativeInputProps & {
  /** Called with the new state on every toggle (alongside the native onChange). */
  onCheckedChange?: (checked: boolean) => void
  /** Figma `Size`. default — 44 × 24, small — 40 × 22. */
  size?: "default" | "small"
  /** Figma `Type`. end (default) — label after the switch; start (reversed) — label before it. */
  labelPosition?: "end" | "start"
}

/** Figma `Label=true` — `-> Label` next to the switch. */
export type LabelledSwitchProps = CommonProps & {
  children: ReactNode
}

/** Figma `Label=false` — the switch alone; give it a name. */
export type BareSwitchProps = CommonProps &
  AccessibleName & {
    children?: undefined
  }

export type SwitchProps = LabelledSwitchProps | BareSwitchProps

/**
 * Figma `Switch` — an on/off setting that applies at once. A native checkbox with role="switch", so
 * Space toggles it, screen readers say "switch, on / off", and it submits with forms (name / value).
 * Use Checkbox when the choice only counts on submit.
 */
export function Switch(props: SwitchProps) {
  const { size = "default", labelPosition = "end", onCheckedChange, onChange, className, style, children, ...rest } = props

  return (
    <label
      data-size={size}
      data-label-position={labelPosition}
      className={className ? `${styles.root} ${className}` : styles.root}
      style={style}
    >
      <span className={styles.control}>
        <input
          {...rest}
          type="checkbox"
          role="switch"
          className={styles.input}
          onChange={(e) => {
            onChange?.(e)
            onCheckedChange?.(e.currentTarget.checked)
          }}
        />
        <span className={styles.thumb} aria-hidden="true" />
      </span>
      {children != null && <span className={styles.label}>{children}</span>}
    </label>
  )
}
