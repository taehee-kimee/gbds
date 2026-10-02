import { createContext, useContext, type ReactNode } from "react"

export type Theme = "light" | "dark"
export type ThemeMode = Theme | "both"

export const ThemeModeContext = createContext<ThemeMode>("both")

/** The themes the toolbar currently asks for, in display order. */
export function useThemes(): Theme[] {
  const mode = useContext(ThemeModeContext)
  return mode === "both" ? ["light", "dark"] : [mode]
}

/** Renders the same specimen once per selected theme, side by side. */
export function Themes({ render }: { render: (theme: Theme) => ReactNode }) {
  const themes = useThemes()
  return (
    <div className="page">
      {themes.map((theme) => (
        <section key={theme} className="panel" data-theme={theme}>
          <h2>{theme}</h2>
          {render(theme)}
        </section>
      ))}
    </div>
  )
}

export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <span className="label">{label}</span>
      {children}
    </>
  )
}
