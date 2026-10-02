# ================================================================
# Button Component Specification
# ================================================================
# Last Updated: 2026-10-02
# Updated By: taehee0150@gmail.com

title: gs-button

# ================================================================
# Layer 1: UX Guidelines
# ================================================================

meta:
  component: gs-button
  description: |
    A clickable button used to trigger an action such as submit, navigate,
    or confirm. Text variants (primary / mute / outline / link) render a label;
    icon variants (icon / ghost / icon-rounded) render a single icon with no
    label. Not for representing a persistent on/off state — use Toggle or
    Switch instead.
  source:
    figma: "G9YNa2vjdqDjnML9y5hXJ4 · page Button (72:2719) · component set Button (73:3681)"
    code: "react/src/components/Button/Button.tsx"

usage:
  when_to_use:
    - To trigger the most important action in a section (use primary)
    - To offer a supporting action next to a primary one (use mute or outline)
    - To place a low-emphasis text action inline with other content (use link)
    - To trigger a well-known action where space is tight, such as close, search or more (use icon, ghost or icon-rounded)
    - When you need a clear call to action in forms, dialogs, or workflows

  when_not_to_use:
    - For moving to another page or URL → use an anchor (<a>) / router Link. The link variant is still a <button> and cannot be opened in a new tab
    - For toggling an on/off state → use Toggle or Switch instead
    - For choosing between options → use Tabs, Select, Checkbox or radio controls instead
    - When the content is purely informational → use text instead

  rules:
    - id: one-primary-per-section
      rule: Limit primary buttons to one per section
      severity: warning
      message: "Several primary buttons compete for attention. Use mute or outline for the other actions."

    - id: icon-only-accessible-name
      rule: Icon-only buttons must have an aria-label
      severity: error
      message: "icon, ghost and icon-rounded have no visible text. Pass aria-label so screen readers can announce the action. Enforced by the TypeScript type — omitting it is a compile error."

    - id: avoid-disabled-state
      rule: Avoid disabled state when possible
      severity: warning
      message: "A disabled button does not say why it is unavailable, and it cannot receive focus. Prefer an enabled button plus inline feedback."

    - id: clear-action-labels
      rule: Button labels should be clear and action-oriented
      severity: warning
      message: "Use a concise verb ('저장', '삭제', '다음') instead of generic text ('확인', '여기를 클릭')."

    - id: link-variant-not-for-navigation
      rule: Do not use the link variant for page navigation
      severity: warning
      message: "The link variant only looks like a link. Navigation needs a real <a> so users can open it in a new tab or copy the address."

  common_mistakes:
    - mistake: Using too many primary buttons in one section
      correct: Keep one primary for the main action; use mute or outline for the rest.
      example:
        wrong: |
          <Button variant="primary">제출</Button>
          <Button variant="primary">임시 저장</Button>
          <Button variant="primary">취소</Button>
        right: |
          <Button variant="primary">제출</Button>
          <Button variant="outline">임시 저장</Button>
          <Button variant="mute">취소</Button>

    - mistake: Icon-only button without an accessible name
      correct: Always pass aria-label.
      example:
        wrong: |
          <!-- TypeScript error: Property 'aria-label' is missing -->
          <Button variant="ghost"><X /></Button>
        right: |
          <Button variant="ghost" aria-label="닫기"><X /></Button>

    - mistake: Disabling a button without explaining why
      correct: Keep the button enabled and show what is missing when it is pressed.
      example:
        wrong: |
          <Button disabled>제출</Button>
        right: |
          <Button onClick={submit}>제출</Button>
          <p role="alert">필수 항목을 모두 입력해 주세요</p>

    - mistake: Using the link variant to navigate
      correct: Render a real anchor or router Link for navigation.
      example:
        wrong: |
          <Button variant="link" onClick={() => (location.href = "/terms")}>약관 보기</Button>
        right: |
          <a href="/terms">약관 보기</a>

    - mistake: Putting a button inside a form without choosing its type
      correct: Button defaults to type="button" and never submits. Set type="submit" on the submit button explicitly.
      example:
        wrong: |
          <form onSubmit={save}>
            <Button>저장</Button>   <!-- does not submit -->
          </form>
        right: |
          <form onSubmit={save}>
            <Button type="submit">저장</Button>
          </form>

