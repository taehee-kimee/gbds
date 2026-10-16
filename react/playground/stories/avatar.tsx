import { Avatar } from "../../src"
import sample from "../assets/avatar-sample.jpg"
import type { Story } from "../controls/PropsPanel"

/** Figma component set Avatar (3073:4051) — properties in Figma's own order. */
export const avatarStory: Story = {
  figma: "Figma · Avatar (3073:4051)",
  events: ["onClick"],
  controls: [
    { kind: "VARIANT", name: "Type", options: ["Initial", "Icon", "Image"], default: "Image", description: "Image → src · Initial → alt의 첫 글자 · Icon → alt가 빈 문자열" },
    { kind: "VARIANT", name: "Style", options: ["rectangle", "circle", "rounded"], default: "rounded", description: "→ shape" },

    { source: "code", kind: "TEXT", name: "alt", default: "Sam Lee", type: "string", description: "이름. 접근성 이름이자 Initial 글자(첫 글자, 대문자)의 출처" },
    { source: "code", kind: "BOOLEAN", name: "onClick", default: false, type: "handler", description: "켜면 <button>으로 렌더 — 클릭·포커스 가능, alt가 버튼 이름" },
  ],
  render: (v, { actions }) => {
    const type = v["Type"]
    const shape = v["Style"] as "rectangle" | "circle" | "rounded"
    return (
      <Avatar
        src={type === "Image" ? sample : undefined}
        alt={type === "Icon" ? "" : String(v["alt"])}
        shape={shape === "rounded" ? undefined : shape}
        {...(v["onClick"] ? { onClick: actions.onClick } : {})}
      />
    )
  },
  note: (v) =>
    v["Type"] === "Icon"
      ? "Icon은 이름이 없을 때(alt=\"\")의 모양 — 스크린 리더에서도 숨겨짐."
      : v["Type"] === "Image"
      ? "Type은 prop이 아니라 내용에서 정해짐 — src가 로드되면 Image, 로딩 중이거나 실패하면 alt의 첫 글자, alt가 비어 있으면 아이콘."
      : undefined,
}
