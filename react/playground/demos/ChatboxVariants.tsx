import { Chatbox } from "../../src"
import { Themes } from "../shell/theme"
import { chatboxActive, endExamples, slotExamples, startExamples } from "../stories/chatbox"

function Matrix({ theme }: { theme: "light" | "dark" }) {
  return (
    <div className="stack" style={{ width: 700 }}>
      <span className="head">default · active · disabled · filled</span>
      <Chatbox data-testid={`${theme}-default`} />
      <Chatbox style={chatboxActive} data-testid={`${theme}-active`} />
      <Chatbox disabled data-testid={`${theme}-disabled`} />
      <Chatbox defaultValue="Please share your ideas." data-testid={`${theme}-filled`} />
      <span className="head" style={{ marginTop: 24 }}>content (슬롯) — 아무 컴포넌트나 (코드)</span>
      {Object.entries(slotExamples).map(([name, node]) => (
        <Chatbox key={name} content={node} placeholder={name} />
      ))}
      <span className="head" style={{ marginTop: 24 }}>size sm · md · lg · custom (코드) — 글자는 모두 16/24</span>
      <Chatbox size="sm" defaultValue="size sm — 높이 240" data-testid={`${theme}-sm`} />
      <Chatbox size="md" defaultValue="size md — 높이 280" data-testid={`${theme}-md`} />
      <Chatbox size="lg" defaultValue="size lg — 높이 320, 패딩 20" data-testid={`${theme}-lg`} />
      <Chatbox size="custom" height={160} width={480} defaultValue="size custom — height 160 · width 480" data-testid={`${theme}-size-custom`} />
      <span className="head" style={{ marginTop: 24 }}>높이 고정 — 긴 글은 안에서 스크롤 (코드)</span>
      <Chatbox size="md" defaultValue={Array.from({ length: 30 }, (_, i) => `${i + 1}번째 줄`).join("\n")} data-testid={`${theme}-long`} />
      <Chatbox content={slotExamples["추천 칩 (Chip)"]} defaultValue={Array.from({ length: 30 }, (_, i) => `${i + 1}번째 줄`).join("\n")} data-testid={`${theme}-long-slot`} />
      <span className="head" style={{ marginTop: 24 }}>start · end — 버튼 직접 넣기 (코드)</span>
      <Chatbox start={startExamples["클립 + 이미지"]} end={endExamples["음성 + 보내기"]} data-testid={`${theme}-custom`} />
      <Chatbox start={null} end={endExamples["텍스트 버튼"]} />
      <Chatbox disabled start={startExamples["클립 + 이미지"]} end={endExamples["음성 + 보내기"]} data-testid={`${theme}-custom-disabled`} />
      <span className="head" style={{ marginTop: 24 }}>바깥 &lt;form&gt; 안 — 전송 버튼이 form을 제출하지 않음 (코드)</span>
      <form
        data-testid={`${theme}-outer-form`}
        onSubmit={(e) => {
          e.preventDefault()
          e.currentTarget.dataset.submitted = String(Number(e.currentTarget.dataset.submitted ?? 0) + 1)
        }}
      >
        <Chatbox end={endExamples["텍스트 버튼"]} defaultValue="form 안의 메시지" />
      </form>
      <span className="head" style={{ marginTop: 24 }}>전송 버튼 없음 · 여러 줄 (코드)</span>
      <Chatbox showSend={false} />
      <Chatbox defaultValue={"첫 줄\n둘째 줄\n셋째 줄 — 입력하는 만큼 높이가 늘어남"} />
    </div>
  )
}

export function ChatboxVariants() {
  return <Themes render={(theme) => <Matrix theme={theme} />} />
}