variant_guidelines:
  primary:
    description: |
      The highest-emphasis button, filled with background/bold. Use for the
      single most important action in a section, such as submitting a form
      or completing a task.
    best_practices:
      - Reserve for the main action of a section
      - Limit to one per section
      - Keep its placement consistent across screens (e.g. bottom-right of a dialog)

  mute:
    description: |
      A low-contrast filled button (background/subtler). The neutral partner
      of primary for secondary actions such as cancel or back.
    best_practices:
      - Pair with primary for the alternative action
      - Use when a bordered button would add visual noise in a dense area

  outline:
    description: |
      A bordered button on background/default. Medium emphasis — more visible
      than mute, less than primary.
    best_practices:
      - Use for secondary actions that still need to stand out
      - Prefer over mute on busy or tinted surfaces where a fill would blend in

  link:
    description: |
      Text with an underline, no container, 20px tall. For low-emphasis
      actions that sit inline with text or in tight layouts.
    best_practices:
      - Use for actions, not navigation (see link-variant-not-for-navigation)
      - Does not support a trailing icon

  icon:
    description: Square 36×36 icon button with a border, radius lg.
    best_practices:
      - Use for well-known actions in toolbars and headers
      - Always provide aria-label

  ghost:
    description: Circular 36×36 icon button with no background or border.
    best_practices:
      - Use where the icon should feel part of the surface, such as a close button in a dialog header
      - Always provide aria-label

  icon-rounded:
    description: Circular 36×36 icon button with a border.
    best_practices:
      - Use where a circular control fits the surrounding shapes, such as floating or media controls
      - Always provide aria-label

shape_guidelines:
  text_only:
    description: |
      A label without an icon — the default for primary, mute, outline and
      link. Clearest way to communicate an action.
    when_to_use:
      - When an icon would be ambiguous or unfamiliar
      - When the label alone describes the action

  text_and_trailing_icon:
    description: |
      A label followed by a 16px icon (trailingIcon prop).
    when_to_use:
      - When the icon reinforces direction or result, such as an arrow for "다음" or an external-link icon
    not_supported:
      - link variant (trailingIcon is ignored)

  icon_only:
    description: |
      A single 16px icon in a 36×36 box (icon, ghost, icon-rounded).
    when_to_use:
      - When the icon is universally recognizable (close, search, menu, more)
      - When space is limited
    requirements:
      - MUST provide aria-label (enforced by type)

states_and_behaviors:
  enabled:
    description: Resting state. Figma State=default.

  hover:
    description: |
      Pointer is over the button. Shares the Figma State=active visuals.
      Only applied on devices with a hover-capable pointer
      (@media (hover: hover)), so the style does not stick after a tap on
      touch screens.

  active:
    description: |
      Button is being pressed (mouse down, touch, or Space/Enter held).
      Figma State=active. Applied on all devices.

  selected:
    description: |
      isSelected={true}. Keeps the Figma State=active look while selected and
      announces aria-pressed="true". A button given isSelected={false} is
      announced as a toggle that is not pressed; a button without the prop is
      a plain action button. For the current item of a button group. No Figma
      variant exists for this state. Disabled wins over selected.

  focus:
    description: |
      Keyboard focus (:focus-visible only, not on mouse click). Shows the
      focus ring (ring/focus = Figma effect style "Box Shadow/Focus ring",
      0 0 0 3px). No Figma variant exists for this state.

  disabled:
    description: |
      Native disabled attribute. Figma State=disabled. The button cannot be
      clicked, does not receive focus, and shows a not-allowed cursor.
    caution: |
      Use sparingly. A disabled button does not explain why it is
      unavailable.

other_options:
  flexible_width:
    description: Width follows content (Figma HUG). Icon variants are fixed 36×36.

  text_overflow:
    description: Labels stay on one line (white-space nowrap). Keep labels short.

