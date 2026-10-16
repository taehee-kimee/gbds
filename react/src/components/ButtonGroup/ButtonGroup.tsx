import type { ComponentPropsWithRef, ReactNode } from "react"

import { ButtonGroupContext } from "./context"
import styles from "./ButtonGroup.module.css"

type CommonProps = {
  /** The Buttons. */
  children: ReactNode
  /** Figma `Status=disabled` — disables every Button inside unless one sets `disabled` itself. */
  disabled?: boolean
}

/**
 * Figma `Type=skippable | back or forth | save | confirm | Error` — one secondary/primary pair.
 * The Types differ only in their labels, so in code they are one variant; pass the two Buttons.
 */
export type ActionsButtonGroupProps = Omit<ComponentPropsWithRef<"div">, "children"> &
  CommonProps & {
    variant?: "actions"
  }

/** Figma `Type=menu` — a floating pill of ghost Buttons for top-level navigation. Renders a <nav>. */
export type MenuButtonGroupProps = Omit<ComponentPropsWithRef<"nav">, "children"> &
  CommonProps & {
    variant: "menu"
  }

export type ButtonGroupProps = ActionsButtonGroupProps | MenuButtonGroupProps

export function ButtonGroup(props: ButtonGroupProps) {
  const { variant = "actions", disabled, className, children, ...rest } = props
  const shared = {
    "data-variant": variant,
    "data-disabled": disabled || undefined,
    className: className ? `${styles.root} ${className}` : styles.root,
  }

  return (
    <ButtonGroupContext value={{ disabled }}>
      {variant === "menu" ? (
        <nav {...(rest as ComponentPropsWithRef<"nav">)} {...shared}>
          {children}
        </nav>
      ) : (
        <div role="group" {...(rest as ComponentPropsWithRef<"div">)} {...shared}>
          {children}
        </div>
      )}
    </ButtonGroupContext>
  )
}
