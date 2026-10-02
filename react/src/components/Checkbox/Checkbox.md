# ================================================================
# Checkbox Component Specification
# ================================================================
# Last Updated: 2026-10-02
# Updated By: taehee0150@gmail.com

title: gs-checkbox

# ================================================================
# Layer 1: UX Guidelines
# ================================================================

meta:
  component: gs-checkbox
  description: |
    A single boolean choice with an optional text label next to a 16px box.
    Use for a standalone yes/no option (e.g. agreeing to terms) or for
    picking any number of items from a list. Supports a "part" (indeterminate)
    state for a parent that controls a group. Not for choosing exactly one of
    several mutually exclusive options.
  source:
    figma: "G9YNa2vjdqDjnML9y5hXJ4 · page Checkbox (73:1978) · component set Checkbox (76:8617)"
    code: "react/src/components/Checkbox/Checkbox.tsx"

usage:
  when_to_use:
    - For a single opt-in that the user confirms before submitting, such as accepting terms
    - To select zero, one or many items from a list
    - As a "select all" parent of a group (use the part / indeterminate state when only some are selected)

  when_not_to_use:
    - For an on/off setting that takes effect immediately → use Switch
    - For choosing exactly one option from a set → use radio controls or Select
    - For triggering an action → use Button

  rules:
    - id: label-required
      rule: Every checkbox must have an accessible name
      severity: error
      message: "Pass a label as children. Without children, aria-label is required — enforced by the TypeScript type."

    - id: indeterminate-only-for-groups
      rule: Use indeterminate only for a parent whose children are partly selected
      severity: warning
      message: "Part is a summary of child state, not a third user choice. Clicking it must resolve to all or none."

    - id: avoid-disabled-state
      rule: Avoid disabled state when possible
      severity: warning
      message: "A disabled checkbox does not say why it is unavailable, and it cannot receive focus. Explain the condition in nearby text."

    - id: positive-labels
      rule: Write labels as positive statements
      severity: warning
      message: "Checking the box should mean 'yes' to the label ('메일 수신 동의'), never a double negative ('메일 수신 거부 안 함')."

  common_mistakes:
    - mistake: Checkbox without an accessible name
      correct: Pass the label as children, or aria-label when the label must be hidden.
      example:
        wrong: |
          <!-- TypeScript error: Property 'aria-label' is missing -->
          <Checkbox />
        right: |
          <Checkbox>약관에 동의합니다</Checkbox>
          <Checkbox aria-label="행 선택" />

    - mistake: Using a checkbox for a setting that applies immediately
      correct: Use Switch for instant on/off; keep Checkbox for choices confirmed by a submit.
      example:
        wrong: |
          <Checkbox onChange={(e) => setDarkMode(e.target.checked)}>다크 모드</Checkbox>
        right: |
          <Switch onChange={setDarkMode}>다크 모드</Switch>

    - mistake: Leaving indeterminate on after the user clicks the parent
      correct: Derive indeterminate from the children on every render.
      example:
        wrong: |
          <Checkbox indeterminate>전체 선택</Checkbox>
        right: |
          <Checkbox checked={all} indeterminate={some && !all} onChange={toggleAll}>전체 선택</Checkbox>

variant_guidelines:
  default:
    description: |
      The standard checkbox. Figma Style=default. Unchecked box is filled
      with background/bolder; label is text/default.
    best_practices:
      - Use everywhere unless the option needs to recede

  muted:
    description: |
      A lower-emphasis unchecked look: background/default box with a
      border/mute stroke and a text/subtler label. Figma Style=muted. Once
      checked or part, it looks the same as default.
    best_practices:
      - Use for optional, secondary choices next to more important ones
      - Do not use it to mean "disabled" — the control is still interactive

shape_guidelines:
  with_label:
    description: Box followed by a 14px/20px label, gap 8px. Figma Label=true (default).
    when_to_use:
      - Almost always — the label is the click target as well as the name

  box_only:
    description: The 16px box alone. Figma Label=false.
    when_to_use:
      - In table rows or lists where the row content already labels the choice
    requirements:
      - MUST provide aria-label (enforced by type)