# ================================================================
# Layer 2: Technical Spec
# ================================================================

anatomy:
  root:
    type: container
    element: button
    description: |
      The only container. Holds background, border (drawn as inset
      box-shadow), radius, padding and the horizontal layout of label and
      icon. Figma: the variant frame itself (auto layout HORIZONTAL; VERTICAL
      for link).

  label:
    type: text
    nullable: true
    description: Button text, passed as children. Absent in icon variants. Figma "-> Label" text property.

  trailing-icon:
    type: instance
    instanceOf: lucide/circle-dashed
    nullable: true
    description: |
      16px icon after the label. Figma "Icon" (instance swap) + "Trailing
      icon" (boolean, default false). Code: trailingIcon prop, any SVG,
      colored with currentColor.

  icon:
    type: instance
    instanceOf: lucide/circle-dashed
    description: The single icon of icon / ghost / icon-rounded, passed as children.

  underline:
    type: line
    description: |
      link variant only. Figma draws a 1px Line below the text box; code
      uses text-decoration underline (thickness stroke/1, offset 4px).

props:
  label:
    type: string
    default: "Button"
    description: Button text (Figma "-> Label" text property)

  icon:
    type: instance
    default: "lucide/circle-dashed"
    description: Icon to display (Figma "Icon" instance swap)

  trailingIcon:
    type: boolean
    default: false
    description: Show the icon after the label (Figma "Trailing icon")

  type:
    type: enum
    default: primary
    enum:
      - primary
      - mute
      - outline
      - link
      - icon
      - ghost
      - icon rounded
    description: Visual style and shape (Figma "Type")

  state:
    type: enum
    default: default
    enum:
      - default
      - active
      - disabled
    description: Interactive state (Figma "State"). In code, active = :hover + :active; disabled = disabled attribute.

default:
  name: Type=primary, State=default
  layout:
    - root:
        - label
        - trailing-icon   # hidden unless trailingIcon is set
  styles:
    root:
      display: inline-flex
      alignItems: center
      justifyContent: center
      layoutMode: HORIZONTAL
      layoutSizingHorizontal: HUG
      height: var(--gs-space-36)                 # 36px
      paddingLeft: var(--gs-space-16)
      paddingRight: var(--gs-space-16)
      gap: var(--gs-space-8)
      borderRadius: var(--gs-radius-lg)          # 10px
      backgroundColor: var(--gs-background-bold)
      color: var(--gs-text-invert)
      cursor: pointer

    label:
      textStyle: Text-sm/Medium               # font: var(--gs-typography-sm); font-weight: var(--gs-font-weight-medium) → 14px/20px Inter 500
      whiteSpace: nowrap

    trailing-icon:
      width: var(--gs-space-16)                  # 16px
      height: var(--gs-space-16)
      color: currentColor

