import { useLayoutEffect, useRef, useState, type ComponentPropsWithRef, type MouseEventHandler } from "react"

import styles from "./Avatar.module.css"

type AvatarOwnProps = {
  /**
   * The person's or entity's name. It is the accessible name in every Type, and its first letter
   * (uppercased) is the Figma `Type=Initial` text. "" means no name: the icon shows and the avatar is
   * hidden from assistive technology. To hide a named avatar (name printed next to it), pass aria-hidden.
   */
  alt: string
  /** Figma `Type=Image`. While it loads, or if it fails, the initial (or icon) shows instead. */
  src?: string
  /** Figma `Style`. */
  shape?: "rounded" | "rectangle" | "circle"
}

/** No onClick: a picture — a <span role="img">. */
type StaticAvatarProps = Omit<ComponentPropsWithRef<"span">, "children"> & AvatarOwnProps & { onClick?: never }

/**
 * With onClick: the avatar is the control — a <button type="button"> named by alt
 * (e.g. opens the person's profile). alt="" needs an aria-label, since nothing else names it.
 */
type ClickableAvatarProps = Omit<ComponentPropsWithRef<"button">, "children"> &
  AvatarOwnProps & { onClick: MouseEventHandler<HTMLButtonElement> }

export type AvatarProps = StaticAvatarProps | ClickableAvatarProps

type ImageStatus = "loading" | "loaded" | "error"

export function Avatar(props: AvatarProps) {
  const { alt, src, shape = "rounded", className, ...rest } = props

  // Status belongs to one src: a new src starts over at "loading" without an effect.
  const [image, setImage] = useState<{ src?: string; status: ImageStatus }>({ src, status: "loading" })
  const status: ImageStatus = image.src === src ? image.status : "loading"
  const settle = (next: ImageStatus) => setImage({ src, status: next })

  // A cached image can finish before React attaches onLoad (e.g. after hydration).
  const imgRef = useRef<HTMLImageElement>(null)
  useLayoutEffect(() => {
    const img = imgRef.current
    if (img?.complete) settle(img.naturalWidth > 0 ? "loaded" : "error")
  }, [src])

  const initial = firstLetter(alt)
  const type = src && status === "loaded" ? "image" : initial ? "initial" : "icon"
  const decorative = alt === ""
  const clickable = props.onClick !== undefined

  // Same content either way; only the root element and its semantics change.
  const Root = (clickable ? "button" : "span") as "span"
  const semantics = clickable
    ? { type: "button", "aria-label": decorative ? undefined : alt }
    : { role: decorative ? undefined : "img", "aria-label": decorative ? undefined : alt, "aria-hidden": decorative || undefined }

  return (
    <Root
      {...semantics}
      {...(rest as ComponentPropsWithRef<"span">)}
      data-type={type}
      data-shape={shape}
      className={className ? `${styles.root} ${className}` : styles.root}
    >
      {type === "initial" && <span className={styles.initial}>{initial}</span>}
      {type === "icon" && (
        // lucide/user-filled — GB custom icon from the Figma Lucide Icons page.
        <svg className={styles.icon} viewBox="0 0 24 24">
          <path d="M12 13.8c3 0 9 1.5 9 4.5v1.1c0 .6-.5 1.1-1.1 1.1H4.1c-.6 0-1.1-.5-1.1-1.1v-1.1c0-3 6-4.5 9-4.5Zm0-11.3c2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5-4.5-2-4.5-4.5 2-4.5 4.5-4.5Z" />
        </svg>
      )}
      {src && status !== "error" && (
        <img
          ref={imgRef}
          className={styles.image}
          src={src}
          alt=""
          onLoad={() => settle("loaded")}
          onError={() => settle("error")}
        />
      )}
    </Root>
  )
}

/** The first letter of the name, uppercased — any script ("sam lee" → "S", "김태희" → "김"). */
function firstLetter(name: string) {
  return name.match(/\p{L}/u)?.[0]?.toLocaleUpperCase()
}