states_and_behaviors:
  unchecked:
    description: Figma Type=default. Native checked=false.

  checked:
    description: Figma Type=Checked. Native checked=true. Shows a 12px check (lucide/check).

  part:
    description: |
      Figma Type=Part. indeterminate prop → the DOM indeterminate property.
      Shows a 12px dash (lucide/minus) and takes precedence over checked
      visually. Screen readers announce "mixed". A click clears it natively
      and toggles checked; the component re-applies the prop on the next
      render.

  focus:
    description: |
      Keyboard focus (:focus-visible) draws ring/focus around the box. No
      Figma variant exists for this state.

  disabled:
    description: |
      Native disabled attribute. Figma Type=Disabled. Box becomes
      background/disabled-bold with border/default; label text/subtle. If
      also checked or part, the mark stays visible on the disabled box.
    caution: Use sparingly. A disabled checkbox does not explain why it is unavailable.

other_options:
  label_click:
    description: The whole row is a <label>, so clicking the text toggles the box.

  text_overflow:
    description: The label wraps. The box stays vertically centered on the row.

# ================================================================
# Layer 2: Technical Spec
# ================================================================

anatomy:
  root:
    type: container
    element: label
    description: |
      Row wrapping the box and the label, so a click anywhere toggles the
      input. Figma: the variant frame (auto layout HORIZONTAL, gap sp-8,
      align center).

  box:
    type: control
    element: input[type=checkbox]
    description: |
      The native input with appearance none, drawn as the 16px box. Figma
      "Box" frame (16×16, radius sm, 1px INSIDE stroke, Box Shadow/shadow-xs).

  check:
    type: icon
    instanceOf: lucide/check
    nullable: true
    description: 12px check, shown when checked and not indeterminate. Inline SVG, stroke 2 at 24px viewBox.

  dash:
    type: icon
    instanceOf: lucide/minus
    nullable: true
    description: 12px dash, shown when indeterminate. Inline SVG.

  label:
    type: text
    nullable: true
    description: Label text, passed as children. Figma "-> Label" text property, visibility "Label" boolean.

props:
  label:
    type: string
    default: "Accept terms and conditions"
    description: Label text (Figma "-> Label")

  showLabel:
    type: boolean
    default: true
    description: Show the label (Figma "Label"). Code — omit children and pass aria-label.

  type:
    type: enum
    default: default
    enum:
      - default
      - Checked
      - Part
      - Disabled
    description: Check state (Figma "Type"). Code — checked, indeterminate and disabled on the input.

  style:
    type: enum
    default: default
    enum:
      - default
      - muted
    description: Visual emphasis (Figma "Style"). Code — variant prop.

default:
  name: Type=default, Style=default
  layout:
    - root:
        - box
        - label
  styles:
    root:
      display: inline-flex
      alignItems: center
      gap: var(--gs-space-8)                     # 8px
      cursor: pointer

    box:
      width: var(--gs-space-16)                  # 16px
      height: var(--gs-space-16)
      borderRadius: var(--gs-radius-sm)          # 6px
      backgroundColor: var(--gs-background-bolder)
      border: 1px inside var(--gs-border-muted)
      boxShadow: var(--gs-shadow-xs)             # 0 1px 2px rgb(0 0 0 / 10%)

    check:
      width: 12px
      height: 12px
      stroke: var(--gs-icon-default)
      strokeWidth: var(--gs-stroke-2)            # at 24px viewBox → 1px rendered

    label:
      textStyle: Text-sm/Medium               # font: var(--gs-typography-sm); font-weight: var(--gs-font-weight-medium) → 14px/20px Inter 500
      color: var(--gs-text-default)

