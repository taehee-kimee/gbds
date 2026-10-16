import type { ComponentPropsWithRef, ReactNode } from "react"

import styles from "./Spinner.module.css"

export type SpinnerProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  /** Figma `-> Label`. Read out to screen readers when the spinner appears. Default "Processing". */
  label?: ReactNode
  /** Figma `Type`. */
  variant?: "outline" | "reversed" | "primary"
}

/**
 * Indeterminate loading — work whose duration is unknown. A turning ring next to a label, in a small pill.
 * role="status": screen readers announce the label when it appears (politely, without moving focus).
 */
export function Spinner(props: SpinnerProps) {
  const { label = "Processing", variant = "outline", className, ...rest } = props
  return (
    <div role="status" {...rest} data-variant={variant} className={className ? `${styles.root} ${className}` : styles.root}>
      <span className={styles.ring} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  )
}
