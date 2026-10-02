import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"

import { useReview, type ItemState, type SaveStatus as Status } from "./store"

import "./review.css"

/* ── Data shape ────────────────────────────────────────────────────────── */

export type ReviewOption = { id: string; label: string; recommended?: boolean }

export type ReviewColumn = { label: string; render: () => ReactNode }

export type ReviewItem = {
  /** Matches the Review Notes number in {Component}.md. */
  id: string
  title: string
  /** open = needs a team decision · decided = already settled · info = check it matches */
  status: "open" | "decided" | "info"
  figma: string
  code: string
  columns: ReviewColumn[]
  /** Put columns on top of each other — for wide specimens. */
  stacked?: boolean
  /** Only for open items: the choices the team picks from. */
  options?: ReviewOption[]
}

/* ── Helpers used by item definitions ──────────────────────────────────── */

/** Override a component's custom properties inline — used to freeze a state (e.g. hover) for comparison. */
export function vars(map: Record<string, string>): CSSProperties {
  return Object.fromEntries(Object.entries(map).map(([k, v]) => [`--${k}`, v])) as CSSProperties
}

/** One labelled specimen inside a column. */
export function Spec({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rv-spec">
      <div className="rv-spec-body">{children}</div>
      <span className="rv-spec-label">{label}</span>
    </div>
  )
}

