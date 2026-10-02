import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { defineConfig } from "vite"

import { gsScopedName } from "../css-modules.mjs"

const reviewsDir = join(dirname(fileURLToPath(import.meta.url)), "reviews")

/**
 * Persists design-review checklists to playground/reviews/{name}.json so the
 * team's decisions live in the repo, not in one browser's storage.
 *   GET /__review/button  → saved state ({} when none)
 *   PUT /__review/button  → overwrite with the request body
 */
/** @returns {import("vite").Plugin} */
function reviewStore() {
  return {
    name: "gs-review-store",
    configureServer(server) {
      server.middlewares.use("/__review/", async (req, res) => {
        const name = (req.url ?? "").replace(/^\//, "").split("?")[0]
        if (!/^[a-z][a-z0-9-]*$/.test(name)) {
          res.statusCode = 400
          return res.end("invalid review name")
        }
        const file = join(reviewsDir, `${name}.json`)
        res.setHeader("Content-Type", "application/json")

        if (req.method === "GET") {
          const body = await readFile(file, "utf8").catch(() => "{}")
          return res.end(body)
        }
        if (req.method === "PUT") {
          let body = ""
          for await (const chunk of req) body += chunk
          try {
            const data = JSON.parse(body)
            await mkdir(reviewsDir, { recursive: true })
            await writeFile(file, JSON.stringify(data, null, 2) + "\n")
            return res.end('{"ok":true}')
          } catch {
            res.statusCode = 400
            return res.end('{"ok":false}')
          }
        }
        res.statusCode = 405
        res.end()
      })
    },
  }
}

export default defineConfig({
  // Relative asset URLs, so the static build works under any path (e.g. GitHub Pages /gbds_kimee/).
  base: "./",
  build: { outDir: "dist", emptyOutDir: true },
  plugins: [reviewStore()],
  css: {
    modules: { generateScopedName: gsScopedName },
  },
})
