import { GTM_STANDARD_EVENT_NAME, GTM_SHOW_WHAT_WOULD_BE_SENT } from "../config/settings"

export function dispatchEvent({ category, action, label, event = GTM_STANDARD_EVENT_NAME }) {
  const dataToBePushed = {
    event,
    category,
    action,
    label,
  }

  if (GTM_SHOW_WHAT_WOULD_BE_SENT === true) {
    console.log(`If GTM was enabled, that would be pushed: ${JSON.stringify(dataToBePushed)}`)
  }

  if (window.dataLayer) window.dataLayer.push(dataToBePushed)
}
