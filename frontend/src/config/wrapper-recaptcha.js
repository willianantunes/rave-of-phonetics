import React from "react"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"

export const wrapperRecaptcha = ({ siteKey, element }) => {
  return <GoogleReCaptchaProvider reCaptchaKey={siteKey}>{element}</GoogleReCaptchaProvider>
}
