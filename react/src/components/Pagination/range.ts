export type PageItem = number | "start-ellipsis" | "end-ellipsis"

/**
 * The page items to show between previous and next — exactly `maxItems` of them (ellipses count)
 * once there are more pages than that, so the control keeps its width while paging.
 * The first and last pages always show; the rest of the slots go to a window around the current page.
 * An ellipsis that would hide a single page shows that page instead. `maxItems` is at least 5 (1 … n … last).
 */
export function pageItems(page: number, total: number, maxItems = 7): PageItem[] {
  const range = (from: number, to: number) => Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i)
  const slots = Math.max(5, Math.floor(maxItems))
  if (total <= slots) return range(1, total)

  // Middle window = slots minus first, last and two ellipses. With an even window the extra page goes after the current one.
  const inner = slots - 4
  const start = page - Math.floor((inner - 1) / 2)
  const end = start + inner - 1

  if (start <= 3) return [...range(1, slots - 2), "end-ellipsis", total]
  if (end >= total - 2) return [1, "start-ellipsis", ...range(total - slots + 3, total)]
  return [1, "start-ellipsis", ...range(start, end), "end-ellipsis", total]
}
