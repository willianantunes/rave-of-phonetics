import React, { useEffect, useState } from "react"
import * as S from "./styled"
import { dispatchEvent } from "../../analytics"
import { Helmet } from "react-helmet/es/Helmet"

const trackClick = darkThemeUsed => {
  dispatchEvent({
    category: "Theme",
    action: `changed to dark: ${darkThemeUsed}`,
  })
}

export default function ToggleTheme() {
  const paletteTypeDark = "dark"
  const [isDarkMode, setIsDarkMode] = useState(null)

  function evaluateCurrentTheme() {
    const evaluation = window.__theme === paletteTypeDark
    setIsDarkMode(evaluation)
    return evaluation
  }

  useEffect(() => {
    evaluateCurrentTheme()
  }, [])

  const onClick = () => {
    // Please see dark-mode-strategy.js to understand what is going on
    window.__toggleTheme()
    trackClick(evaluateCurrentTheme())
  }

  return (
    <S.ToggleTheme data-testid="button-toggle-theme" active={isDarkMode} onClick={onClick}>
      <Helmet>
        <body className={isDarkMode ? "theme-dark" : "theme-light"} />
      </Helmet>
      <S.ToggleThemeTrack />
    </S.ToggleTheme>
  )
}