variants:
  # ============================================================
  # TYPE VARIANTS — State=default
  # ============================================================

  - name: primary-default
    configuration:
      type: primary
    styles:
      root:
        backgroundColor: var(--gs-background-bold)
      label:
        color: var(--gs-text-invert)

  - name: mute-default
    configuration:
      type: mute
    styles:
      root:
        backgroundColor: var(--gs-background-subtler)
      label:
        color: var(--gs-text-default)

  - name: outline-default
    configuration:
      type: outline
    styles:
      root:
        backgroundColor: var(--gs-background-default)
        border: 1px inside var(--gs-border-default)
      label:
        color: var(--gs-text-default)

  - name: link-default
    configuration:
      type: link
    styles:
      root:
        height: var(--gs-font-leading-5)         # 20px
        padding: 0
        backgroundColor: transparent
      label:
        color: var(--gs-text-bold)
      underline:
        color: var(--gs-icon-bold)
        thickness: var(--gs-stroke-1)

  - name: icon-default
    configuration:
      type: icon
    styles:
      root:
        width: 36px
        height: 36px
        padding: 0
        backgroundColor: var(--gs-background-default)
        border: 1px inside var(--gs-border-default)
        borderRadius: var(--gs-radius-lg)
      icon:
        color: var(--gs-icon-default)

  - name: ghost-default
    configuration:
      type: ghost
    styles:
      root:
        width: 36px
        height: 36px
        padding: 0
        backgroundColor: transparent
        borderRadius: var(--gs-radius-full)
      icon:
        color: var(--gs-icon-default)

  - name: icon-rounded-default
    configuration:
      type: icon rounded
    styles:
      root:
        width: 36px
        height: 36px
        padding: 0
        backgroundColor: var(--gs-background-default)
        border: 1px inside var(--gs-border-default)
        borderRadius: var(--gs-radius-full)
      icon:
        color: var(--gs-icon-default)

  # ============================================================
  # STATE=active  (code: :hover on hover-capable pointers, :active everywhere)
  # ============================================================

  - name: primary-active
    configuration:
      type: primary
      state: active
    styles:
      root:
        backgroundColor: var(--gs-background-mute)
        opacity: var(--gs-opacity-90)
      label:
        color: var(--gs-text-static-white)

  - name: mute-active
    configuration:
      type: mute
      state: active
    styles:
      root:
        backgroundColor: var(--gs-background-mute)
        opacity: var(--gs-opacity-90)
      label:
        color: var(--gs-text-static-white)

  - name: outline-active
    configuration:
      type: outline
      state: active
    styles:
      root:
        backgroundColor: var(--gs-background-mute)
        border: none
      label:
        color: var(--gs-text-static-white)

  - name: link-active
    configuration:
      type: link
      state: active
    styles:
      label:
        color: var(--gs-text-subtle)
      underline:
        color: var(--gs-border-mute-subtle)

  - name: icon-active
    configuration:
      type: icon | icon rounded
      state: active
    styles:
      root:
        backgroundColor: var(--gs-background-mute)
        border: none
      icon:
        color: var(--gs-icon-static-white)

  - name: ghost-active
    configuration:
      type: ghost
      state: active
    styles:
      root:
        backgroundColor: transparent
        borderRadius: var(--gs-radius-md)        # 8px — Figma changes ghost radius per state
      icon:
        color: var(--gs-icon-subtlest)

  # ============================================================
  # STATE=disabled
  # ============================================================

  - name: text-disabled
    configuration:
      type: primary | mute | outline
      state: disabled
    styles:
      root:
        backgroundColor: var(--gs-background-disabled)
        border: 1px inside var(--gs-border-overlay)
        cursor: not-allowed
      label:
        color: var(--gs-text-static-gray)

  - name: link-disabled
    configuration:
      type: link
      state: disabled
    styles:
      label:
        color: var(--gs-text-static-gray)
      underline:
        color: var(--gs-border-static-gray)

  - name: icon-disabled
    configuration:
      type: icon
      state: disabled
    styles:
      root:
        backgroundColor: var(--gs-background-disabled)
        border: 1px inside var(--gs-border-overlay)
        cursor: not-allowed
      icon:
        color: var(--gs-icon-subtlest)

  - name: ghost-disabled
    configuration:
      type: ghost
      state: disabled
    styles:
      root:
        backgroundColor: var(--gs-background-disabled)
        border: 1px inside var(--gs-border-overlay)
        borderRadius: var(--gs-radius-lg)        # 10px — Figma changes ghost radius per state
        cursor: not-allowed
      icon:
        color: var(--gs-icon-subtlest)

  - name: icon-rounded-disabled
    configuration:
      type: icon rounded
      state: disabled
    styles:
      root:
        backgroundColor: var(--gs-background-disabled)
        border: 1px inside var(--gs-border-overlay)
        cursor: not-allowed
      icon:
        color: var(--gs-icon-default)            # Figma uses icon/default here, unlike icon and ghost

  # ============================================================
  # SELECTED (code only — isSelected reuses State=active styles)
  # ============================================================

  - name: selected
    configuration:
      isSelected: true
    styles:
      root: same as the variant's State=active (see above)

  # ============================================================
  # FOCUS (code only — no Figma variant)
  # ============================================================

  - name: focus-visible
    configuration:
      state: focus
    styles:
      root:
        boxShadow: var(--gs-ring-focus)          # 0 0 0 3px rgb(161 161 161 / 50%), drawn outside, plus the variant's inset border

  # ============================================================
  # FORCED COLORS (Windows High Contrast)
  # ============================================================

  - name: forced-colors
    configuration:
      media: "(forced-colors: active)"
    styles:
      root:
        border: 1px solid ButtonText          # box-shadow is dropped in this mode; link variant keeps a transparent border

