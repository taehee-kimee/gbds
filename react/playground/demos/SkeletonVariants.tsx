import { useEffect, useState } from "react"

import { Avatar, Button, Skeleton } from "../../src"
import { Row, Themes } from "../shell/theme"

function Matrix({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className="grid" style={{ ["--cols" as string]: 3 }}>
      <span />
      <span className="head">rectangle</span>
      <span className="head">text</span>
      <span className="head">circle</span>
      <Row label="Figma">
        <Skeleton data-testid={`${theme}-rectangle`} />
        <Skeleton type="text" data-testid={`${theme}-text`} />
        <Skeleton type="circle" data-testid={`${theme}-circle`} />
      </Row>
    </div>
  )
}

/** Segments composed into the shape of the card that will load. */
function Card({ theme }: { theme: "light" | "dark" }) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => setLoading(false), 2500)
    return () => clearTimeout(t)
  }, [loading])
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
      <div aria-busy={loading} aria-live="polite" style={{ display: "grid", gap: 12, width: 226 }} data-testid={`${theme}-card`}>
        {loading ? (
          <>
            <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }}>Loading</span>
            <Skeleton />
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Skeleton type="circle" />
              <Skeleton type="text" width={140} height={16} />
            </div>
            <Skeleton type="text" height={16} />
            <Skeleton type="text" width={160} height={16} />
          </>
        ) : (
          <>
            <div style={{ height: 157, borderRadius: "var(--gb-radius-2xl)", background: "var(--gb-background-surface-secondary)" }} />
            <div style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--gb-text-default)", font: "var(--gb-typography-sm)" }}>
              <Avatar alt="Taehee" /> Taehee Kim
            </div>
            <p style={{ margin: 0, color: "var(--gb-text-subtle)", font: "var(--gb-typography-sm)" }}>Loaded content replaces the segments.</p>
          </>
        )}
      </div>
      <Button variant="outline" onClick={() => setLoading(true)}>다시 로딩</Button>
    </div>
  )
}

export function SkeletonVariants() {
  return (
    <Themes
      render={(theme) => (
        <>
          <Matrix theme={theme} />
          <h2 className="sub">조합 — 불러올 카드 모양</h2>
          <Card theme={theme} />
        </>
      )}
    />
  )
}
