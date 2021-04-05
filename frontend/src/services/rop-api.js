import axios from "axios"
import {
  RECAPTCHA_TOKEN_HEADER,
  RAVE_OF_PHONETICS_TRANSCRIBE_ENDPOINT,
  RAVE_OF_PHONETICS_SUGGESTION_ENDPOINT,
} from "../config/settings"

const options = {
  method: "POST",
  timeout: 15 * 1000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json;charset=UTF-8",
  },
}

export async function transcribe(words, language, token) {
  options.url = RAVE_OF_PHONETICS_TRANSCRIBE_ENDPOINT
  options.data = { words, language }
  options.headers = { ...options.headers, [RECAPTCHA_TOKEN_HEADER]: token }

  const response = await axios(options)

  return await response.data
}

export async function suggest(wordOrSymbol, phonemic, phonetic, explanation, languageTag, token) {
  options.url = RAVE_OF_PHONETICS_SUGGESTION_ENDPOINT
  options.data = {
    word_or_symbol: wordOrSymbol,
    ipa_phonemic: phonemic,
    ipa_phonetic: phonetic,
    explanation,
    language_tag: languageTag,
  }
  options.headers = { ...options.headers, [RECAPTCHA_TOKEN_HEADER]: token }

  try {
    const response = await axios(options)
    return await response.data
  } catch (error) {
    const isErrorRelatedToServer = error.response
    if (isErrorRelatedToServer) {
      const statusCode = error.response.status
      if (statusCode === 400) {
        const errorDetails = error.response.data
        // ["At least one IPA transcription field should be provided", "Language tag not supported"]
        const errors = Object.values(errorDetails).flat()
        throw new InvalidRequestError(errors)
      }
      if (statusCode === 403) {
        const errorDetails = error.response.data
        throw new NotAuthorizedError(errorDetails)
      }
      throw new UnexpectedServerError(`${statusCode}: ${error.response.statusText}`)
    }
    throw new UnexpectedRequestError(error.message)
  }
}

export class InvalidRequestError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
  }
}

export class UnexpectedServerError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
  }
}

export class UnexpectedRequestError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
  }
}

export class NotAuthorizedError extends Error {
  constructor(message) {
    super(message)
    this.name = this.constructor.name
  }
}