variants:
  - name: default-unchecked
    configuration:
      type: default
      style: default
    styles:
      box:
        backgroundColor: var(--gs-background-bolder)
        border: 1px inside var(--gs-border-muted)
      label:
        color: var(--gs-text-default)

  - name: muted-unchecked
    configuration:
      type: default
      style: muted
    styles:
      box:
        backgroundColor: var(--gs-background-default)
        border: 1px inside var(--gs-border-mute)
      label:
        color: var(--gs-text-subtler)

  - name: checked
    configuration:
      type: Checked
      style: default | muted
    styles:
      box:
        backgroundColor: var(--gs-background-default)
        border: 1px inside var(--gs-border-subtler)
      check:
        visible: true
        stroke: var(--gs-icon-default)
      label:
        color: var(--gs-text-default)

  - name: part
    configuration:
      type: Part
      style: default | muted
    styles:
      box:
        backgroundColor: var(--gs-background-default)
        border: 1px inside var(--gs-border-subtler)
      dash:
        visible: true
        stroke: var(--gs-icon-default)
      label:
        color: var(--gs-text-default)

  - name: disabled
    configuration:
      type: Disabled
    styles:
      root:
        cursor: not-allowed
      box:
        backgroundColor: var(--gs-background-disabled-bold)
        border: 1px inside var(--gs-border-default)
      label:
        color: var(--gs-text-subtle)

  - name: focus-visible
    configuration:
      state: focus
    styles:
      box:
        boxShadow: var(--gs-ring-focus)          # plus the inset border and shadow-xs

  - name: forced-colors
    configuration:
      media: "(forced-colors: active)"
    styles:
      box:
        border: 1px solid CanvasText
      check:
        stroke: CanvasText

# ================================================================
# Layer 3: Interface Contract
# ================================================================

api:
  component: Checkbox
  import: 'import { Checkbox } from "@gs/react"'
  element: HTMLInputElement
  requires:
    - '@gs/tokens/fonts.css and @gs/tokens/tokens.css loaded once at the app root'

  # figma: the Figma property this prop comes from, or "none" for code-only props.
  # Every prop below with a Figma source or a playground control is editable in the
  # playground (Controls → Figma properties / Code properties).
  props:
    - name: children
      type: ReactNode
      default: undefined
      figma: "-> Label, shown when Label=true"
      description: Label text. Omit for a box-only checkbox (then aria-label is required).

    - name: aria-label
      type: string
      required: "when children is omitted"
      figma: "-> Label, when Label=false"
      description: Accessible name for a box-only checkbox. Required at type level.

    - name: variant
      type: '"default" | "muted"'
      default: default
      figma: Style
      description: Figma "Style". Only affects the unchecked look and label color.

    - name: checked
      type: boolean
      figma: Type=Checked
      description: Controlled checked state. Use with onChange.

    - name: defaultChecked
      type: boolean
      figma: none
      description: Initial checked state when uncontrolled.

    - name: indeterminate
      type: boolean
      default: false
      figma: Type=Part
      description: Sets the DOM indeterminate property; shows the dash and overrides the check visually.

    - name: disabled
      type: boolean
      default: false
      figma: Type=Disabled
      description: Native disabled. Blocks click and focus.

    - name: name
      type: string
      default: undefined
      figma: none
      description: Form field name. The checkbox is sent with the form only while checked.

    - name: value
      type: string
      default: '"on" (browser default)'
      figma: none
      description: Value sent with name when checked.

    - name: required
      type: boolean
      default: false
      figma: none
      description: The form will not submit until this box is checked (native browser validation).

    - name: className
      type: string
      figma: none
      description: Appended to the root <label>. Use for layout (margin), not for colors.

    - name: style
      type: CSSProperties
      figma: none
      description: Applied to the root <label>.

    - name: ref
      type: Ref<HTMLInputElement>
      figma: none
      description: Forwarded to the <input> (React 19 ref-as-prop).

    - name: "...rest"
      type: 'ComponentPropsWithRef<"input">'
      figma: none
      description: Every other native input attribute goes to the <input> (id, form, autoFocus, aria-describedby, data-* …). type is fixed to checkbox.

  slots:
    - name: children
      description: Label content after the box

  events:
    # Checkbox defines no custom events. Native <input> events are passed
    # through unchanged as React props; payloads are React synthetic events.
    # The three below are logged in the playground Actions panel.
    - name: onChange
      description: Fired when the user toggles the box (click on box or label, Space when focused). Not fired when disabled.
      payload:
        event: React.ChangeEvent<HTMLInputElement>
        read: event.target.checked

    - name: onFocus / onBlur
      description: Focus moves to and from the input.
      payload:
        event: React.FocusEvent<HTMLInputElement>

  methods:
    # No custom methods. Use the ref to reach the native element.
    - name: focus
      signature: "ref.current.focus(options?: FocusOptions): void"
      description: Native HTMLInputElement.focus()

    - name: click
      signature: "ref.current.click(): void"
      description: Native toggle, fires onChange

  dataAttributes:
    - name: data-variant
      values: [default, muted]
      description: Set on the root <label>. Drives the muted styles.

  tokensUsed:
    color:
      - --gs-background-bolder
      - --gs-background-default
      - --gs-background-disabled-bold
      - --gs-border-muted
      - --gs-border-mute
      - --gs-border-subtler
      - --gs-border-default
      - --gs-icon-default
      - --gs-text-default
      - --gs-text-subtler
      - --gs-text-subtle
    dimension:
      - --gs-space-8
      - --gs-space-16
      - --gs-radius-sm
      - --gs-stroke-1
      - --gs-stroke-2
    other:
      - --gs-typography-sm
      - --gs-font-weight-medium
      - --gs-shadow-xs
      - --gs-ring-focus

