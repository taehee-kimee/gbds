import type { ComponentPropsWithRef, ReactNode } from "react"

import type { AccessibleName } from "../Button/Button"
import styles from "./Badge.module.css"

type NativeSpanProps = Omit<ComponentPropsWithRef<"span">, "children">

type CommonProps = NativeSpanProps & {
  /** Figma `Style`. */
  variant?: "default" | "reverse" | "alarm" | "success" | "destructive" | "outline"
  /** Figma `Size` — the height in px. Scales the label (12px → 14px) and the icon (10px → 14px). */
  size?: 20 | 28
  /** Figma `Leading Icon` + `-> Leading Icon` swap. Any SVG; sized by the badge and colored like the label. */
  icon?: ReactNode
}

/** Figma `Label=true` — the label text, with an optional leading icon. */
export type LabelledBadgeProps = CommonProps & {
  children: ReactNode
}

/** Figma `Label=false` — the icon alone. Needs an accessible name, since nothing visible names it. */
export type IconBadgeProps = CommonProps &
  AccessibleName & {
    icon: ReactNode
    children?: undefined
  }

export type BadgeProps = LabelledBadgeProps | IconBadgeProps

export function Badge(props: BadgeProps) {
  const { variant = "default", size = 20, icon, className, children, ...rest } = props
  const iconOnly = children == null

  return (
    <span
      role={iconOnly ? "img" : undefined}
      {...rest}
      data-variant={variant}
      data-size={size}
      className={className ? `${styles.root} ${className}` : styles.root}
    >
      {icon != null && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  )
}
