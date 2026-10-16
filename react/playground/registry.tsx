import type { ComponentType } from "react"

import type { Story } from "./controls/PropsPanel"
import { AvatarVariants } from "./demos/AvatarVariants"
import { BadgeVariants } from "./demos/BadgeVariants"
import { ButtonGroupVariants } from "./demos/ButtonGroupVariants"
import { CalendarVariants } from "./demos/CalendarVariants"
import { ChatboxVariants } from "./demos/ChatboxVariants"
import { ChipVariants } from "./demos/ChipVariants"
import { DialogVariants } from "./demos/DialogVariants"
import { InputVariants } from "./demos/InputVariants"
import { PaginationVariants } from "./demos/PaginationVariants"
import { ProgressVariants } from "./demos/ProgressVariants"
import { ButtonVariants } from "./demos/ButtonVariants"
import { CheckboxVariants } from "./demos/CheckboxVariants"
import { items as avatarReview } from "./review/AvatarReview"
import { items as badgeReview } from "./review/BadgeReview"
import { items as buttonGroupReview } from "./review/ButtonGroupReview"
import { items as calendarReview } from "./review/CalendarReview"
import { items as chatboxReview } from "./review/ChatboxReview"
import { items as chipReview } from "./review/ChipReview"
import { items as dialogReview } from "./review/DialogReview"
import { items as inputReview } from "./review/InputReview"
import { items as paginationReview } from "./review/PaginationReview"
import { items as progressReview } from "./review/ProgressReview"
import { items as buttonReview } from "./review/ButtonReview"
import { items as checkboxReview } from "./review/CheckboxReview"
import type { ReviewItem } from "./review/Review"
import { avatarStory } from "./stories/avatar"
import { badgeStory } from "./stories/badge"
import { buttonGroupStory } from "./stories/buttonGroup"
import { calendarStory } from "./stories/calendar"
import { chatboxStory } from "./stories/chatbox"
import { chipStory } from "./stories/chip"
import { dialogStory } from "./stories/dialog"
import { inputStory } from "./stories/input"
import { paginationStory } from "./stories/pagination"
import { progressStory } from "./stories/progress"
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
    id: "chatbox",
    name: "Chatbox",
    story: chatboxStory,
    Variants: ChatboxVariants,
    review: { items: chatboxReview, source: "react/src/components/Chatbox/Chatbox.yaml" },
  },
  {
    id: "checkbox",
    name: "Checkbox",
    story: checkboxStory,
    Variants: CheckboxVariants,
    review: { items: checkboxReview, source: "react/src/components/Checkbox/Checkbox.yaml" },
  },
  {
    id: "chip",
    name: "Chip",
    story: chipStory,
    Variants: ChipVariants,
    review: { items: chipReview, source: "react/src/components/Chip/Chip.yaml" },
  },
  {
    id: "input",
    name: "Input",
    story: inputStory,
    Variants: InputVariants,
    review: { items: inputReview, source: "react/src/components/Input/Input.yaml" },
  },
  {
    id: "pagination",
    name: "Pagination",
    story: paginationStory,
    Variants: PaginationVariants,
    review: { items: paginationReview, source: "react/src/components/Pagination/Pagination.yaml" },
  },
  {
    id: "dialog",
    name: "Dialog",
    story: dialogStory,
    Variants: DialogVariants,
    review: { items: dialogReview, source: "react/src/components/Dialog/Dialog.yaml" },
  },
  {
    id: "progress",
    name: "Progress",
    story: progressStory,
    Variants: ProgressVariants,
    review: { items: progressReview, source: "react/src/components/Progress/Progress.yaml" },
  },
]

export const pages = [
  { id: "playground", label: "Playground" },
  { id: "variants", label: "All variants" },
  { id: "review", label: "Review notes" },
] as const

export type PageId = (typeof pages)[number]["id"]
