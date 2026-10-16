import { AsYouType, getCountries, getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js"
import { Eye, EyeOff, Globe, Plus, Search, X } from "lucide-react"
import { useCallback, useId, useRef, useState, type ChangeEvent, type ComponentPropsWithRef, type CSSProperties, type MouseEvent, type ReactNode } from "react"

import { Select } from "../Select/Select"
import { useField } from "./Field"
import styles from "./Input.module.css"

type NativeInputProps = Omit<ComponentPropsWithRef<"input">, "className" | "style" | "size">

type BaseInputProps = NativeInputProps & {
  /** An icon at the left end (16px). Code only — type="search" puts the search icon here by default. */
  leadingIcon?: ReactNode
  /**
   * type="text" and "search": an X at the right end while there is text, which empties the box
   * (onChange fires with ""). Default true. Not in Figma — user decision 2026-10-16.
   */
  clearable?: boolean
  /** Accessible name of that X. Default "Clear". */
  clearLabel?: string
  /** type="password": name of the eye button while the password is hidden. Default "Show password". */
  showPasswordLabel?: string
  /** type="password": name of the eye button while the password is shown. Default "Hide password". */
  hidePasswordLabel?: string
  /** Figma `Status=error`. Also set by a Field with an error. Sets aria-invalid. */
  invalid?: boolean
  /** Applied to the box, not the input. */
  className?: string
  /** Applied to the box, not the input (e.g. width). */
  style?: CSSProperties
}

/** type="time" — Figma Input time: hh:mm + AM/PM toggle (12-hour), or 00–23 without the toggle (24-hour). */
type TimeProps = {
  /** 12 (default, Figma): hours 1–12 + AM/PM. 24: hours 00–23, no AM/PM toggle. */
  hourCycle?: 12 | 24
  /** AM / PM, controlled. */
  period?: "AM" | "PM"
  /** AM / PM when uncontrolled. Default "AM". */
  defaultPeriod?: "AM" | "PM"
  onPeriodChange?: (period: "AM" | "PM") => void
}

export type PhoneValue = {
  country: CountryCode
  /** "82" for KR. */
  callingCode: string
  /** What is in the box. */
  national: string
  /** "+821012345678" once the number parses, else undefined. */
  e164?: string
  /** A valid number for that country (libphonenumber-js). */
  valid: boolean
}

/** type="tel" — Figma Input phone: country code select + number (country data from libphonenumber-js). */
type PhoneProps = {
  /** ISO country, controlled (e.g. "KR"). */
  country?: CountryCode
  /** ISO country when uncontrolled. Default "US" (Figma shows +1). */
  defaultCountry?: CountryCode
  onCountryChange?: (country: CountryCode) => void
  /** Limit the list (default: all 245 countries). */
  countries?: CountryCode[]
  /** Pinned to the top of the list, e.g. ["KR", "US"]. */
  preferredCountries?: CountryCode[]
  /** Language of the country names in the list (Intl). Default "en". */
  locale?: string
  /** Accessible name of the select. Default "Country code". */
  countryLabel?: string
  /** Every change of country or number, parsed. */
  onPhoneChange?: (phone: PhoneValue) => void
}

export type InputProps = BaseInputProps & TimeProps & PhoneProps

/** Figma Part/Input + the type-specific composites (Input time, Input phone). */
export function Input(props: InputProps) {
  if (props.type === "time") return <TimeInput {...props} />
  if (props.type === "tel") return <PhoneInput {...props} />
  return <InputBox {...props} />
}

/** The box itself — Figma Part/Input. */
function InputBox(props: InputProps) {
  const field = useField()
  const {
    leadingIcon,
    clearable = true,
    clearLabel = "Clear",
    showPasswordLabel = "Show password",
    hidePasswordLabel = "Hide password",
    invalid: invalidProp,
    className,
    style,
    type = "text",
    id = field.inputId,
    placeholder,
    onChange,
    // time / tel props are handled by TimeInput / PhoneInput; keep them off the <input>.
    hourCycle: _hourCycle,
    period: _period,
    defaultPeriod: _defaultPeriod,
    onPeriodChange: _onPeriodChange,
    country: _country,
    defaultCountry: _defaultCountry,
    onCountryChange: _onCountryChange,
    countries: _countries,
    preferredCountries: _preferredCountries,
    locale: _locale,
    countryLabel: _countryLabel,
    onPhoneChange: _onPhoneChange,
    ...rest
  } = props
  const invalid = invalidProp ?? field.invalid ?? false
  const describedBy = [field.describedBy, rest["aria-describedby"]].filter(Boolean).join(" ") || undefined

  const inputRef = useRef<HTMLInputElement>(null)
  const { ref } = rest
  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  // Clear button (text, search): shown only while the box has text — controlled or not.
  const [typed, setTyped] = useState(() => String(rest.defaultValue ?? "").length > 0)
  const hasText = rest.value !== undefined ? String(rest.value).length > 0 : typed
  const showClear = clearable && (type === "text" || type === "search") && hasText && !rest.disabled && !rest.readOnly
  const clear = () => {
    const input = inputRef.current
    if (!input) return
    // Set through the native setter and fire "input" so React calls onChange("") — works controlled or not.
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, "")
    input.dispatchEvent(new Event("input", { bubbles: true }))
    input.focus()
  }

  // type="password": an eye button switches the input between hidden and readable (not in Figma — user, 2026-10-16).
  const isPassword = type === "password"
  const [reveal, setReveal] = useState(false)

  // type="file": the native control is hidden; the box shows the chosen file names (Figma "File upload" row).
  const [files, setFiles] = useState("")
  const isFile = type === "file"
  // type="search" = Figma Input search: search icon on the left unless you pass your own.
  const isSearch = type === "search"
  const leading = leadingIcon ?? (isSearch ? <Search /> : null)
  // Figma Trailing icon follows the kind of input: Upload row (file) → +, Link row (url) → globe.
  const typeIcon = isFile ? <Plus /> : type === "url" ? <Globe /> : null

  // A press on the box (padding, a decorative icon) focuses the input, like one big field. Buttons keep their own click.
  const focusInput = (e: MouseEvent<HTMLElement>) => {
    const input = e.currentTarget.querySelector("input")
    if (!input || e.target === input || rest.disabled || (e.target as HTMLElement).closest("button")) return
    e.preventDefault()
    input.focus()
    if (isFile) input.click()
  }

  const classes = [styles.root, isSearch && styles.search, className].filter(Boolean).join(" ")

  return (
    <div
      className={classes}
      style={style}
      data-invalid={invalid || undefined}
      data-file={isFile || undefined}
      onMouseDown={focusInput}
    >
      {leading != null && (
        <span className={styles.icon} data-leading="" aria-hidden="true">
          {leading}
        </span>
      )}
      <input
        {...rest}
        ref={setRefs}
        id={id}
        type={isPassword && reveal ? "text" : type}
        className={styles.input}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (isFile) setFiles(Array.from(e.target.files ?? [], (f) => f.name).join(", "))
          setTyped(e.target.value.length > 0)
          onChange?.(e)
        }}
      />
      {isFile && (
        <span className={styles.fileText} data-placeholder={!files || undefined} aria-hidden="true">
          {files || placeholder}
        </span>
      )}
      {showClear && (
        <button type="button" className={styles.iconButton} aria-label={clearLabel} onClick={clear}>
          <X />
        </button>
      )}
      {isPassword && (
        <button
          type="button"
          className={styles.iconButton}
          aria-label={reveal ? hidePasswordLabel : showPasswordLabel}
          disabled={rest.disabled}
          onClick={() => setReveal(!reveal)}
        >
          {reveal ? <EyeOff /> : <Eye />}
        </button>
      )}
      {typeIcon && (
        <span className={styles.icon} aria-hidden="true">
          {typeIcon}
        </span>
      )}
    </div>
  )
}




