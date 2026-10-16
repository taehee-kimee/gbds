import { useCallback, useEffect, useId, useRef, type ComponentPropsWithRef, type ReactNode, type Ref } from "react"

import { Button } from "../Button"
import { ButtonGroup } from "../ButtonGroup"
import styles from "./Dialog.module.css"

export type DialogProps = Omit<ComponentPropsWithRef<"dialog">, "title" | "open" | "children" | "onCancel"> & {
  /** Shown as a modal while true. The dialog has no trigger — the parent decides when it opens. */
  open: boolean
  /**
   * true (default) — centred over a backdrop, the page behind inert and not scrollable.
   * false — shown in place in the page flow, no backdrop (inline confirmations, previews).
   */
  modal?: boolean
  /** Called with false when the dialog asks to close: Cancel, Confirm, or Escape. */
  onOpenChange?: (open: boolean) => void
  /** Figma `Type`. warning — red border and title. */
  variant?: "notification" | "warning"
  /** Figma `-> Title`. The dialog's accessible name. */
  title: ReactNode
  /** Figma `-> Description` (`Description` boolean). The dialog's accessible description. */
  description?: ReactNode
  /** Figma `-> Leading Icon` (`Leading Icon` boolean). A lucide icon; takes the title colour. */
  icon?: ReactNode
  /** Figma `Checkbox` — e.g. <Checkbox variant="mute">Do not ask again.</Checkbox>, above the buttons. */
  checkbox?: ReactNode
  /**
   * Figma `Button` (Button group Type=confirm). Leave out for Cancel + Confirm, pass your own Buttons
   * to replace them, or `null` for none.
   */
  actions?: ReactNode
  /** Default Confirm button. The dialog closes after it runs. */
  onConfirm?: () => void
  /** Default Cancel button and Escape. The dialog closes after it runs. */
  onCancel?: () => void
  confirmLabel?: ReactNode
  cancelLabel?: ReactNode
}

export function Dialog(props: DialogProps) {
  const {
    open,
    modal = true,
    onOpenChange,
    variant = "notification",
    title,
    description,
    icon,
    checkbox,
    actions,
    onConfirm,
    onCancel,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    className,
    ref,
    onClose,
    ...rest
  } = props

  const id = useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const dialogRef = useRef<HTMLDialogElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  // close() calls made here, so their (async) close events are not reported as the user closing it.
  const ownCloses = useRef(0)

  const setRefs = useCallback(
    (node: HTMLDialogElement | null) => {
      dialogRef.current = node
      assignRef(ref, node)
    },
    [ref]
  )

  // The native <dialog> gives the modal behaviour: top layer, inert page, focus kept inside, Escape.
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (el.open && (!open || el.matches(":modal") !== modal)) {
      ownCloses.current++
      el.close()
    }
    if (open && !el.open) {
      if (modal) {
        el.showModal()
        // Start on the least destructive choice — Cancel — when the default buttons show.
        cancelRef.current?.focus()
      } else {
        // Not show(): that moves focus into the dialog, and an inline one should not take focus from the page.
        el.setAttribute("open", "")
      }
    }
  }, [open, modal])

  // The page behind does not scroll while the dialog is open.
  useEffect(() => {
    if (!open || !modal) return
    const root = document.documentElement
    const before = root.style.overflow
    root.style.overflow = "hidden"
    return () => {
      root.style.overflow = before
    }
  }, [open, modal])

  const cancel = () => {
    onCancel?.()
    onOpenChange?.(false)
  }
  const confirm = () => {
    onConfirm?.()
    onOpenChange?.(false)
  }

  return (
    <dialog
      role="alertdialog"
      aria-modal={modal || undefined}
      aria-labelledby={titleId}
      aria-describedby={description != null ? descriptionId : undefined}
      {...rest}
      ref={setRefs}
      data-variant={variant}
      data-modal={modal || undefined}
      className={className ? `${styles.root} ${className}` : styles.root}
      // Escape: stay controlled — close through onOpenChange, not natively.
      onCancel={(e) => {
        e.preventDefault()
        cancel()
      }}
      // The browser closed it anyway (e.g. a second Escape) — tell the parent.
      onClose={(e) => {
        onClose?.(e)
        if (ownCloses.current > 0) ownCloses.current--
        else onOpenChange?.(false)
      }}
    >
      <div className={styles.text}>
        <div className={styles.header}>
          {icon != null && (
            <span className={styles.icon} aria-hidden="true">
              {icon}
            </span>
          )}
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
        </div>
        {description != null && (
          <p id={descriptionId} className={styles.description}>
            {description}
          </p>
        )}
      </div>
      {(checkbox != null || actions !== null) && (
        <div className={styles.footer}>
          {checkbox}
          {actions !== null &&
            (actions !== undefined ? (
              actions
            ) : (
              <ButtonGroup>
                <Button ref={cancelRef} variant="outline" onClick={cancel}>
                  {cancelLabel}
                </Button>
                <Button onClick={confirm}>{confirmLabel}</Button>
              </ButtonGroup>
            ))}
        </div>
      )}
    </dialog>
  )
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") ref(value)
  else if (ref) ref.current = value
}
