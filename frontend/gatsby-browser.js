import { RECAPTCHA_SITE_KEY } from "./src/config/settings"
// https://www.gatsbyjs.com/plugins/gatsby-remark-lazy-load/
import "lazysizes"
// Custom
import "./src/workaround.css"
import { wrapperRecaptcha } from "./src/config/wrapper-recaptcha"
import { wrapWithDarkThemeProvider } from "./src/contexts/dark-theme-context"

export const wrapRootElement = ({ element }) => {
  return wrapWithDarkThemeProvider({ element: wrapperRecaptcha({ siteKey: RECAPTCHA_SITE_KEY, element }) })
}
