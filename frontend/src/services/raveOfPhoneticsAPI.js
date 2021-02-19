import axios from "axios"
import { RECAPTCHA_TOKEN_HEADER, RAVE_OF_PHONETICS_TRANSCRIBE_ENDPOINT } from "../config/settings"

const options = {
  method: "POST",
  url: RAVE_OF_PHONETICS_TRANSCRIBE_ENDPOINT,
  timeout: 10 * 1000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json;charset=UTF-8",
  },
}

export async function transcribeText(text, language, withStress, token) {
  options.data = { text, language, "with-stress": withStress }
  options.headers = { ...options.headers, [RECAPTCHA_TOKEN_HEADER]: token }

  const response = await axios(options)

  return await response.data
}
