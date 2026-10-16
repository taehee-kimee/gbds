import { Pagination } from "../../src"
import type { Story } from "../controls/PropsPanel"

/** Figma component set Pagination (3331:2811) — properties in Figma's own order. */
export const paginationStory: Story = {
  figma: "Figma · Pagination (3331:2811) · Part/pagination (3641:9731)",
  events: ["onPageChange"],
  controls: [
    { kind: "VARIANT", name: "Type", options: ["number", "dot"], default: "number", description: "→ variant. number = ‹ 1 2 3 … › · dot = 페이지마다 점 하나" },
    { kind: "VARIANT", name: "Direction", options: ["Horizontal", "Vertical"], default: "Horizontal", description: "→ orientation (vertical이면 chevron up/down · 세로 ellipsis)" },

    { source: "code", kind: "TEXT", name: "totalPages", default: "10", type: "number", inputType: "number", min: 1, description: "페이지 수. number는 maxItems보다 많으면 … 로 줄임" },
    { source: "code", kind: "TEXT", name: "page", default: "1", type: "number", inputType: "number", min: 1, description: "현재 페이지 (1부터). 페이지를 누르면 바뀜" },
    { source: "code", kind: "TEXT", name: "maxItems", default: "7", type: "number", inputType: "number", min: 5, description: "number — 이전 · 다음 사이에 들어갈 칸 수 (… 포함, 최소 5). 페이지가 더 많으면 처음 · 끝은 남기고 현재 주변만 보여 줌 — 칸 수가 고정이라 넘겨도 넓이가 그대로", visibleWhen: (v) => v["Type"] === "number" },
  ],
  render: (v, { on, set }) => {
    const num = (name: string, fallback: number) => {
      const n = Number(v[name])
      return Number.isFinite(n) ? n : fallback
    }
    const max = num("maxItems", 7)
    return (
      <Pagination
        totalPages={num("totalPages", 10)}
        page={num("page", 1)}
        onPageChange={on("onPageChange", (p) => set("page", String(p)))}
        variant={v["Type"] === "dot" ? "dot" : undefined}
        orientation={v["Direction"] === "Vertical" ? "vertical" : undefined}
        maxItems={v["Type"] === "number" && max !== 7 ? max : undefined}
      />
    )
  },
  note: (v) =>
    v["Type"] === "dot"
      ? "Figma dot의 현재 페이지(Status=active)는 icon/pressed 채움 + icon/faint 테두리 — 다른 점보다 흐려 보임 (리뷰 1)."
      : "처음 · 끝 페이지에서는 이전 · 다음이 disabled (Figma에 없음 — 리뷰 3).",
}