/** Shows the rendered width of its child, for size comparisons. */
export function Measure({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [size, setSize] = useState("")
  useLayoutEffect(() => {
    const el = ref.current?.firstElementChild
    if (!el) return
    const update = () => {
      const r = el.getBoundingClientRect()
      setSize(`${r.width.toFixed(2)} × ${r.height.toFixed(0)}`)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    document.fonts?.ready.then(update)
    return () => ro.disconnect()
  }, [])
  return (
    <span className="rv-measure">
      <span ref={ref}>{children}</span>
      <code>{size}</code>
    </span>
  )
}

/* ── Status buckets ───────────────────────────────────────────────────── */

/** Where an item sits now: an open item becomes decided once the team picks an option. */
export type Bucket = "todo" | "decided" | "info"

export function bucketOf(item: ReviewItem, s: ItemState | undefined): Bucket {
  if (item.status === "info") return "info"
  return item.status === "decided" || s?.choice ? "decided" : "todo"
}

const bucketLabel: Record<Bucket, string> = { todo: "결정 필요", decided: "결정됨", info: "확인" }

/* ── Page ──────────────────────────────────────────────────────────────── */

export function Review({
  name,
  title,
  source,
  items,
}: {
  name: string
  title: string
  /** Where the notes come from, e.g. the spec file path. */
  source: string
  items: ReviewItem[]
}) {
  const { state, status, update } = useReview(name)
  const [filter, setFilter] = useState<Bucket | "all">("all")
  const [hideReviewed, setHideReviewed] = useState(false)
  const [copied, setCopied] = useState(false)
  const get = (id: string): ItemState => state.items?.[id] ?? {}
  const set = (id: string, patch: ItemState) =>
    update((s) => ({ ...s, items: { ...s.items, [id]: { ...s.items?.[id], ...patch } } }))

  const open = items.filter((i) => i.status === "open")
  const decidedCount = open.filter((i) => get(i.id).choice).length
  const reviewedCount = items.filter((i) => get(i.id).reviewed).length
  const bucket = (i: ReviewItem) => bucketOf(i, get(i.id))
  const counts = { all: items.length, todo: 0, decided: 0, info: 0 }
  for (const i of items) counts[bucket(i)]++
  const visible = items.filter((i) => (filter === "all" || bucket(i) === filter) && !(hideReviewed && get(i.id).reviewed))

  const copyMarkdown = () => {
    const lines = [
      `## ${title} 디자인 리뷰`,
      `리뷰어: ${state.reviewer || "-"} · ${new Date().toLocaleDateString("ko-KR")}`,
      "",
      ...items.map((i) => {
        const s = get(i.id)
        const choice = i.options?.find((o) => o.id === s.choice)?.label
        return [
          `- [${s.reviewed ? "x" : " "}] **${i.id}. ${i.title}** (${bucketLabel[bucket(i)]})`,
          choice && `  - 결정: ${choice}`,
          s.note && `  - 메모: ${s.note.replace(/\n/g, " ")}`,
        ]
          .filter(Boolean)
          .join("\n")
      }),
    ]
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="rv">
      <header className="rv-head">
        <div>
          <h1>{title} · Review notes</h1>
          <p className="rv-source">
            출처 <code>{source}</code> · Review Notes
          </p>
        </div>
        <div className="rv-summary">
          <Progress label="결정" value={decidedCount} total={open.length} />
          <Progress label="확인 완료" value={reviewedCount} total={items.length} />
        </div>
        <div className="rv-toolbar">
          <label className="rv-reviewer">
            리뷰어
            <input
              value={state.reviewer ?? ""}
              placeholder="이름"
              onChange={(e) => update((s) => ({ ...s, reviewer: e.target.value }))}
            />
          </label>
          <button type="button" className="rv-copy" onClick={copyMarkdown}>
            {copied ? "복사됨" : "결과 Markdown 복사"}
          </button>
          <SaveStatus status={status} name={name} at={state.updatedAt} />
        </div>
      </header>

      <div className="rv-filter" role="toolbar" aria-label="상태 필터">
        {(["all", "todo", "decided", "info"] as const).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            data-bucket={key}
            onClick={() => setFilter(key)}
          >
            {key === "all" ? "전체" : bucketLabel[key]}
            <span className="rv-count">{counts[key]}</span>
          </button>
        ))}
        <label className="rv-check rv-hide">
          <input type="checkbox" checked={hideReviewed} onChange={(e) => setHideReviewed(e.target.checked)} />
          리뷰 완료 숨기기
        </label>
      </div>

      {visible.length === 0 && <p className="rv-empty">이 상태의 항목이 없습니다.</p>}

      {visible.map((item) => {
        const s = get(item.id)
        const b = bucket(item)
        return (
          <article key={item.id} className="rv-item" data-bucket={b} data-reviewed={s.reviewed || undefined}>
            <header className="rv-item-head">
              <span className="rv-num">{item.id}</span>
              <h2>{item.title}</h2>
              {s.reviewed && <span className="rv-badge" data-bucket="reviewed">리뷰 완료</span>}
              <span className="rv-badge" data-bucket={b}>
                {bucketLabel[b]}
              </span>
            </header>

            <dl className="rv-facts">
              <dt>Figma</dt>
              <dd>{item.figma}</dd>
              <dt>코드</dt>
              <dd>{item.code}</dd>
            </dl>

            {item.columns.length > 0 && <div className="rv-columns" style={{ "--rv-cols": item.stacked ? 1 : item.columns.length } as CSSProperties}>
              {item.columns.map((col) => (
                <section key={col.label} className="rv-col">
                  <h3>{col.label}</h3>
                  {(["light", "dark"] as const).map((theme) => (
                    <div key={theme} className="rv-stage" data-theme={theme}>
                      <span className="rv-theme">{theme}</span>
                      <div className="rv-stage-body">{col.render()}</div>
                    </div>
                  ))}
                </section>
              ))}
            </div>}

            <footer className="rv-decide">
              {item.options && (
                <fieldset className="rv-options">
                  <legend>결정</legend>
                  {item.options.map((o) => (
                    <label key={o.id} className="rv-check">
                      <input
                        type="checkbox"
                        checked={s.choice === o.id}
                        onChange={(e) => set(item.id, { choice: e.target.checked ? o.id : undefined })}
                      />
                      {o.label}
                      {o.recommended && <span className="rv-rec">추천</span>}
                    </label>
                  ))}
                </fieldset>
              )}
              <textarea
                className="rv-note"
                rows={2}
                placeholder="메모 (근거, 담당자, 후속 작업…)"
                value={s.note ?? ""}
                onChange={(e) => set(item.id, { note: e.target.value })}
              />
              <label className="rv-check rv-done">
                <input
                  type="checkbox"
                  checked={!!s.reviewed}
                  onChange={(e) => set(item.id, { reviewed: e.target.checked })}
                />
                리뷰 완료
              </label>
            </footer>
          </article>
        )
      })}
    </div>
  )
}

function Progress({ label, value, total }: { label: string; value: number; total: number }) {
  return (
    <div className="rv-progress">
      <span>
        {label} <strong>{value}</strong> / {total}
      </span>
      <progress value={value} max={total} />
    </div>
  )
}

function SaveStatus({ status, name, at }: { status: Status; name: string; at?: string }) {
  const text = {
    loading: "불러오는 중…",
    dirty: "저장 중…",
    saved: at ? `저장됨 ${new Date(at).toLocaleTimeString("ko-KR")}` : "저장된 내용 없음",
    error: "저장 불가 — npm run dev 로 연 playground에서만 저장됩니다",
    readonly: "읽기 전용 (배포본) — 레포에 커밋된 결정을 보여줍니다. 저장하려면 로컬에서 npm run dev",
  }[status]
  return (
    <span className="rv-save" data-status={status} title={`playground/reviews/${name}.json`}>
      {text}
    </span>
  )
}
