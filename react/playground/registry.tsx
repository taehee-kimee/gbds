import type { ComponentType } from "react"

import type { Story } from "./controls/PropsPanel"
import { ButtonVariants } from "./demos/ButtonVariants"
import { CheckboxVariants } from "./demos/CheckboxVariants"
import { items as buttonReview } from "./review/ButtonReview"
import { items as checkboxReview } from "./review/CheckboxReview"
import type { ReviewItem } from "./review/Review"
import { buttonStory } from "./stories/button"
import { checkboxStory } from "./stories/checkbox"

export type ComponentEntry = {
  /** URL segment and review file name (playground/reviews/{id}.json). */
  id: string
  name: string
  story: Story
  Variants: ComponentType
  review: { items: ReviewItem[]; source: string }
}

/** One entry per built component, in Figma page order. */
export const components: ComponentEntry[] = [
  {
    id: "button",
    name: "Button",
    story: buttonStory,
    Variants: ButtonVariants,
    review: { items: buttonReview, source: "react/src/components/Button/Button.md" },
  },
  {
    id: "checkbox",
    name: "Checkbox",
    story: checkboxStory,
    Variants: CheckboxVariants,
    review: { items: checkboxReview, source: "react/src/components/Checkbox/Checkbox.md" },
  },
]

export const pages = [
  { id: "playground", label: "Playground" },
  { id: "variants", label: "All variants" },
  { id: "review", label: "Review notes" },
] as const

export type PageId = (typeof pages)[number]["id"]
