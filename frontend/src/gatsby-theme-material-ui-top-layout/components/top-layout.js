import React, { useMemo, useEffect, useState } from "react"
import Viewport from "gatsby-theme-material-ui-top-layout/src/components/viewport"
import { Provider } from "react-redux"
import CssBaseline from "@material-ui/core/CssBaseline"
import { createMuiTheme } from "@material-ui/core"
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components"
import { ThemeProvider as MuiThemeProvider } from "@material-ui/styles"
import createStore from "../../redux/store"
import { themeConfiguration } from "../theme"
import { useDarkThemeContext } from "../../contexts/dark-theme-context"

const store = createStore()

export default function TopLayout({ children, customStore }) {
  // https://material-ui.com/customization/palette/#user-preference
  const { paletteType } = useDarkThemeContext()

  const memoizedTheme = useMemo(() => {
    themeConfiguration.palette.type = paletteType
    return createMuiTheme(themeConfiguration)
  }, [paletteType])

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    // https://github.com/vercel/next.js/discussions/15003#discussioncomment-734715
    // https://www.joshwcomeau.com/react/the-perils-of-rehydration/#the-solution
    setMounted(true)
  }, [])

  return (
    <div key={String(mounted)}>
      <Provider store={customStore ? customStore : store}>
        <Viewport />
        <MuiThemeProvider theme={memoizedTheme}>
          {/* https://material-ui.com/guides/interoperability/#theme */}
          <StyledComponentsThemeProvider theme={memoizedTheme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {children}
          </StyledComponentsThemeProvider>
        </MuiThemeProvider>
      </Provider>
    </div>
  )
}
