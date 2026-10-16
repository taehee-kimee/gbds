import { Plus, Sparkles } from "lucide-react"
import {
  useCallback,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from "react"

import { Button } from "../Button"
import { ButtonGroupContext } from "../ButtonGroup/context"
import styles from "./Chatbox.module.css"

// `content` (the <meta> HTML attribute, meaningless on a textarea) is taken over by the slot content prop.
type NativeTextareaProps = Omit<ComponentPropsWithRef<"textarea">, "children" | "onSubmit" | "className" | "style" | "content">

type BaseChatboxProps = NativeTextareaProps & {
  /**
   * Enter (Shift+Enter adds a line) or any `type="submit"` button inside the box — the default send
   * button or your own in `end`. Gets the trimmed text; not called when it is empty.
   */
  onSubmit?: (value: string) => void
  /** Click on the default + button (Figma lucide/plus). Not used when you pass `start`. */
  onAttach?: () => void
  /** Figma `Button` — show the default send button. Default true. Not used when you pass `end`. */
  showSend?: boolean
  /**
   * Left of the button row. Default: the + button (onAttach, attachLabel). Pass your own Buttons to
   * replace it, or `null` for nothing. Buttons here follow the box's `disabled`.
   */
  start?: ReactNode
  /**
   * Right of the button row. Default: the sparkles send button (`type="submit"`). Pass your own
   * Buttons — give the one that sends `type="submit"` — or `null` for nothing.
   */
  end?: ReactNode
  /**
   * Figma `Slot` + `-> Slot` — rendered in the slot above the text (suggestion chips, attachment
   * previews, options, tools …). Any React node; omit it and the slot is hidden.
   */
  content?: ReactNode
  /** Accessible name of the default + button. Default "Attach file". */
  attachLabel?: string
  /** Accessible name of the default send button. Default "Send". */
  sendLabel?: string
  /** Applied to the outer box, not the textarea. */
  className?: string
  /** Applied to the outer box, not the textarea. */
  style?: CSSProperties
}

/**
 * Box size (code only — Figma is 112px tall). Text is Text-base 16/24 in every size.
 * sm = height 240 · padding 16 · radius 2xl · md = height 280 · lg = height 320 · padding 20 ·
 * radius 3xl. The box keeps its height; longer text scrolls inside.
 */
type PresetSizeProps = {
  size?: "sm" | "md" | "lg"
  height?: never
  width?: never
}

/** `size="custom"` — set the box yourself (sm padding and radius). Numbers are px. */
type CustomSizeProps = {
  size: "custom"
  /** Box height, e.g. 200 or "40vh". */
  height: number | string
  /** Box width. Default: fills the parent. */
  width?: number | string
}

export type ChatboxProps = BaseChatboxProps & (PresetSizeProps | CustomSizeProps)

export function Chatbox(props: ChatboxProps) {
  const {
    onSubmit,
    onAttach,
    showSend = true,
    start,
    end,
    content,
    size = "sm",
    height,
    width,
    attachLabel = "Attach file",
    sendLabel = "Send",
    className,
    style,
    value: valueProp,
    defaultValue,
    onChange,
    onKeyDown,
    disabled,
    ref,
    placeholder = "Please share your ideas.",
    ...rest
  } = props

  // Mirror the text so the box knows when it is filled and what to send, controlled or not.
  const [inner, setInner] = useState(String(defaultValue ?? ""))
  const value = valueProp !== undefined ? String(valueProp) : inner

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const setRefs = useCallback(
    (node: HTMLTextAreaElement | null) => {
      inputRef.current = node
      assignRef(ref, node)
    },
    [ref]
  )

  const submit = () => {
    const text = value.trim()
    if (disabled || !text) return
    onSubmit?.(text)
    if (valueProp === undefined) setInner("")
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(e)
    if (e.defaultPrevented) return
    // Enter while an IME is composing (e.g. Hangul) only commits the syllable — never send then.
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      submit()
    }
  }

  // Any type="submit" button in the box sends — the default one or one passed in start/end/content.
  // preventDefault also stops it from submitting a surrounding <form>.
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const submitter = (e.target as HTMLElement).closest('button[type="submit"]')
    if (!submitter || !e.currentTarget.contains(submitter) || e.defaultPrevented) return
    e.preventDefault()
    submit()
  }

  // A click on the box's empty space puts the caret in the text, like one big input.
  const focusText = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled || e.target !== e.currentTarget && (e.target as HTMLElement).closest("button, a, input, textarea, [tabindex]")) return
    if (e.target === inputRef.current) return
    e.preventDefault()
    inputRef.current?.focus()
  }

  return (
    <div
      className={className ? `${styles.root} ${className}` : styles.root}
      style={size === "custom" ? { ...style, ["--chatbox-height" as string]: toCss(height), width: toCss(width) ?? style?.width } : style}
      data-size={size}
      data-filled={value.length > 0 || undefined}
      data-disabled={disabled || undefined}
      onMouseDown={focusText}
      onClick={onClick}
    >
      {/* Figma -> Slot: the content prop fills this slot. */}
      {content != null && (
        <div className={styles.slot} data-slot="content">
          {content}
        </div>
      )}
      <div className={styles.body}>
        <textarea
          {...rest}
          ref={setRefs}
          rows={1}
          className={styles.input}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            if (valueProp === undefined) setInner(e.target.value)
            onChange?.(e)
          }}
          onKeyDown={handleKeyDown}
        />
        {/* Buttons in the row — default or passed in — take the box's disabled state from this context. */}
        <ButtonGroupContext value={{ disabled }}>
          <div className={styles.actions}>
            <div className={styles.side}>
              {start !== undefined ? start : <Button icon={<Plus />} aria-label={attachLabel} onClick={onAttach} />}
            </div>
            <div className={styles.side}>
              {end !== undefined ? end : showSend && <Button type="submit" icon={<Sparkles />} aria-label={sendLabel} />}
            </div>
          </div>
        </ButtonGroupContext>
      </div>
    </div>
  )
}

/** 200 → "200px"; strings pass through. */
function toCss(v: number | string | undefined) {
  return typeof v === "number" ? `${v}px` : v
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value)
  else if (ref) ref.current = value
}
