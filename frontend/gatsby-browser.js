import { wrapWithDarkThemeProvider } from "./src/contexts/dark-theme-context"
// https://www.gatsbyjs.com/plugins/gatsby-remark-lazy-load/
import "lazysizes"
// In order to fix reCAPTCHA z-index issue
import "./src/workaround.css"

export const wrapRootElement = wrapWithDarkThemeProvider
