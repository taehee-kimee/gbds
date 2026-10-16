import { useLayoutEffect, type RefObject } from "react"

/** Where the panel opens relative to its trigger. */
export type PopupPlacement = "bottom-start" | "right-start" | "left-start"

/**
 * Positions a `popover` panel (top layer, position: fixed) next to its trigger while open, and keeps it
 * there on scroll and resize. Flips to the other side when it does not fit, and stays inside the viewport.
 * The gap comes from the panel's `--popup-offset` and, for side placements, the vertical shift from
 * `--popup-shift` — both set in CSS from space tokens.
 * Also writes the trigger width to `--popup-anchor-width` so CSS can size the panel from it.
 */
export function usePopupPosition(
  anchor: RefObject<HTMLElement | null>,
  panel: RefObject<HTMLElement | null>,
  open: boolean,
  placement: PopupPlacement
) {
  useLayoutEffect(() => {
    if (!open) return
    const update = () => {
      const a = anchor.current?.getBoundingClientRect()
      const p = panel.current
      if (!a || !p) return
      const style = getComputedStyle(p)
      const offset = parseFloat(style.getPropertyValue("--popup-offset")) || 0
      const shift = parseFloat(style.getPropertyValue("--popup-shift")) || 0
      const margin = parseFloat(style.getPropertyValue("--popup-margin")) || 0
      p.style.setProperty("--popup-anchor-width", `${a.width}px`)
      const w = p.offsetWidth
      const h = p.offsetHeight
      const vw = document.documentElement.clientWidth
      const vh = document.documentElement.clientHeight

      let top: number
      let left: number
      if (placement === "bottom-start") {
        left = a.left
        top = a.bottom + offset
        // Not enough room below but enough above → open upwards.
        if (top + h > vh - margin && a.top - offset - h >= margin) top = a.top - offset - h
      } else {
        top = a.top - shift
        const right = a.right + offset
        const leftSide = a.left - offset - w
        if (placement === "right-start") left = right + w > vw - margin && leftSide >= margin ? leftSide : right
        else left = leftSide < margin && right + w <= vw - margin ? right : leftSide
      }
      left = Math.min(Math.max(margin, left), Math.max(margin, vw - margin - w))
      top = Math.min(Math.max(margin, top), Math.max(margin, vh - margin - h))
      p.style.top = `${top}px`
      p.style.left = `${left}px`
    }
    update()
    window.addEventListener("scroll", update, true)
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update, true)
      window.removeEventListener("resize", update)
    }
  }, [anchor, panel, open, placement])
}
