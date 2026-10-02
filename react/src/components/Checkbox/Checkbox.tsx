import { useCallback, useEffect, useRef, type ComponentPropsWithRef, type ReactNode, type Ref } from "react"

import styles from "./Checkbox.module.css"

type NativeInputProps = Omit<ComponentPropsWithRef<"input">, "type" | "children">

type CommonProps = NativeInputProps & {
  /** Figma `Style`. `muted` only changes the unchecked look and the label color. */
  variant?: "default" | "muted"
  /** Figma `Type=Part` — the "some selected" dash. Sets the DOM `indeterminate` property; overrides `checked` visually. */
  indeterminate?: boolean
}

/** Figma `Label=true` — the label text after the box. */
export type LabelledCheckboxProps = CommonProps & {
  children: ReactNode
}

/** Figma `Label=false` — a bare box. */
export type BareCheckboxProps = CommonProps & {
  children?: undefined
  /** Required: with no visible label, screen readers have nothing to announce. */
  "aria-label": string
}

export type CheckboxProps = LabelledCheckboxProps | BareCheckboxProps

export function Checkbox(props: CheckboxProps) {
  const { variant = "default", indeterminate = false, className, style, children, ref, ...rest } = props

  const inputRef = useRef<HTMLInputElement>(null)
  // `indeterminate` exists only as a DOM property, never as an HTML attribute. A click clears it
  // natively, so re-apply after every render rather than only when the prop changes.
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  })

  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      assignRef(ref, node)
    },
    [ref]
  )

  return (
    <label
      data-variant={variant}
      className={className ? `${styles.root} ${className}` : styles.root}
      style={style}
    >
      <span className={styles.control}>
        <input
          {...rest}
          ref={setRefs}
          type="checkbox"
          className={styles.input}
        />
        {/* lucide/check and lucide/minus (ISC), inlined so the package needs no icon dependency. */}
        <svg className={styles.check} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
        <svg className={styles.dash} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14" />
        </svg>
      </span>
      {children != null && <span className={styles.label}>{children}</span>}
    </label>
  )
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value)
  else if (ref) ref.current = value
}