# ================================================================
# Layer 3: Interface Contract
# ================================================================

api:
  component: Button
  import: 'import { Button } from "@gs/react"'
  element: HTMLButtonElement
  requires:
    - '@gs/tokens/fonts.css and @gs/tokens/tokens.css loaded once at the app root'

  # figma: the Figma property this prop comes from, or "none" for code-only props.
  # Every prop below with a Figma source or a playground control is editable in the
  # playground (Controls → Figma properties / Code properties).
  props:
    - name: variant
      type: '"primary" | "mute" | "outline" | "link" | "icon" | "ghost" | "icon-rounded"'
      default: primary
      figma: Type
      description: Visual style. Figma "Type" ("icon rounded" → "icon-rounded").

    - name: children
      type: ReactNode
      required: true
      figma: "-> Label (text variants) · Icon (icon variants)"
      description: Label for text variants; the icon (an SVG) for icon variants.

    - name: trailingIcon
      type: ReactNode
      default: undefined
      figma: "Trailing icon + Icon"
      description: Icon rendered after the label at 16px. Text variants except link; ignored on link.

    - name: disabled
      type: boolean
      default: false
      figma: State=disabled
      description: Native disabled. Blocks click and focus. (Figma State=active has no prop — it is :hover / :active.)

    - name: isSelected
      type: boolean
      default: false
      figma: none
      description: |
        Selected state, e.g. the current item of a button group.
        true → State=active look + aria-pressed="true". Passing the prop at all
        (true or false) marks the button as a toggle for screen readers
        (aria-pressed="false" when false); plain action buttons omit it.
        Passing aria-current (navigation) suppresses aria-pressed. The parent
        owns this state — Button does not toggle itself.

    - name: aria-label
      type: string
      required: "for icon, ghost, icon-rounded"
      figma: none
      description: Accessible name. Required at type level for icon variants. Optional on text variants, where it overrides the visible label for screen readers.

    - name: type
      type: '"button" | "submit" | "reset"'
      default: button
      figma: none
      description: Differs from the HTML default ("submit") so a Button inside a form never submits by accident. Set "submit" on the form's submit button.

    - name: name
      type: string
      default: undefined
      figma: none
      description: Sent with the form data as name=value when this button submits the form.

    - name: value
      type: string
      default: undefined
      figma: none
      description: Sent with name when this button submits the form — lets one form tell several submit buttons apart.

    - name: className
      type: string
      figma: none
      description: Appended after the component class. Use for layout (margin, width), not for colors.

    - name: ref
      type: Ref<HTMLButtonElement>
      figma: none
      description: Forwarded to the <button> (React 19 ref-as-prop).

    - name: "...rest"
      type: ComponentPropsWithRef<"button">
      figma: none
      description: Every other native <button> attribute is passed through (id, form, autoFocus, aria-*, data-*, tabIndex …).

  slots:
    - name: children
      description: Label text, or the icon for icon variants

    - name: trailingIcon
      description: Icon positioned after the label

  events:
    # Button defines no custom events. All native <button> events are passed
    # through unchanged as React props; payloads are React synthetic events.
    # The four below are logged in the playground Actions panel.
    - name: onClick
      description: Fired on mouse click, tap, and Enter/Space when focused. Not fired when disabled.
      payload:
        event: React.MouseEvent<HTMLButtonElement>

    - name: onFocus
      description: Fired when the button receives focus. Never fires while disabled.
      payload:
        event: React.FocusEvent<HTMLButtonElement>

    - name: onBlur
      description: Fired when the button loses focus.
      payload:
        event: React.FocusEvent<HTMLButtonElement>

    - name: onKeyDown / onKeyUp
      description: Keyboard events. Enter and Space already trigger onClick — no handler needed for activation.
      payload:
        event: React.KeyboardEvent<HTMLButtonElement>

    - name: onPointerDown / onPointerUp / onPointerEnter / onPointerLeave
      description: Pointer events, e.g. for press analytics. Not fired when disabled.
      payload:
        event: React.PointerEvent<HTMLButtonElement>

  methods:
    # No custom methods. Use the ref to reach the native element.
    - name: focus
      signature: "ref.current.focus(options?: FocusOptions): void"
      description: Native HTMLButtonElement.focus()

    - name: blur
      signature: "ref.current.blur(): void"
      description: Native HTMLButtonElement.blur()

  dataAttributes:
    - name: data-variant
      values: [primary, mute, outline, link, icon, ghost, icon-rounded]
      description: Set by the component. Drives the variant styles; usable as a test selector.

    - name: data-selected
      values: [present when isSelected]
      description: Set by the component while isSelected is true. Drives the selected styles.

  tokensUsed:
    color:
      - --gs-background-bold
      - --gs-background-subtler
      - --gs-background-default
      - --gs-background-mute
      - --gs-background-disabled
      - --gs-text-invert
      - --gs-text-default
      - --gs-text-bold
      - --gs-text-subtle
      - --gs-text-static-white
      - --gs-text-static-gray
      - --gs-icon-default
      - --gs-icon-bold
      - --gs-icon-subtlest
      - --gs-icon-static-white
      - --gs-border-default
      - --gs-border-overlay
      - --gs-border-mute-subtle
      - --gs-border-static-gray
    dimension:
      - --gs-space-8
      - --gs-space-16
      - --gs-space-36
      - --gs-radius-lg
      - --gs-radius-full
      - --gs-stroke-1
      - --gs-font-leading-5
    other:
      - --gs-typography-sm
      - --gs-font-weight-medium
      - --gs-opacity-90
      - --gs-ring-focus

