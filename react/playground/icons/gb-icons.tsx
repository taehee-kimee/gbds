import * as lucide from "lucide-react"
import { createElement, type ComponentType, type ReactElement } from "react"

import { figmaIconNames, figmaIconSets } from "./figma-icons"

type Icon = ComponentType<{ size?: number; strokeWidth?: number }>

const namespace = lucide as unknown as Record<string, Icon | undefined>

/** "lucide/calendar check" → "CalendarCheck" */
const toPascal = (figma: string) =>
  figma
    .replace(/^lucide\//, "")
    .trim()
    .split(/[\s-]+/)
    .map((w) => w[0]!.toUpperCase() + w.slice(1))
    .join("")

/**
 * The GB icon set (Figma page 📐 Lucide Icons) as INSTANCE_SWAP options, keyed by Figma name, in canvas order.
 * Only icons that exist in lucide-react — those are what code can import. Figma-only and brand icons are left out.
 */
export const gbIconOptions: Record<string, ReactElement> = Object.fromEntries(
  figmaIconNames.flatMap((name) => {
    if (figmaIconSets[name]) return []
    const component = namespace[toPascal(name)]
    return component ? [[name, createElement(component)]] : []
  })
)
