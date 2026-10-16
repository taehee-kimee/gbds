import "@gb/tokens/fonts.css"
import "@gb/tokens/tokens.css"
import "./playground.css"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { Shell } from "./shell/Shell"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Shell />
  </StrictMode>
)