examples:
  basic-primary:
    description: Basic primary button
    code: |
      <Button onClick={save}>저장</Button>

  primary-with-alternatives:
    description: One primary with supporting actions
    code: |
      <Button variant="mute" onClick={close}>취소</Button>
      <Button variant="primary" onClick={confirm}>확인</Button>

  submit-in-form:
    description: Submit button inside a form
    code: |
      <form onSubmit={handleSubmit}>
        <Button type="submit">제출</Button>
      </form>

  with-trailing-icon:
    description: Label with a trailing icon
    code: |
      import { ArrowRight } from "lucide-react"

      <Button variant="outline" trailingIcon={<ArrowRight />}>다음</Button>

  link:
    description: Inline text action
    code: |
      <Button variant="link" onClick={openDetails}>자세히 보기</Button>

  icon-only:
    description: Icon-only buttons (aria-label required)
    code: |
      import { MoreHorizontal, Search, X } from "lucide-react"

      <Button variant="icon" aria-label="검색"><Search /></Button>
      <Button variant="ghost" aria-label="닫기"><X /></Button>
      <Button variant="icon-rounded" aria-label="더보기"><MoreHorizontal /></Button>

  toggle:
    description: Toggle button — the parent owns the selected state
    code: |
      const [bold, setBold] = useState(false)
      <Button variant="icon" aria-label="굵게" isSelected={bold} onClick={() => setBold(!bold)}><Bold /></Button>

  name-value-submit:
    description: Two submit buttons in one form, told apart by name/value
    code: |
      <form action="/posts" method="post">
        <Button type="submit" variant="outline" name="intent" value="draft">임시 저장</Button>
        <Button type="submit" name="intent" value="publish">게시</Button>
      </form>

  disabled-button:
    description: Disabled button (use sparingly)
    code: |
      <Button disabled>제출</Button>

  programmatic-focus:
    description: Focus the button from code
    code: |
      const ref = useRef<HTMLButtonElement>(null)
      // …
      <Button ref={ref}>다시 시도</Button>
      ref.current?.focus()

