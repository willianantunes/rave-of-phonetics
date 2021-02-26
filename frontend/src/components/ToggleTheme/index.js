import React, { useEffect, useState } from "react"
import * as S from "./styled"
import { Helmet } from "react-helmet/es/Helmet"
import { dispatchEvent } from "../../analytics"

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

    if (window && window.DISQUS !== undefined) {
      window.setTimeout(() => window.DISQUS.reset({ reload: true }), 600)
    }
  }

  return (
    <S.ToggleTheme data-testid="button-toggle-theme" active={isDarkMode} onClick={onClick}>
      <S.ToggleThemeTrack />
    </S.ToggleTheme>
  )
}