/* ── type="time" — Figma Input time ──────────────────────────────────── */

/** Keeps only digits that can still form a valid hh:mm on a 12- or 24-hour clock, and inserts the colon. */
export function maskTime(text: string, hourCycle: 12 | 24 = 12) {
  const maxTens = hourCycle === 12 ? "1" : "2" // first hour digit
  const maxOnes = hourCycle === 12 ? "2" : "3" // second hour digit after a 1 (12h) or 2 (24h)
  let d = ""
  for (const c of text.replace(/\D/g, "")) {
    const next = d + c
    if (next.length === 1 && c > maxTens) d = "0" + c // 5 → 05
    else if (next.length === 2 && d === maxTens && c > maxOnes) continue // 13 (12h) / 24 (24h) is not an hour
    else if (next.length === 2 && hourCycle === 12 && d === "0" && c === "0") continue // 00 is not a 12-hour hour
    else if (next.length === 3 && c > "5") continue // minutes start 0–5
    else d = next
    if (d.length >= 4) break
  }
  return d.length > 2 ? `${d.slice(0, 2)}:${d.slice(2, 4)}` : d
}

function TimeInput(props: InputProps) {
  const {
    hourCycle = 12,
    period: periodProp,
    defaultPeriod = "AM",
    onPeriodChange,
    value: valueProp,
    defaultValue,
    onChange,
    placeholder = "11:00",
    className,
    style,
    disabled,
    ...rest
  } = props
  const [innerPeriod, setInnerPeriod] = useState(defaultPeriod)
  const period = periodProp ?? innerPeriod
  const [inner, setInner] = useState(maskTime(String(defaultValue ?? ""), hourCycle))
  const value = valueProp !== undefined ? String(valueProp) : inner
  const [focused, setFocused] = useState(false)

  const pick = (p: "AM" | "PM") => {
    if (periodProp === undefined) setInnerPeriod(p)
    onPeriodChange?.(p)
  }

  return (
    <div className={className ? `${styles.row} ${className}` : styles.row} style={style}>
      <InputBox
        {...(rest as InputProps)}
        type="text"
        clearable={false}
        inputMode="numeric"
        autoComplete="off"
        maxLength={5}
        disabled={disabled}
        value={value}
        // Figma: the example time while idle, the "_ _:_ _" mask while focused.
        placeholder={focused ? "_ _:_ _" : placeholder}
        onFocus={(e) => {
          setFocused(true)
          rest.onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          rest.onBlur?.(e)
        }}
        onChange={(e) => {
          e.target.value = maskTime(e.target.value, hourCycle)
          if (valueProp === undefined) setInner(e.target.value)
          onChange?.(e)
        }}
      />
      {hourCycle === 12 && (
        <div className={styles.period} role="radiogroup" aria-label="AM / PM" data-disabled={disabled || undefined}>
          {(["AM", "PM"] as const).map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={period === p}
              tabIndex={period === p ? 0 : -1}
              disabled={disabled}
              className={styles.periodOption}
              onClick={() => pick(p)}
              onKeyDown={(e) => {
                if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                  e.preventDefault()
                  const other = p === "AM" ? "PM" : "AM"
                  pick(other)
                  ;(e.currentTarget.parentElement?.querySelector(`[data-period="${other}"]`) as HTMLElement | null)?.focus()
                }
              }}
              data-period={p}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── type="tel" — Figma Input phone ──────────────────────────────────── */

/** Parse what is in the box for that country. */
export function readPhone(country: CountryCode, national: string): PhoneValue {
  const parsed = national.trim() ? parsePhoneNumberFromString(national, country) : undefined
  return {
    country,
    callingCode: getCountryCallingCode(country),
    national,
    e164: parsed?.number,
    valid: parsed?.isValid() ?? false,
  }
}

function PhoneInput(props: InputProps) {
  const {
    country: countryProp,
    defaultCountry = "US",
    onCountryChange,
    countries,
    preferredCountries = [],
    locale = "en",
    countryLabel = "Country code",
    onPhoneChange,
    value: valueProp,
    defaultValue,
    onChange,
    onBlur,
    placeholder = "123-456-789",
    className,
    style,
    disabled,
    ...rest
  } = props
  const [innerCountry, setInnerCountry] = useState<CountryCode>(defaultCountry)
  // Its own id — the surrounding Field's id belongs to the number input.
  const countryId = `${useId()}-country`
  const country = countryProp ?? innerCountry
  const [inner, setInner] = useState(String(defaultValue ?? ""))
  const value = valueProp !== undefined ? String(valueProp) : inner

  // Preferred first, then the rest by name in the chosen language.
  const names = new Intl.DisplayNames([locale], { type: "region" })
  const all = (countries ?? getCountries()).map((c) => ({ c, name: names.of(c) ?? c, code: getCountryCallingCode(c) }))
  const preferred = preferredCountries.flatMap((c) => all.filter((o) => o.c === c))
  const others = all.filter((o) => !preferredCountries.includes(o.c)).sort((a, b) => a.name.localeCompare(b.name, locale))

  const setValue = (text: string) => {
    if (valueProp === undefined) setInner(text)
  }

  return (
    <div className={className ? `${styles.row} ${styles.phone} ${className}` : `${styles.row} ${styles.phone}`} style={style}>
      {/* Figma Input phone: the select box shows "+82"; its list (Dropdown slot Type=phone number) shows "+82  대한민국". */}
      <Select
        id={countryId}
        className={styles.country}
        aria-label={countryLabel}
        options={[...preferred, ...others].map((o) => ({ value: o.c, label: o.name, code: `+${o.code}` }))}
        value={country}
        renderValue={(o) => o.code}
        disabled={disabled}
        onValueChange={(v) => {
          const next = v as CountryCode
          if (countryProp === undefined) setInnerCountry(next)
          onCountryChange?.(next)
          onPhoneChange?.(readPhone(next, value))
        }}
      />
      <InputBox
        {...(rest as InputProps)}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          onChange?.(e)
          onPhoneChange?.(readPhone(country, e.target.value))
        }}
        onBlur={(e) => {
          // Format for the country once typing is done (010-1234-5678, (201) 555-0123) — no caret jumps mid-edit.
          const formatted = e.target.value.trim() ? new AsYouType(country).input(e.target.value) : ""
          if (formatted !== e.target.value) {
            setValue(formatted)
            onPhoneChange?.(readPhone(country, formatted))
          }
          onBlur?.(e)
        }}
      />
    </div>
  )
}
