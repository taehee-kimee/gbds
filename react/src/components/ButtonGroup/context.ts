import { createContext } from "react"

/** Set by ButtonGroup; Button falls back to it when it has no `disabled` prop of its own. */
export const ButtonGroupContext = createContext<{ disabled?: boolean }>({})
