import { CircleAlert, CircleDashed, TriangleAlert } from "lucide-react"
import { useState } from "react"

import { Button, Checkbox, Dialog } from "../../src"
import { Themes } from "../shell/theme"

const title = "Heading to ‘Content Studio’ to create your post?"
const description = "Exit this page and start creating a post in ‘Content Studio’."

/** Shown in place (modal={false}) so every variant is visible at once. */
function Matrix({ theme }: { theme: "light" | "dark" }) {
  return (
    <div style={{ display: "grid", gap: 24, justifyItems: "start" }}>
      <span className="head">notification</span>
      <Dialog open modal={false} icon={<CircleDashed />} title={title} description={description} data-testid={`${theme}-notification`} />
      <span className="head">warning</span>
      <Dialog open modal={false} variant="warning" icon={<CircleDashed />} title={title} description={description} data-testid={`${theme}-warning`} />
      <span className="head">Checkbox</span>
      <Dialog open modal={false} icon={<CircleDashed />} title={title} description={description} checkbox={<Checkbox variant="mute">Do not ask again.</Checkbox>} data-testid={`${theme}-checkbox`} />
      <span className="head">title only · no icon · no buttons</span>
      <Dialog open modal={false} title={title} actions={null} data-testid={`${theme}-bare`} />
    </div>
  )
}

/** Real use: a button opens the modal; the answer is logged. */
function Usage({ theme }: { theme: "light" | "dark" }) {
  const [open, setOpen] = useState<"none" | "notification" | "warning">("none")
  const [answer, setAnswer] = useState("—")
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <Button variant="outline" onClick={() => setOpen("notification")}>게시물 만들기</Button>
      <Button variant="outline" onClick={() => setOpen("warning")}>삭제</Button>
      <span style={{ color: "var(--gb-text-subtle)", font: "var(--gb-typography-sm)" }} data-testid={`${theme}-answer`}>응답: {answer}</span>
      <Dialog
        open={open === "notification"}
        onOpenChange={(o) => !o && setOpen("none")}
        icon={<CircleAlert />}
        title="Content Studio로 이동할까요?"
        description="이 페이지를 나가 Content Studio에서 게시물을 만듭니다."
        confirmLabel="이동"
        cancelLabel="취소"
        onConfirm={() => setAnswer("이동")}
        onCancel={() => setAnswer("취소")}
      />
      <Dialog
        open={open === "warning"}
        onOpenChange={(o) => !o && setOpen("none")}
        variant="warning"
        icon={<TriangleAlert />}
        title="게시물을 삭제할까요?"
        description="삭제하면 되돌릴 수 없어요."
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={() => setAnswer("삭제")}
        onCancel={() => setAnswer("취소")}
      />
    </div>
  )
}

export function DialogVariants() {
  return (
    <Themes
      render={(theme) => (
        <>
          <Matrix theme={theme} />
          <h2 className="sub">실제 사용 (모달)</h2>
          <Usage theme={theme} />
        </>
      )}
    />
  )
}
