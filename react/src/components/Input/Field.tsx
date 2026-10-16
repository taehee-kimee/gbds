import { Children, createContext, useContext, useId, type ComponentPropsWithRef, type ReactNode } from "react"

import styles from "./Input.module.css"

type FieldContextValue = {
  /** Set when the field holds exactly one control — the label points at it with htmlFor. */
  inputId?: string
  /** Description and error ids for aria-describedby. */
  describedBy?: string
  invalid?: boolean
}

export const FieldContext = createContext<FieldContextValue>({})

/** Read by Input: its id, aria-describedby and invalid state come from the surrounding Field. */
export function useField() {
  return useContext(FieldContext)
}

export type FieldProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  /** Figma `-> Title` — the label above the input(s). */
  label: ReactNode
  /** Figma `Description` + `-> Description` — help text below. */
  description?: ReactNode
  /**
   * Error message (Figma: the red line in Input time Status=error). Marks the inputs invalid
   * (Status=error) and replaces the description while shown.
   */
  error?: ReactNode
  /** One Input (the label is its <label>), or several related ones (the label names the group). */
  children: ReactNode
}

export function Field(props: FieldProps) {
  const { label, description, error, children, className, ...rest } = props
  const id = useId()
  const single = Children.count(children) === 1
  const inputId = `${id}-input`
  const labelId = `${id}-label`
  const helpId = `${id}-help`
  const message = error ?? description

  return (
    <FieldContext value={{ inputId: single ? inputId : undefined, describedBy: message != null ? helpId : undefined, invalid: error != null }}>
      <div
        {...rest}
        role={single ? undefined : "group"}
        aria-labelledby={single ? undefined : labelId}
        className={className ? `${styles.field} ${className}` : styles.field}
      >
        {single ? (
          <label id={labelId} htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        ) : (
          <span id={labelId} className={styles.label}>
            {label}
          </span>
        )}
        {children}
        {message != null && (
          <p id={helpId} className={error != null ? styles.error : styles.description}>
            {message}
          </p>
        )}
      </div>
    </FieldContext>
  )
}
