// https://www.gatsbyjs.com/plugins/gatsby-remark-lazy-load/
import "lazysizes"
// Custom
import "./src/workaround.css"
import { wrapperRecaptcha } from "./src/config/wrapper-recaptcha"
import "./src/config/dark-mode-strategy"

export const wrapRootElement = ({ element }) => {
  return wrapperRecaptcha({ siteKey: process.env.RECAPTCHA_SITE_KEY, element })
}
