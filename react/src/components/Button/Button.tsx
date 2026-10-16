import { useContext, type ComponentPropsWithRef, type ReactNode } from "react"

import { ButtonGroupContext } from "../ButtonGroup/context"
import styles from "./Button.module.css"

type SelectableProps = {
  /**
   * Selected state, e.g. the current item of a button group. Default false.
   * true shows the Figma Status=active look. Passing the prop (true or false) also marks the button
   * as a toggle for screen readers (`aria-pressed`); a plain action button simply omits it.
   * With `aria-current` (navigation) no aria-pressed is added.
   */
  isSelected?: boolean
}

/**
 * Without href: a <button>. With href: an <a> — the same look, but real navigation (new tab, copy link,
 * middle click). A disabled link drops its href and gets aria-disabled, since <a> has no disabled.
 */
type NativeButtonProps = SelectableProps &
  (
    | (Omit<ComponentPropsWithRef<"button">, "children"> & { href?: undefined })
    | (Omit<ComponentPropsWithRef<"a">, "children"> & { href: string; disabled?: boolean })
  )

/**
 * Required when nothing visible names the control: `aria-label`, or `aria-labelledby` pointing at
 * text already on screen. Either one satisfies the type; omitting both is a compile error.
 */
export type AccessibleName =
  | { "aria-label": string; "aria-labelledby"?: string }
  | { "aria-labelledby": string; "aria-label"?: string }

/** Figma `Type=default`, `Style=default | mute | outline | link` — a label, optionally followed by an icon. */
export type TextButtonProps = NativeButtonProps & {
  variant?: "default" | "mute" | "outline" | "link"
  children: ReactNode
  /** Figma `Show icon` + `-> Icon`. Rendered after the label — 16px, 12px for `link`. Any SVG, colored with currentColor. */
  icon?: ReactNode
}

/** Figma `Type=default, Style=ghost` (a pill with no fill) and `Type=google` (sign-in). Label only — no icon slot in Figma. */
export type PlainButtonProps = NativeButtonProps & {
  variant: "ghost" | "google"
  children: ReactNode
  icon?: undefined
}

/** Figma `Type=icon`, `Style=default | ghost | ghost-rounded` — a single 16px icon, no visible label. */
export type IconButtonProps = NativeButtonProps &
  AccessibleName & {
    variant?: "default" | "ghost" | "ghost-rounded"
    icon: ReactNode
    children?: undefined
  }

export type ButtonProps = TextButtonProps | PlainButtonProps | IconButtonProps

export function Button(props: ButtonProps) {
  const { variant = "default", className, children, icon, isSelected = false, ...rest } = props
  const link = props.href !== undefined
  // Only buttons that take part in selection get aria-pressed — a plain button never announces "not pressed".
  // (Checks the raw prop, not the defaulted one: spreading `{ isSelected: undefined }` must stay a plain button.)
  // Links never get it: aria-pressed is a button state; a link marks the current page with aria-current.
  const pressed = props.isSelected !== undefined && !rest["aria-current"] && !link ? isSelected : undefined
  // Figma Type: google is its own Type; a button with no children is Type=icon.
  // Inside a disabled ButtonGroup (Figma Status=disabled) unless this button says otherwise.
  const group = useContext(ButtonGroupContext)
  const disabled = rest.disabled ?? group.disabled
  const figmaType = variant === "google" ? "google" : children == null ? "icon" : "default"

  const shared = {
    "data-type": figmaType,
    "data-variant": variant,
    "data-selected": isSelected || undefined,
    className: className ? `${styles.root} ${className}` : styles.root,
  }
  const content = (
    <>
      {figmaType === "google" && <GoogleLogo />}
      {figmaType === "icon" ? icon : children}
      {figmaType === "default" && icon}
    </>
  )

  if (link) {
    const { href, disabled: _, ...anchor } = rest as ComponentPropsWithRef<"a"> & { disabled?: boolean }
    return (
      <a
        {...anchor}
        {...shared}
        // No href = not focusable and not followable; role keeps it announced as a (disabled) link.
        href={disabled ? undefined : href}
        role={disabled ? "link" : anchor.role}
        aria-disabled={disabled || undefined}
      >
        {content}
      </a>
    )
  }

  const { type = "button", ...button } = rest as ComponentPropsWithRef<"button">
  return (
    <button {...button} {...shared} type={type} disabled={disabled} aria-pressed={button["aria-pressed"] ?? pressed}>
      {content}
    </button>
  )
}

/** lucide/Google — the brand mark from the Figma Lucide Icons page. Brand colors are fixed. */
function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#F44336" d="M11.6 2C12.3 1.9 12.8 1.9 13.7 2C15.6 2.3 17.4 3.2 18.8 4.6C17.8 5.5 16.9 6.4 16 7.4C14.2 5.9 12.3 5.5 10.1 6.3C8.5 7.1 7.4 8.3 6.8 9.9C5.8 9.2 4.8 8.4 3.8 7.6C3.7 7.5 3.6 7.5 3.5 7.5C5.1 4.4 7.6 2.6 10.9 2L11.6 2Z" />
      <path fill="#FFC107" d="M3.8 7.6C4.8 8.4 5.8 9.2 6.8 9.9C6.6 10.6 6.5 11.3 6.5 11.9C6.5 12.6 6.6 13.2 6.8 13.8L3.6 16.4C2.2 13.5 2.2 10.5 3.5 7.5C3.6 7.5 3.7 7.5 3.8 7.6Z" />
      <path fill="#448AFF" d="M12.2 10.1C15.3 10.1 18.3 10.1 21.4 10.2C21.9 13.4 21.3 16.2 19.4 18.8C19.1 19 18.9 19.3 18.6 19.5C17.7 18.6 16.6 17.8 15.5 17C16.6 16.2 17.3 15.2 17.5 13.8H12.2V10.1Z" />
      <path fill="#43A047" d="M6.8 13.8C7.9 16.7 10.1 18.1 13.1 17.9C14 17.8 14.8 17.5 15.5 17C16.6 17.8 17.7 18.6 18.6 19.5C17.1 20.9 15.1 21.8 13 21.9C12.5 21.9 12 21.9 11.5 21.9C8 21.5 5.3 19.6 3.6 16.4L6.8 13.8Z" />
    </svg>
  )
}
