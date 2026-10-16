import type { ComponentPropsWithRef } from "react"

import styles from "./ScrollArea.module.css"

export type ScrollAreaProps = ComponentPropsWithRef<"div"> & {
  /** Figma `Type` — scrollbar width: thick 10px, thin 5px. */
  type?: "thick" | "thin"
  /** Which way it scrolls. Default "vertical". */
  orientation?: "vertical" | "horizontal" | "both"
}

/**
 * A scrolling container whose scrollbar looks like the Figma `Scroll bar`. Only the look changes —
 * scrolling (wheel, touch, keyboard, dragging the bar) is the browser's own. Give it a height (or width).
 * Focusable when it has no focusable content of its own, so keyboard users can scroll it.
 */
export function ScrollArea(props: ScrollAreaProps) {
  const { type = "thick", orientation = "vertical", className, tabIndex = 0, ...rest } = props
  return (
    <div
      tabIndex={tabIndex}
      {...rest}
      data-scrollbar={type}
      data-orientation={orientation}
      className={className ? `${styles.root} ${className}` : styles.root}
    />
  )
}