examples:
  basic:
    description: Standalone opt-in
    code: |
      <Checkbox name="terms" required>이용약관에 동의합니다</Checkbox>

  controlled:
    description: Controlled state
    code: |
      const [agreed, setAgreed] = useState(false)
      <Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)}>마케팅 수신 동의</Checkbox>

  select-all:
    description: Parent with indeterminate state
    code: |
      const all = checked.every(Boolean)
      const some = checked.some(Boolean)
      <Checkbox checked={all} indeterminate={some && !all} onChange={() => setChecked(checked.map(() => !all))}>
        전체 선택
      </Checkbox>

  box-only:
    description: No visible label (aria-label required)
    code: |
      <Checkbox aria-label="이 행 선택" />

  muted:
    description: Lower-emphasis option
    code: |
      <Checkbox variant="muted">다시 보지 않기</Checkbox>

# ================================================================
# Review Notes (Figma vs Code)
# ================================================================
#
# FIGMA VS CODE DISCREPANCIES:
#
# 1. **Unchecked is filled, checked is empty**  ⚠ needs design decision
#    - Figma: Type=default box = background/bolder (black in light, white in dark);
#             Checked/Part box = background/default + border/subtler + icon
#    - Code: follows Figma. Most libraries do the opposite, so users may read the state backwards
#
# 2. **Muted label is fainter than disabled label**  ⚠ needs design decision
#    - Figma: muted label text/subtler (neutral-450); disabled label text/subtle
#             (light neutral-500, dark neutral-400)
#    - Code: follows Figma
#
# 3. **No muted × Checked / Part variant**  ⚠ needs design decision
#    - Figma: Style=muted exists only with Type=default
#    - Code: checked / part styles win; a checked muted checkbox looks like default
#
# 4. **No Disabled × Checked / Part variant**  ⚠ needs design decision
#    - Figma: a single Type=Disabled (unchecked)
#    - Code: disabled box with the check or dash still visible
#
# 5. **Focus and hover**  ⚠ needs design decision
#    - Figma: no focus or hover variant
#    - Code: :focus-visible → var(--gs-ring-focus) around the box; no hover style
#
# 6. **Label visibility**
#    - Figma: "Label" boolean property
#    - Code: omit children; aria-label then required by type
#
# 7. **Figma page copy**
#    - Figma: page frame named "Label" with the shadcn Label description
#             "Renders an accessible label associated with controls."
#    - Code: n/a — Figma doc cleanup
#
# 8. **Width**
#    - Verified 2026-10-02: Chrome 216.45×20 vs Figma 217×20 (Inter 3.19)
#
# ═══════════════════════════════════════════════════════════════════════════════

# ═══════════════════════════════════════════════════════════════════════════════
# Technical Debt Notes
# ═══════════════════════════════════════════════════════════════════════════════
#
# KNOWN ISSUES IN THE CURRENT IMPLEMENTATION:
#
# 1. Library Build
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
    Drafted from code (Checkbox.tsx, Checkbox.module.css) and Figma component set 76:8617.
    Layer 1 guidelines are a first draft and need design review.
    Open design questions: Review Notes 1–5.
