const { EnvironmentError } = require("./exceps")

// Only statically analysable expressions are replaced by Webpack, thus I can't use process.env['ENV_NAME']
// https://github.com/webpack/webpack/issues/6091#issuecomment-350840578
function getEnvOrRaiseException(envName, envValue) {
  if (!envValue) throw new EnvironmentError(`Environment variable ${envName} is not set!`)

  return envValue
}

function evalEnvAsBoolean(envValue, standardValue = null) {
  if (!envValue && standardValue) return standardValue
  if (!envValue) return false

  const valueAsLowerCase = envValue.toLowerCase()
  const trueValues = ["true", "t", "y", "yes", "1"]
  return trueValues.includes(valueAsLowerCase)
}

function findValue(v1, v2) {
  return [v1, v2].filter(v => v)[0]
}

const REDUX_DEVELOPER_TOOLS = evalEnvAsBoolean(
  findValue(process.env.REDUX_DEVELOPER_TOOLS, process.env.GATSBY_REDUX_DEVELOPER_TOOLS),
  false
)

const SITE_URL = getEnvOrRaiseException("SITE_URL", findValue(process.env.SITE_URL, process.env.GATSBY_SITE_URL))
const RECAPTCHA_TOKEN_HEADER = getEnvOrRaiseException(
  "RECAPTCHA_TOKEN_HEADER",
  findValue(process.env.RECAPTCHA_TOKEN_HEADER, process.env.GATSBY_RECAPTCHA_TOKEN_HEADER)
)
const RECAPTCHA_SITE_KEY = getEnvOrRaiseException(
  "RECAPTCHA_SITE_KEY",
  findValue(process.env.RECAPTCHA_SITE_KEY, process.env.GATSBY_RECAPTCHA_SITE_KEY)
)
const RAVE_OF_PHONETICS_TRANSCRIBE_ENDPOINT = getEnvOrRaiseException(
  "RAVE_OF_PHONETICS_TRANSCRIBE_ENDPOINT",
  findValue(process.env.RAVE_OF_PHONETICS_TRANSCRIBE_ENDPOINT, process.env.GATSBY_RAVE_OF_PHONETICS_TRANSCRIBE_ENDPOINT)
)
const RAVE_OF_PHONETICS_SUGGESTION_ENDPOINT = getEnvOrRaiseException(
  "RAVE_OF_PHONETICS_SUGGESTION_ENDPOINT",
  findValue(process.env.RAVE_OF_PHONETICS_SUGGESTION_ENDPOINT, process.env.GATSBY_RAVE_OF_PHONETICS_SUGGESTION_ENDPOINT)
)

const GOOGLE_TAGMANAGER_ID = getEnvOrRaiseException(
  "GOOGLE_TAGMANAGER_ID",
  findValue(process.env.GOOGLE_TAGMANAGER_ID, process.env.GATSBY_GOOGLE_TAGMANAGER_ID)
)
const GTM_INCLUDE_DEVELOPMENT = process.env.GTM_INCLUDE_DEVELOPMENT === "true"
const GTM_STANDARD_EVENT_NAME = process.env.GTM_STANDARD_EVENT_NAME || "rop-fe"
const GTM_SHOW_WHAT_WOULD_BE_SENT = process.env.GTM_SHOW_WHAT_WOULD_BE_SENT === "true"

const NETLIFY_CMS_LOCAL_BACKEND = evalEnvAsBoolean(
  findValue(process.env.NETLIFY_CMS_LOCAL_BACKEND, process.env.GATSBY_NETLIFY_CMS_LOCAL_BACKEND),
  false
)
const NETLIFY_CMS_BACKEND_BRANCH = getEnvOrRaiseException(
  "NETLIFY_CMS_BACKEND_BRANCH",
  findValue(process.env.NETLIFY_CMS_BACKEND_BRANCH, process.env.GATSBY_NETLIFY_CMS_BACKEND_BRANCH)
)
const NETLIFY_CMS_BACKEND_API_ROOT = getEnvOrRaiseException(
  "NETLIFY_CMS_BACKEND_API_ROOT",
  findValue(process.env.NETLIFY_CMS_BACKEND_API_ROOT, process.env.GATSBY_NETLIFY_CMS_BACKEND_API_ROOT)
)
const NETLIFY_CMS_BACKEND_BASE_URL = getEnvOrRaiseException(
  "NETLIFY_CMS_BACKEND_BASE_URL",
  findValue(process.env.NETLIFY_CMS_BACKEND_BASE_URL, process.env.GATSBY_NETLIFY_CMS_BACKEND_BASE_URL)
)
const NETLIFY_CMS_BACKEND_AUTH_ENDPOINT = getEnvOrRaiseException(
  "NETLIFY_CMS_BACKEND_AUTH_ENDPOINT",
  findValue(process.env.NETLIFY_CMS_BACKEND_AUTH_ENDPOINT, process.env.GATSBY_NETLIFY_CMS_BACKEND_AUTH_ENDPOINT)
)
const NETLIFY_CMS_COMMIT_LABEL_PREFIX = getEnvOrRaiseException(
  "NETLIFY_CMS_COMMIT_LABEL_PREFIX",
  findValue(process.env.NETLIFY_CMS_COMMIT_LABEL_PREFIX, process.env.GATSBY_NETLIFY_CMS_COMMIT_LABEL_PREFIX)
)

module.exports = {
  REDUX_DEVELOPER_TOOLS,
  GOOGLE_TAGMANAGER_ID,
  GTM_STANDARD_EVENT_NAME,
  GTM_INCLUDE_DEVELOPMENT,
  GTM_SHOW_WHAT_WOULD_BE_SENT,
  SITE_URL,
  RECAPTCHA_TOKEN_HEADER,
  RECAPTCHA_SITE_KEY,
  RAVE_OF_PHONETICS_TRANSCRIBE_ENDPOINT,
  RAVE_OF_PHONETICS_SUGGESTION_ENDPOINT,
  NETLIFY_CMS_LOCAL_BACKEND,
  NETLIFY_CMS_BACKEND_BRANCH,
  NETLIFY_CMS_BACKEND_API_ROOT,
  NETLIFY_CMS_BACKEND_BASE_URL,
  NETLIFY_CMS_BACKEND_AUTH_ENDPOINT,
  NETLIFY_CMS_COMMIT_LABEL_PREFIX,
}
