import React, { useEffect } from "react"
import { useMediaQuery } from "@material-ui/core"

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
    window.__onThemeChange = () => setPaletteType(window.__theme)
  }, [])

  return paletteType
}
