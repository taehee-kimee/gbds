import * as lucide from "lucide-react"
import { useDeferredValue, useMemo, useState, type ComponentType, type ReactNode, type SVGProps } from "react"

import { useThemes } from "../shell/theme"
import { customIconSvg, figmaIconIssues, figmaIconNames, figmaIconSets, figmaStroke2 } from "./figma-icons"
import "./icons.css"

type Icon = ComponentType<SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }>

const all = lucide.icons as unknown as Record<string, Icon>
const namespace = lucide as unknown as Record<string, Icon | undefined>

/** "lucide/calendar check" → "CalendarCheck" */
const toPascal = (figma: string) =>
  figma
    .replace(/^lucide\//, "")
    .trim()
    .split(/[\s-]+/)
    .map((w) => w[0]!.toUpperCase() + w.slice(1))
    .join("")

/** lucide keeps old names as aliases (Home → House). Find the canonical export for an alias. */
function canonicalName(component: Icon) {
  return Object.keys(all).find((k) => all[k] === component)
}

type GsIcon = {
  figma: string
  /** Figma stroke weight (lucide-matched icons only). */
  stroke?: 1 | 2
  /** lucide-react export used in code, or null when the icon only exists in Figma. */
  code: string | null
  alias?: string
  svg?: string
  brand?: boolean
}

function buildGsIcons(): { group: string; icons: GsIcon[] }[] {
  const single: GsIcon[] = []
  const sets: { group: string; icons: GsIcon[] }[] = []
  for (const name of figmaIconNames) {
    const variants = figmaIconSets[name]
    if (variants) {
      sets.push({
        group: `${name} (세트)`,
        icons: variants.map((v) => ({ figma: `${name} / ${v}`, code: null, svg: customIconSvg[`${name} / ${v}`] })),
      })
      continue
    }
    const pascal = toPascal(name)
    const component = namespace[pascal]
    if (component) {
      const canonical = canonicalName(component)
      single.push({
        figma: name,
        code: canonical ?? pascal,
        alias: canonical && canonical !== pascal ? pascal : undefined,
        stroke: figmaStroke2.has(name) ? 2 : 1,
      })
    } else {
      const svg = customIconSvg[name]
      // Brand logos keep their own colors (a hex fill or gradient); the rest follow currentColor.
      single.push({ figma: name, code: null, svg, brand: /#[0-9A-F]{6}|url\(#/i.test(svg ?? "") })
    }
  }
  return [{ group: "아이콘", icons: single }, ...sets]
}

/* ── Page ──────────────────────────────────────────────────────────────── */

export function IconsPage() {
  const [tab, setTab] = useState<"gs" | "all">("gs")
  const [query, setQuery] = useState("")
  const [size, setSize] = useState(24)
  const [weight, setWeight] = useState<"figma" | "1" | "2">("figma")
  const [copied, setCopied] = useState("")
  const q = useDeferredValue(query.trim().toLowerCase())

  const gs = useMemo(buildGsIcons, [])
  const gsCount = gs.reduce((n, g) => n + g.icons.length, 0)
  const lucideCount = Object.keys(all).length

  const copy = (text: string) =>
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text)
      setTimeout(() => setCopied(""), 1200)
    })

  return (
    <div className="ic">
      <header className="ic-head">
        <h1>Icons</h1>
        <p>
          Figma <code>📐 Lucide Icons</code> 페이지(135:2)의 GS 세트와 lucide-react 전체 목록. 기본 굵기는 Figma 값(대부분 stroke 1). 아이콘을 누르면 코드가 복사됩니다.
        </p>
      </header>

      <div className="ic-bar">
        <div className="ic-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "gs"} onClick={() => setTab("gs")}>
            GS 세트 <span>{gsCount}</span>
          </button>
          <button type="button" role="tab" aria-selected={tab === "all"} onClick={() => setTab("all")}>
            lucide 전체 <span>{lucideCount.toLocaleString()}</span>
          </button>
        </div>
        <input
          className="ic-search"
          type="search"
          placeholder="이름으로 찾기 (예: arrow, check)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <label className="ic-size">
          크기
          <select value={size} onChange={(e) => setSize(Number(e.target.value))}>
            {[16, 20, 24, 32].map((s) => (
              <option key={s} value={s}>
                {s}px
              </option>
            ))}
          </select>
        </label>
        <label className="ic-size">
          굵기
          <select value={weight} onChange={(e) => setWeight(e.target.value as typeof weight)}>
            <option value="figma">Figma 값</option>
            <option value="1">1</option>
            <option value="2">2 (lucide 기본)</option>
          </select>
        </label>
        {copied && <span className="ic-copied">복사됨: {copied}</span>}
      </div>

      {tab === "gs" ? <GsSet groups={gs} q={q} size={size} weight={weight} copy={copy} /> : <AllLucide q={q} size={size} weight={weight === "figma" ? 1 : Number(weight)} copy={copy} />}
    </div>
  )
}

