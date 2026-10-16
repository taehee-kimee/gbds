import { Avatar } from "../../src"
import sample from "../assets/avatar-sample.jpg"
import { Row, Themes } from "../shell/theme"

const shapes = ["rounded", "rectangle", "circle"] as const

function Matrix({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className="grid">
      <span />
      {shapes.map((shape) => (
        <span key={shape} className="head">{shape}</span>
      ))}
      <Row label="Image">
        {shapes.map((shape) => (
          <Avatar key={shape} shape={shape} src={sample} alt="Sam Lee" data-testid={`${theme}-image-${shape}`} />
        ))}
      </Row>
      <Row label="Initial">
        {shapes.map((shape) => (
          <Avatar key={shape} shape={shape} alt="Sam Lee" data-testid={`${theme}-initial-${shape}`} />
        ))}
      </Row>
      <Row label="Icon">
        {shapes.map((shape) => (
          <Avatar key={shape} shape={shape} alt="" data-testid={`${theme}-icon-${shape}`} />
        ))}
      </Row>
    </div>
  )
}

/** Figma has no specimen for these — what the code does at the edges. */
function Edges({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className="grid" style={{ ["--cols" as string]: 4 }}>
      <span />
      <span className="head">소문자 "sam lee"</span>
      <span className="head">한글 "김태희"</span>
      <span className="head">이미지 실패 → initial</span>
      <span className="head">이미지 실패, alt ""</span>
      <Row label="fallback">
        <Avatar alt="sam lee" data-testid={`${theme}-lowercase`} />
        <Avatar alt="김태희" data-testid={`${theme}-korean`} />
        <Avatar src="/does-not-exist.jpg" alt="Sam Lee" data-testid={`${theme}-broken-initial`} />
        <Avatar src="/does-not-exist.jpg" alt="" data-testid={`${theme}-broken-icon`} />
      </Row>
    </div>
  )
}

export function AvatarVariants() {
  return (
    <Themes
      render={(theme) => (
        <>
          <Matrix theme={theme} />
          <h2 className="sub">Figma에 없는 경우</h2>
          <Edges theme={theme} />
        </>
      )}
    />
  )
}
