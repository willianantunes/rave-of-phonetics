import axios from "axios"

const tokenHeader = process.env.RECAPTCHA_TOKEN_HEADER
const endpoint = process.env.RAVE_OF_PHONETICS_TRANSCRIBE_ENDPOINT
const options = {
  method: "POST",
  url: endpoint,
  timeout: 10 * 1000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json;charset=UTF-8",
  },
}

export async function transcribeText(text, language, withStress, token) {
  options.data = { text, language, "with-stress": withStress }
  options.headers = { ...options.headers, [tokenHeader]: token }

  const response = await axios(options)

  return await response.data
}