# ================================================================
# Review Notes (Figma vs Code)
# ================================================================
#
# FIGMA VS CODE DISCREPANCIES:
#
# 1. **State Representation**
#    - Figma: State variant (default / active / disabled)
#    - Code: active → :hover (hover-capable pointers only) + :active;
#            disabled → native disabled attribute
#    - Assumption: Figma "active" means the interaction state. Confirm with design.
#
# 2. **Focus State**
#    - Figma: no focus variant on Button. Effect style "Box Shadow/Focus ring"
#             exists and is used 290 times elsewhere.
#    - Code: :focus-visible → var(--gs-ring-focus)
#
# 3. **Ghost radius per state**  ✅ decided 2026-10-01: follow Figma
#    - Figma: default radius/full, active radius/md, disabled radius/lg
#    - Code: same as Figma
#
# 4. **icon-rounded disabled icon color**  ✅ decided 2026-10-01: follow Figma
#    - Figma: icon/default (other icon variants use icon/subtlest)
#    - Code: same as Figma
#
# 5. **Ghost disabled gains a fill and border**  ⚠ needs design decision
#    - Figma: background/disabled + border/overlay, while ghost default has neither
#    - Code: follows Figma
#
# 6. **Same active color for every filled variant**  ⚠ needs design decision
#    - Figma: primary, mute, outline, icon, icon-rounded all turn background/mute
#             on active, so they become indistinguishable on hover
#    - Code: follows Figma
#
# 7. **Borders**
#    - Figma: 1px stroke, INSIDE
#    - Code: inset box-shadow, so bordered and borderless variants keep the
#            same hug width (a CSS border would add 2px)
#
# 8. **Link underline**
#    - Figma: separate Line node (1px) below the 20px text box, stroke bound to
#             icon/bold · border/mute-subtle · border/static-gray
#    - Code: text-decoration underline, offset 4px — visually equivalent, wraps with the text
#
# 9. **Width**
#    - Verified 2026-10-01: Chrome 76.61×36 vs Figma 77×36. Figma renders
#      Inter 3.19; @gs/tokens/fonts.css ships the same version. With Inter 4
#      (Google Fonts) the width drops to 75.84.
#
# 10. **Selected state (isSelected)**  ✅ decided 2026-10-02: keep the State=active look
#    - Figma: no selected variant on Button. Floating pill (Button Group, 76:8691)
#             draws its selected item as a separate frame filled background/mute
#    - Code: isSelected → aria-pressed + data-selected, reusing State=active styles,
#            so selected looks the same as hover/pressed. On ghost and link the active
#            colors are lighter, so a selected one reads as dimmer/disabled. Added for ButtonGroup
#
# ═══════════════════════════════════════════════════════════════════════════════

# ═══════════════════════════════════════════════════════════════════════════════
# Technical Debt Notes
# ═══════════════════════════════════════════════════════════════════════════════
#
# KNOWN ISSUES IN THE CURRENT IMPLEMENTATION:
#
# 1. trailingIcon on link at type level
#    - Description: Currently accepted by the type and silently ignored
#    - Priority: Low
#
# 2. Library Build
#    - Description: package exports src/*.ts directly; needs a Vite library build for use outside the workspace.
#      That build must set css.modules.generateScopedName to gsScopedName (react/css-modules.mjs) so
#      class names stay gs-{component} (root) and gs-{component}-{local} — a consumer compiling src/ with its own config gets other names
#    - Priority: High before the first external consumer
#
# ═══════════════════════════════════════════════════════════════════════════════

# ================================================================
# Metadata
# ================================================================

metadata:
  lastUpdated: "2026-10-02"
  status: draft
  notes: |
    Drafted from code (Button.tsx, Button.module.css) and Figma component set 73:3681.
    Layer 1 guidelines are a first draft and need design review.
    Open design questions: Review Notes 1, 2, 5, 6.
