import { basename } from "node:path"

/**
 * CSS Modules class names, matching the spec titles (`gb-button`):
 *   .root  → `gb-{component}`          e.g. `gb-button`, `gb-checkbox`
 *   .input → `gb-{component}-{local}`  e.g. `gb-checkbox-input`
 * Component names are kebab-cased (`FloatingPill` → `floating-pill`).
 * Stable across builds (no hash) so they are readable in DevTools and usable as test and override hooks.
 * Unique because each component folder holds exactly one `{Component}.module.css`.
 *
 * Every build that compiles @gb/react styles must use this — the playground now, the library build later.
 * @param {string} local   class name in the stylesheet
 * @param {string} filename absolute path of the .module.css file
 */
export function gbScopedName(local, filename) {
  const component = basename(filename.split("?")[0])
    .replace(/\.module\.css$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
  return local === "root" ? `gb-${component}` : `gb-${component}-${local}`
}
