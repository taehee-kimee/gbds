import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Ellipsis, EllipsisVertical } from "lucide-react"
import { useState, type ComponentPropsWithRef } from "react"

import { pageItems } from "./range"
import styles from "./Pagination.module.css"

export type PaginationProps = Omit<ComponentPropsWithRef<"nav">, "onChange"> & {
  /** Number of pages. */
  totalPages: number
  /** Current page (1-based), controlled. */
  page?: number
  /** Current page when uncontrolled. Default 1. */
  defaultPage?: number
  onPageChange?: (page: number) => void
  /** Figma `Type` — numbered list with previous / next, or a compact row of dots. */
  variant?: "number" | "dot"
  /** Figma `Direction`. */
  orientation?: "horizontal" | "vertical"
  /**
   * Type=number — how many items fit between previous and next, ellipses included. Default 7, minimum 5.
   * With more pages than this, the first and last pages stay and the rest collapse around the current one.
   */
  maxItems?: number
  /** Accessible names. */
  previousLabel?: string
  nextLabel?: string
  /** Name of each page button. Default (n) => `Page ${n}`. */
  pageLabel?: (page: number) => string
}

export function Pagination(props: PaginationProps) {
  const {
    totalPages,
    page: pageProp,
    defaultPage = 1,
    onPageChange,
    variant = "number",
    orientation = "horizontal",
    maxItems = 7,
    previousLabel = "Previous page",
    nextLabel = "Next page",
    pageLabel = (n) => `Page ${n}`,
    className,
    "aria-label": ariaLabel = "Pagination",
    ...rest
  } = props

  const total = Math.max(1, Math.floor(totalPages))
  const [inner, setInner] = useState(defaultPage)
  const page = Math.min(Math.max(1, pageProp ?? inner), total)

  const go = (next: number) => {
    const clamped = Math.min(Math.max(1, next), total)
    if (clamped === page) return
    if (pageProp === undefined) setInner(clamped)
    onPageChange?.(clamped)
  }

  const vertical = orientation === "vertical"
  const Prev = vertical ? ChevronUp : ChevronLeft
  const Next = vertical ? ChevronDown : ChevronRight
  const More = vertical ? EllipsisVertical : Ellipsis

  return (
    <nav
      {...rest}
      aria-label={ariaLabel}
      data-variant={variant}
      data-orientation={orientation}
      className={className ? `${styles.root} ${className}` : styles.root}
    >
      {variant === "dot" ? (
        // Figma Type=dot: one dot per page, no previous / next.
        Array.from({ length: total }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            className={styles.dot}
            aria-label={pageLabel(n)}
            aria-current={n === page ? "page" : undefined}
            onClick={() => go(n)}
          />
        ))
      ) : (
        <>
          <button type="button" className={styles.item} aria-label={previousLabel} disabled={page <= 1} onClick={() => go(page - 1)}>
            <Prev />
          </button>
          {pageItems(page, total, maxItems).map((item) =>
            typeof item === "number" ? (
              <button
                key={item}
                type="button"
                className={styles.item}
                aria-label={pageLabel(item)}
                aria-current={item === page ? "page" : undefined}
                onClick={() => go(item)}
              >
                {item}
              </button>
            ) : (
              // Skipped pages — not a control.
              <span key={item} className={styles.item} data-ellipsis="" aria-hidden="true">
                <More />
              </span>
            )
          )}
          <button type="button" className={styles.item} aria-label={nextLabel} disabled={page >= total} onClick={() => go(page + 1)}>
            <Next />
          </button>
        </>
      )}
    </nav>
  )
}
