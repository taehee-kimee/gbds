import { useEffect, useState } from "react"

import { PropsPanel } from "../controls/PropsPanel"
import { IconsPage } from "../icons/IconsPage"
import { components, pages, type ComponentEntry, type PageId } from "../registry"
import { Review, bucketOf } from "../review/Review"
import { useReview } from "../review/store"
import { ThemeModeContext, type ThemeMode } from "./theme"
import "./shell.css"

/* ── Routing: #/{component}/{page} · #/icons ───────────────────────────── */

type Route = { entry: ComponentEntry; page: PageId } | { entry: null; page: "icons" }

function parseHash(): Route {
  const [id, page] = location.hash.replace(/^#\/?/, "").split("/")
  if (id === "icons") return { entry: null, page: "icons" }
  const entry = components.find((c) => c.id === id) ?? components[0]!
  return { entry, page: pages.some((p) => p.id === page) ? (page as PageId) : "playground" }
}

const href = (id: string, page: PageId) => `#/${id}/${page}`

function useRoute() {
  const [route, setRoute] = useState(parseHash)
  useEffect(() => {
    const onHash = () => setRoute(parseHash())
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])
  return route
}

/* ── Shell ─────────────────────────────────────────────────────────────── */

export function Shell() {
  const { entry, page } = useRoute()
  const [mode, setMode] = useState<ThemeMode>("both")
  const pageLabel = entry ? pages.find((p) => p.id === page)!.label : "Icons"

  return (
    <ThemeModeContext.Provider value={mode}>
      <div className="sb">
        <Sidebar current={entry} page={page} />

        <div className="sb-main">
          <header className="sb-toolbar">
            <span className="sb-crumb">
              {entry ? entry.name : "Foundations"} <span aria-hidden="true">/</span> <strong>{pageLabel}</strong>
            </span>
            {page !== "review" && (
              <div className="sb-themes" role="radiogroup" aria-label="테마">
                {(["both", "light", "dark"] as const).map((m) => (
                  <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => setMode(m)}>
                    {m === "both" ? "Light + Dark" : m === "light" ? "Light" : "Dark"}
                  </button>
                ))}
              </div>
            )}
          </header>

          <main className="sb-canvas" data-page={page}>
            {entry === null ? (
              <IconsPage />
            ) : (
              <>
                {page === "playground" && <PropsPanel key={entry.id} story={entry.story} />}
                {page === "variants" && <entry.Variants />}
                {page === "review" && (
                  <Review key={entry.id} name={entry.id} title={entry.name} source={entry.review.source} items={entry.review.items} />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </ThemeModeContext.Provider>
  )
}

/* ── Sidebar ───────────────────────────────────────────────────────────── */

function Sidebar({ current, page }: { current: ComponentEntry | null; page: PageId | "icons" }) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState<Set<string>>(() => new Set(current ? [current.id] : []))
  useEffect(() => {
    if (current) setOpen((s) => new Set(s).add(current.id))
  }, [current])

  const toggle = (id: string) =>
    setOpen((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  const shown = components.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <nav className="sb-side" aria-label="컴포넌트">
      <div className="sb-brand">
        GB <span>Design System</span>
      </div>
      <input
        className="sb-search"
        type="search"
        placeholder="컴포넌트 찾기"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <p className="sb-group">Foundations</p>
      <ul className="sb-tree">
        <li>
          <a className="sb-leaf sb-top" href="#/icons" aria-current={page === "icons" ? "page" : undefined}>
            Icons
          </a>
        </li>
      </ul>

      <p className="sb-group">Components</p>
      <ul className="sb-tree">
        {shown.map((c) => {
          const expanded = open.has(c.id) || query !== ""
          return (
            <li key={c.id}>
              <button
                type="button"
                className="sb-node"
                aria-expanded={expanded}
                data-active={c.id === current?.id || undefined}
                onClick={() => toggle(c.id)}
              >
                <span className="sb-caret" aria-hidden="true" />
                {c.name}
                <TodoBadge entry={c} />
              </button>
              {expanded && (
                <ul>
                  {pages.map((p) => (
                    <li key={p.id}>
                      <a
                        className="sb-leaf"
                        href={href(c.id, p.id)}
                        aria-current={c.id === current?.id && p.id === page ? "page" : undefined}
                      >
                        {p.label}
                        {p.id === "review" && <ReviewCounts entry={c} />}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
        {shown.length === 0 && <li className="sb-none">결과 없음</li>}
      </ul>
    </nav>
  )
}

function useBuckets(entry: ComponentEntry) {
  const { state } = useReview(entry.id)
  const counts = { todo: 0, decided: 0, info: 0, reviewed: 0 }
  for (const item of entry.review.items) {
    counts[bucketOf(item, state.items?.[item.id])]++
    if (state.items?.[item.id]?.reviewed) counts.reviewed++
  }
  return counts
}

/** Open decisions, shown on the collapsed component row. */
function TodoBadge({ entry }: { entry: ComponentEntry }) {
  const { todo } = useBuckets(entry)
  return todo > 0 ? <span className="sb-badge" title={`결정 필요 ${todo}`}>{todo}</span> : null
}

function ReviewCounts({ entry }: { entry: ComponentEntry }) {
  const c = useBuckets(entry)
  return (
    <span className="sb-counts" title={`결정 필요 ${c.todo} · 결정됨 ${c.decided} · 확인 ${c.info} · 리뷰 완료 ${c.reviewed}/${entry.review.items.length}`}>
      {c.todo > 0 && <span className="sb-badge">{c.todo}</span>}
      {c.reviewed}/{entry.review.items.length}
    </span>
  )
}
