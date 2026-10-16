import type { ComponentType } from "react"

import type { Story } from "./controls/PropsPanel"
import { AvatarVariants } from "./demos/AvatarVariants"
import { BadgeVariants } from "./demos/BadgeVariants"
import { ButtonGroupVariants } from "./demos/ButtonGroupVariants"
import { CalendarVariants } from "./demos/CalendarVariants"
import { ButtonVariants } from "./demos/ButtonVariants"
import { CheckboxVariants } from "./demos/CheckboxVariants"
import { items as avatarReview } from "./review/AvatarReview"
import { items as badgeReview } from "./review/BadgeReview"
import { items as buttonGroupReview } from "./review/ButtonGroupReview"
import { items as calendarReview } from "./review/CalendarReview"
import { items as buttonReview } from "./review/ButtonReview"
import { items as checkboxReview } from "./review/CheckboxReview"
import type { ReviewItem } from "./review/Review"
import { avatarStory } from "./stories/avatar"
import { badgeStory } from "./stories/badge"
import { buttonGroupStory } from "./stories/buttonGroup"
import { calendarStory } from "./stories/calendar"
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
    id: "avatar",
    name: "Avatar",
    story: avatarStory,
    Variants: AvatarVariants,
    review: { items: avatarReview, source: "react/src/components/Avatar/Avatar.yaml" },
  },
  {
    id: "badge",
    name: "Badge",
    story: badgeStory,
    Variants: BadgeVariants,
    review: { items: badgeReview, source: "react/src/components/Badge/Badge.yaml" },
  },
  {
    id: "button",
    name: "Button",
    story: buttonStory,
    Variants: ButtonVariants,
    review: { items: buttonReview, source: "react/src/components/Button/Button.yaml" },
  },
  {
    id: "button-group",
    name: "Button Group",
    story: buttonGroupStory,
    Variants: ButtonGroupVariants,
    review: { items: buttonGroupReview, source: "react/src/components/ButtonGroup/ButtonGroup.yaml" },
  },
  {
    id: "calendar",
    name: "Calendar",
    story: calendarStory,
    Variants: CalendarVariants,
    review: { items: calendarReview, source: "react/src/components/Calendar/Calendar.yaml" },
  },
  {
    id: "checkbox",
    name: "Checkbox",
    story: checkboxStory,
    Variants: CheckboxVariants,
    review: { items: checkboxReview, source: "react/src/components/Checkbox/Checkbox.yaml" },
  },
]

export const pages = [
  { id: "playground", label: "Playground" },
  { id: "variants", label: "All variants" },
  { id: "review", label: "Review notes" },
] as const

export type PageId = (typeof pages)[number]["id"]
