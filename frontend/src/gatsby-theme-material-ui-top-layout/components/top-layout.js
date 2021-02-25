import React from "react"
import { ThemeProvider } from "styled-components"
import { Provider } from "react-redux"
import CssBaseline from "@material-ui/core/CssBaseline"
import { ThemeProvider as MuiThemeProvider } from "@material-ui/styles"
import Viewport from "gatsby-theme-material-ui-top-layout/src/components/viewport"
import createStore from "../../redux/store"
import { createMuiTheme } from "@material-ui/core"
import { themeConfiguration } from "../theme"
import useWindowDarkModeStrategy from "../../hooks/useWindowDarkModeStrategy"

const store = createStore()

export default function TopLayout({ children, theme: ignored, customStore }) {
  // https://material-ui.com/customization/palette/#user-preference
  const paletteType = useWindowDarkModeStrategy()

  const theme = React.useMemo(() => {
    themeConfiguration.palette.type = paletteType
    return createMuiTheme(themeConfiguration)
  }, [paletteType])

  return (
    <>
      <Provider store={customStore ? customStore : store}>
        <Viewport />
        <MuiThemeProvider theme={theme}>
          {/* https://material-ui.com/guides/interoperability/#theme */}
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {children}
          </ThemeProvider>
        </MuiThemeProvider>
      </Provider>
    </>
  )
}
