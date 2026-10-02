import type { ComponentPropsWithRef, ReactNode } from "react"

import styles from "./Button.module.css"

type NativeButtonProps = Omit<ComponentPropsWithRef<"button">, "children"> & {
  /**
   * Selected state, e.g. the current item of a button group. Default false.
   * true shows the Figma State=active look. Passing the prop (true or false) also marks the button
   * as a toggle for screen readers (`aria-pressed`); a plain action button simply omits it.
   * With `aria-current` (navigation) no aria-pressed is added.
   */
  isSelected?: boolean
}

/** Figma `Type=primary | mute | outline | link` — a labelled button. */
export type TextButtonProps = NativeButtonProps & {
  variant?: "primary" | "mute" | "outline" | "link"
  children: ReactNode
  /** Figma `Trailing icon` + `Icon` swap. Rendered after the label at 16px. Not shown for `link`. */
  trailingIcon?: ReactNode
}

/** Figma `Type=icon | ghost | icon rounded` — a single icon, no visible label. */
export type IconButtonProps = NativeButtonProps & {
  variant: "icon" | "ghost" | "icon-rounded"
  /** The icon. Use an SVG; it is sized to 16px and colored with currentColor. */
  children: ReactNode
  /** Required: an icon-only button has no text for screen readers to announce. */
  "aria-label": string
}

export type ButtonProps = TextButtonProps | IconButtonProps

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    className,
    type = "button",
    children,
    trailingIcon,
    isSelected = false,
    ...rest
  } = props as ButtonProps & { trailingIcon?: ReactNode }
  // Only buttons that take part in selection get aria-pressed — a plain button never announces "not pressed".
  // (Checks the raw prop, not the defaulted one: spreading `{ isSelected: undefined }` must stay a plain button.)
  const pressed = props.isSelected !== undefined && !rest["aria-current"] ? isSelected : undefined

  return (
    <button
      {...rest}
      type={type}
      aria-pressed={rest["aria-pressed"] ?? pressed}
      data-variant={variant}
      data-selected={isSelected || undefined}
      className={className ? `${styles.root} ${className}` : styles.root}
    >
      {children}
      {variant !== "link" && trailingIcon}
    </button>
  )
}
