import { wrapWithDarkThemeProvider } from "./src/contexts/dark-theme-context"
import { GeneralDataProtectionRegulationHandler } from "./src/config/gdpr-handler"
// https://www.gatsbyjs.com/plugins/gatsby-remark-lazy-load/
import "lazysizes"
import "./src/layout.css"
// https://www.gatsbyjs.com/docs/how-to/styling/using-web-fonts/#self-host-google-fonts-with-fontsource
// https://www.gatsbyjs.com/docs/recipes/styling-css/#using-google-fonts
import "@fontsource/arvo"

export const wrapRootElement = wrapWithDarkThemeProvider

// https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/#onRouteUpdate
export const onRouteUpdate = () => {
  GeneralDataProtectionRegulationHandler.initializeGoogleTagManagerIfAllowed()
}
