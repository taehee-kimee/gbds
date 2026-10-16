import type { ComponentPropsWithRef, CSSProperties } from "react"

import styles from "./Skeleton.module.css"

export type SkeletonProps = Omit<ComponentPropsWithRef<"div">, "children"> & {
  /** Figma `Type` — the piece of content it stands in for. */
  type?: "rectangle" | "text" | "circle"
  /** Number → px. Default: Figma's 226 (circle 27). */
  width?: number | string
  /** Number → px. Default: rectangle 157, text 27, circle = width. */
  height?: number | string
}

const px = (v: number | string | undefined) => (typeof v === "number" ? `${v}px` : v)

/**
 * A placeholder shape shown while content loads, with a shimmer sweeping across (Figma Progress 0 → 33 → 66).
 * Decorative (aria-hidden): mark the loading region itself with aria-busy and say "Loading" there.
 */
export function Skeleton(props: SkeletonProps) {
  const { type = "rectangle", width, height, className, style, ...rest } = props
  const size = {
    ...(width !== undefined && { "--skeleton-width": px(width) }),
    ...(height !== undefined && { "--skeleton-height": px(height) }),
  } as CSSProperties
  return (
    <div
      aria-hidden="true"
      {...rest}
      data-type={type}
      className={className ? `${styles.root} ${className}` : styles.root}
      style={{ ...size, ...style }}
    />
  )
}
