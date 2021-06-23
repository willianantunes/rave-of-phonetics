import { wrapWithDarkThemeProvider } from "./src/contexts/dark-theme-context"
import { GeneralDataProtectionRegulationHandler } from "./src/config/gdpr-handler"
// https://www.gatsbyjs.com/plugins/gatsby-remark-lazy-load/
import "lazysizes"
// In order to fix reCAPTCHA z-index issue
import "./src/workaround.css"

export const wrapRootElement = wrapWithDarkThemeProvider

// https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/#onRouteUpdate
export const onRouteUpdate = () => {
  GeneralDataProtectionRegulationHandler.initializeGoogleTagManagerIfAllowed()
}
