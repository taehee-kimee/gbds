import { Button, Checkbox, Dialog } from "../../src"
import type { Story } from "../controls/PropsPanel"
import { gbIconOptions } from "../icons/gb-icons"

/** Figma component set Popover (7269:451) — a centred modal, so code calls it Dialog. Properties in Figma's own order. */
export const dialogStory: Story = {
  figma: "Figma · Popover (7269:451) → Dialog",
  events: ["onOpenChange", "onConfirm", "onCancel"],
  controls: [
    { kind: "TEXT", name: "-> Title", default: "Heading to ‘Content Studio’ to create your post?", description: "제목 → title (다이얼로그 이름)" },
    { kind: "TEXT", name: "-> Description", default: "Exit this page and start creating a post in ‘Content Studio’.", description: "설명 → description" },
    { kind: "BOOLEAN", name: "Description", default: true, description: "끄면 description을 넘기지 않음" },
    { kind: "BOOLEAN", name: "Leading Icon", default: true, description: "제목 앞 아이콘 → icon (제목 색을 따름)" },
    { kind: "INSTANCE_SWAP", name: "-> Leading Icon", default: "lucide/circle-dashed", options: gbIconOptions, description: "아이콘 교체 → icon. 클릭해서 GB 아이콘 세트에서 선택" },
    { kind: "BOOLEAN", name: "Checkbox", default: false, description: "버튼 위 체크박스 → checkbox={<Checkbox variant=\"mute\">…</Checkbox>}" },
    { kind: "BOOLEAN", name: "Button", default: true, description: "Cancel + Confirm (Button group confirm). 끄면 actions={null}. 직접 만든 버튼은 actions로" },
    { kind: "VARIANT", name: "Type", options: ["notification", "warning"], default: "notification", description: "→ variant. warning = 빨간 테두리 · 제목" },

    { source: "code", kind: "BOOLEAN", name: "open", default: false, type: "boolean", description: "열림. 트리거가 없어 부모가 정함 — 미리보기의 버튼을 눌러도 켜짐. Cancel · Confirm · Esc로 닫힘" },
    { source: "code", kind: "BOOLEAN", name: "modal", default: true, type: "boolean", description: "true = 화면 가운데 + 뒤 배경 어둡게, 뒤 페이지 조작 불가 · false = 페이지 안 제자리에 표시" },
    { source: "code", kind: "TEXT", name: "confirmLabel", default: "Confirm", type: "ReactNode", description: "기본 확인 버튼 라벨", visibleWhen: (v) => v["Button"] === true },
    { source: "code", kind: "TEXT", name: "cancelLabel", default: "Cancel", type: "ReactNode", description: "기본 취소 버튼 라벨", visibleWhen: (v) => v["Button"] === true },
  ],
  render: (v, { icon, on, set }) => (
    <>
      <Button variant="outline" onClick={() => set("open", true)}>
        Open dialog
      </Button>
      <Dialog
        open={v["open"] === true}
        modal={v["modal"] === true ? undefined : false}
        onOpenChange={on("onOpenChange", (open) => set("open", open as boolean))}
        variant={v["Type"] === "warning" ? "warning" : undefined}
        icon={v["Leading Icon"] === true ? icon("-> Leading Icon") : undefined}
        title={String(v["-> Title"])}
        description={v["Description"] === true ? String(v["-> Description"]) : undefined}
        checkbox={v["Checkbox"] === true ? <Checkbox variant="mute">Do not ask again.</Checkbox> : undefined}
        actions={v["Button"] === true ? undefined : null}
        onConfirm={v["Button"] === true ? on("onConfirm") : undefined}
        onCancel={on("onCancel")}
        confirmLabel={v["confirmLabel"] === "Confirm" ? undefined : String(v["confirmLabel"])}
        cancelLabel={v["cancelLabel"] === "Cancel" ? undefined : String(v["cancelLabel"])}
      />
    </>
  ),
  note: (v) =>
    v["Button"] === false
      ? "버튼이 없으면 Esc로만 닫힘 — 닫을 방법을 actions나 내용 안에 꼭 두세요 (리뷰)."
      : v["open"] === true || v["modal"] === false
        ? undefined
        : "트리거가 없는 컴포넌트 — 미리보기의 Open dialog(쓰는 쪽 버튼 예시)나 open 컨트롤로 여세요.",
}
