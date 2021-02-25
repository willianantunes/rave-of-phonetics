import { GTM_STANDARD_EVENT_NAME, GTM_INCLUDE_DEVELOPMENT } from "../config/settings"

export function dispatchEvent({ category, action, label, event = GTM_STANDARD_EVENT_NAME }) {
  const dataToBePushed = {
    event,
    category,
    action,
    label,
  }

  if (GTM_INCLUDE_DEVELOPMENT === false) {
    console.log(`If GTM was enabled, that would be pushed: ${dataToBePushed}`)
  } else {
    window.dataLayer.push(dataToBePushed)
  }
}
