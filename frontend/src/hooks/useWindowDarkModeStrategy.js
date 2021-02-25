import React, { useEffect, useMemo } from "react"
import { createMuiTheme, useMediaQuery } from "@material-ui/core"
import { themeConfiguration } from "../gatsby-theme-material-ui-top-layout/theme"

export default function useWindowDarkModeStrategy() {
  const light = "light"
  const dark = "dark"
  const isSSR = typeof window !== "undefined"

  const prefersDarkMode = useMediaQuery(`(prefers-color-scheme: ${dark})`)
  const initialState = isSSR ? light : prefersDarkMode ? dark : light
  const [paletteType, setPaletteType] = React.useState(initialState)

  useEffect(() => {
    setPaletteType(window.__theme)
    // This function will be responsible to render this again given the state update
    window.__onThemeChange = () => {
      console.log("OnThemeChange! " + window.__theme)
      setPaletteType(window.__theme)
    }
  }, [])

  return paletteType
}
