import { useEffect, useSyncExternalStore } from "react"

/**
 * Review decisions, shared by the sidebar badges and the review pages.
 * Persisted to playground/reviews/{name}.json by the dev-server middleware in vite.config.mjs:
 *   GET /__review/button  → saved state ({} when none)
 *   PUT /__review/button  → overwrite with the request body
 *
 * The static build (GitHub Pages) has no server: it shows the committed JSON read-only,
 * and edits stay in the page until reload.
 */

export type ItemState = { choice?: string; reviewed?: boolean; note?: string }
export type SavedState = { reviewer?: string; updatedAt?: string; items?: Record<string, ItemState> }
export type SaveStatus = "loading" | "saved" | "dirty" | "error" | "readonly"

const STATIC = !import.meta.env.DEV
/** Decisions committed to the repo, bundled into the static build. */
const committed = import.meta.glob<SavedState>("../reviews/*.json", { eager: true, import: "default" })

type Entry = { state: SavedState; status: SaveStatus; timer?: ReturnType<typeof setTimeout> }

const entries = new Map<string, Entry>()
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

function load(name: string) {
  if (entries.has(name)) return
  if (STATIC) {
    entries.set(name, { state: committed[`../reviews/${name}.json`] ?? {}, status: "readonly" })
    queueMicrotask(emit)
    return
  }
  entries.set(name, { state: {}, status: "loading" })
  fetch(`/__review/${name}`)
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((state: SavedState) => entries.set(name, { state, status: "saved" }))
    .catch(() => entries.set(name, { state: {}, status: "error" }))
    .finally(emit)
}

function save(name: string) {
  const entry = entries.get(name)!
  clearTimeout(entry.timer)
  const timer = setTimeout(() => {
    fetch(`/__review/${name}`, { method: "PUT", body: JSON.stringify(entries.get(name)!.state) })
      .then((r) => r.ok)
      .catch(() => false)
      .then((ok) => {
        const e = entries.get(name)!
        if (e.timer !== timer) return // a newer edit is already queued
        entries.set(name, { ...e, status: ok ? "saved" : "error" })
        emit()
      })
  }, 400)
  entry.timer = timer
}

export function updateReview(name: string, fn: (s: SavedState) => SavedState) {
  const entry = entries.get(name) ?? { state: {}, status: "saved" as const }
  entries.set(name, { ...entry, state: { ...fn(entry.state), updatedAt: new Date().toISOString() }, status: "dirty" })
  emit()
  if (STATIC) entries.set(name, { ...entries.get(name)!, status: "readonly" })
  else save(name)
}

const empty: Entry = { state: {}, status: "loading" }

export function useReview(name: string) {
  useEffect(() => load(name), [name])
  const entry = useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => entries.get(name) ?? empty
  )
  return { state: entry.state, status: entry.status, update: (fn: (s: SavedState) => SavedState) => updateReview(name, fn) }
}
