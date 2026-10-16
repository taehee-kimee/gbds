import { useState } from "react"

import { Pagination } from "../../src"
import { Row, Themes } from "../shell/theme"

function Matrix({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className="grid" style={{ ["--cols" as string]: 2 }}>
      <span />
      <span className="head">Horizontal</span>
      <span className="head">Vertical</span>
      <Row label="number">
        <Pagination totalPages={3} defaultPage={1} data-testid={`${theme}-number-h`} />
        <Pagination totalPages={3} defaultPage={1} orientation="vertical" data-testid={`${theme}-number-v`} />
      </Row>
      <Row label="number · 10">
        <Pagination totalPages={10} defaultPage={5} data-testid={`${theme}-number-10`} />
        <Pagination totalPages={10} defaultPage={5} orientation="vertical" />
      </Row>
      <Row label="dot">
        <Pagination totalPages={5} defaultPage={1} variant="dot" data-testid={`${theme}-dot-h`} />
        <Pagination totalPages={5} defaultPage={1} variant="dot" orientation="vertical" data-testid={`${theme}-dot-v`} />
      </Row>
    </div>
  )
}

/** Paged list: the pagination drives which items show. */
function List() {
  const [page, setPage] = useState(1)
  const items = Array.from({ length: 47 }, (_, i) => `항목 ${i + 1}`)
  const per = 5
  const total = Math.ceil(items.length / per)
  return (
    <div style={{ display: "grid", gap: 12, justifyItems: "start" }}>
      <ol start={(page - 1) * per + 1} style={{ margin: 0, color: "var(--gb-text-default)", font: "var(--gb-typography-sm)" }}>
        {items.slice((page - 1) * per, page * per).map((t) => <li key={t}>{t}</li>)}
      </ol>
      <Pagination totalPages={total} page={page} onPageChange={setPage} />
    </div>
  )
}

export function PaginationVariants() {
  return (
    <Themes
      render={(theme) => (
        <>
          <Matrix theme={theme} />
          <h2 className="sub">목록 넘기기 (47개 · 페이지당 5개)</h2>
          <List />
        </>
      )}
    />
  )
}
