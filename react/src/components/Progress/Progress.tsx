import { useId, type ComponentPropsWithRef, type ReactNode } from "react"

import type { AccessibleName } from "../Button/Button"
import styles from "./Progress.module.css"

type CommonProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  /** How much is done, 0 … max. Unknown progress → use Spinner instead. */
  value: number
  /** Default 100. */
  max?: number
  /** Shown instead of `label` once value reaches max (Figma Status=completed). Default "Completed". */
  completedLabel?: ReactNode
}

/** Figma `Text=true` — `-> Placeholder` above the bar; it also names the progress bar. */
export type LabelledProgressProps = CommonProps & {
  label: ReactNode
}

/** Figma `Text=false` — bar only; give it a name. */
export type BareProgressProps = CommonProps &
  AccessibleName & {
    label?: undefined
  }

export type ProgressProps = LabelledProgressProps | BareProgressProps

export function Progress(props: ProgressProps) {
  const {
    value,
    max = 100,
    label,
    completedLabel = "Completed",
    className,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    ...rest
  } = props

  const id = useId()
  const top = max > 0 ? max : 100
  const now = Math.min(Math.max(0, Number.isFinite(value) ? value : 0), top)
  // Figma Status is not a prop — it follows the value.
  const status = now >= top ? "completed" : "in progress"
  const text = label == null ? null : status === "completed" ? completedLabel : label

  return (
    <div {...rest} data-status={status} className={className ? `${styles.root} ${className}` : styles.root}>
      {text != null && (
        <span id={`${id}-label`} className={styles.label}>
          {text}
        </span>
      )}
      <div
        role="progressbar"
        aria-labelledby={ariaLabelledby ?? (text != null ? `${id}-label` : undefined)}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={top}
        aria-valuenow={now}
        className={styles.track}
      >
        <div className={styles.indicator} style={{ width: `${(now / top) * 100}%` }} />
      </div>
    </div>
  )
}
