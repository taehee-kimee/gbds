import { useState, type ComponentPropsWithRef, type CSSProperties } from "react"

import { useField } from "../Input/Field"
import styles from "./Slider.module.css"

export type SliderProps = Omit<ComponentPropsWithRef<"input">, "type" | "value" | "defaultValue" | "min" | "max" | "step" | "children"> & {
  /** Current value, controlled. */
  value?: number
  /** Value when uncontrolled. Default: min. */
  defaultValue?: number
  /** Called with the new number on every change (dragging, arrow keys, Home / End, PageUp / PageDown). */
  onValueChange?: (value: number) => void
  /** Default 0. */
  min?: number
  /** Default 100. */
  max?: number
  /** Default 1. */
  step?: number
}

/**
 * Figma `Slider` — a native <input type="range"> drawn as the Figma track, bar and button, so keyboard,
 * screen readers and forms (name / value) work as the browser does. Inside a Field, the label names it.
 */
export function Slider(props: SliderProps) {
  const field = useField()
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    id = field.inputId,
    className,
    style,
    ...rest
  } = props

  const [inner, setInner] = useState(defaultValue ?? min)
  const value = valueProp ?? inner
  const span = max - min
  const fill = span > 0 ? Math.min(Math.max((value - min) / span, 0), 1) : 0

  return (
    <input
      aria-describedby={field.describedBy}
      {...rest}
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => {
        const next = e.currentTarget.valueAsNumber
        if (valueProp === undefined) setInner(next)
        onChange?.(e)
        onValueChange?.(next)
      }}
      className={className ? `${styles.root} ${className}` : styles.root}
      style={{ "--slider-fill": fill, ...style } as CSSProperties}
    />
  )
}