/* ── GS set (Figma) ────────────────────────────────────────────────────── */

function GsSet({
  groups,
  q,
  size,
  weight,
  copy,
}: {
  groups: { group: string; icons: GsIcon[] }[]
  q: string
  size: number
  weight: "figma" | "1" | "2"
  copy: (s: string) => void
}) {
  const lucideCount = groups[0]!.icons.filter((i) => i.code).length
  const customCount = groups.reduce((n, g) => n + g.icons.filter((i) => !i.code).length, 0)

  return (
    <>
      <aside className="ic-notes">
        <strong>Figma 확인 사항</strong>
        <ul>
          <li>
            lucide-react와 이름이 일치 <b>{lucideCount}</b>개 → 코드에서 <code>lucide-react</code>로 사용. 커스텀(lucide에 없음){" "}
            <b>{customCount}</b>개 → Figma에서 SVG로 내보낸 모양을 표시 (아직 <code>@gs/react</code>에 컴포넌트로 들어가지 않음).
          </li>
          {figmaIconIssues.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </aside>

      {groups.map(({ group, icons }) => {
        const shown = icons.filter((i) => !q || i.figma.toLowerCase().includes(q) || i.code?.toLowerCase().includes(q))
        if (shown.length === 0) return null
        return (
          <section key={group}>
            <h2 className="ic-group">
              {group} <span>{shown.length}</span>
            </h2>
            <div className="ic-grid">
              {shown.map((icon) => {
                const strokeWidth = weight === "figma" ? (icon.stroke ?? 1) : Number(weight)
                const snippet = icon.code ? (strokeWidth === 2 ? `<${icon.code} />` : `<${icon.code} strokeWidth={${strokeWidth}} />`) : icon.figma
                const Component = icon.code ? all[icon.code] : undefined
                return (
                  <button key={icon.figma} type="button" className="ic-card" title={`${snippet} 복사`} onClick={() => copy(snippet)}>
                    <Preview size={size}>
                      {Component ? (
                        <Component size={size} strokeWidth={strokeWidth} />
                      ) : icon.svg ? (
                        <span className="ic-raw" style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: icon.svg }} />
                      ) : null}
                    </Preview>
                    <span className="ic-name">{icon.figma.replace(/^lucide\//, "")}</span>
                    {icon.code ? (
                      <code className="ic-code">
                        {icon.code}
                        {icon.alias && <small> ← {icon.alias}</small>}
                        {icon.stroke === 2 && <small> · stroke 2</small>}
                      </code>
                    ) : (
                      <span className="ic-tag" data-kind={icon.brand ? "brand" : "custom"}>
                        {icon.brand ? "브랜드 · 커스텀" : "커스텀"}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}
    </>
  )
}

/* ── All lucide ────────────────────────────────────────────────────────── */

const allNames = Object.keys(all)
const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z0-9])/g, "$1-$2").toLowerCase()

function AllLucide({ q, size, weight, copy }: { q: string; size: number; weight: number; copy: (s: string) => void }) {
  const shown = useMemo(() => (q ? allNames.filter((n) => n.toLowerCase().includes(q.replace(/[\s-]/g, "")) || kebab(n).includes(q)) : allNames), [q])
  return (
    <section>
      <h2 className="ic-group">
        lucide-react <span>{shown.length.toLocaleString()}</span>
      </h2>
      <div className="ic-grid ic-grid-dense">
        {shown.map((name) => {
          const Component = all[name]!
          return (
            <button key={name} type="button" className="ic-card" title={`<${name} /> 복사`} onClick={() => copy(weight === 2 ? `<${name} />` : `<${name} strokeWidth={${weight}} />`)}>
              <Preview size={size}>
                <Component size={size} strokeWidth={weight} />
              </Preview>
              <span className="ic-name">{kebab(name)}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

/** The icon once per selected theme, so currentColor can be checked in both. */
function Preview({ size, children }: { size: number; children: ReactNode }) {
  const themes = useThemes()
  return (
    <span className="ic-preview" style={{ minHeight: size + 24 }}>
      {themes.map((t) => (
        <span key={t} data-theme={t} className="ic-cell">
          {children}
        </span>
      ))}
    </span>
  )
}
