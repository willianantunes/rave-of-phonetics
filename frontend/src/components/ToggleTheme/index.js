import React, { useEffect, useState } from "react"
import * as S from "./styled"
import { dispatchEvent } from "../../analytics"
import { Helmet } from "react-helmet/es/Helmet"
import {
  paletteTypeDark,
  paletteTypeLight,
  paletteTypeLocalStorageKey,
  useDarkThemeContext,
} from "../../contexts/dark-theme-context"

const trackClick = darkThemeUsed => {
  dispatchEvent({
    category: "Theme",
    action: `changed to dark: ${darkThemeUsed}`,
  })
}

export default function ToggleTheme() {
  const { paletteType, setPaletteType } = useDarkThemeContext()
  const [isDarkMode, setIsDarkMode] = useState(null)

  function evaluateCurrentTheme() {
    const evaluation = paletteType === paletteTypeDark
    setIsDarkMode(evaluation)
    return evaluation
  }

  function toggleTheme() {
    const newTheme = paletteType === paletteTypeLight ? paletteTypeDark : paletteTypeLight
    setPaletteType(newTheme)
    try {
      localStorage.setItem(paletteTypeLocalStorageKey, newTheme)
    } catch (exceptionToBeIgnored) {}
  }

  useEffect(() => {
    evaluateCurrentTheme()
  }, [paletteType])

  const onClick = () => {
    toggleTheme()
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
