import { GTM_STANDARD_EVENT_NAME } from "../config/settings"

export function dispatchEvent({ category, action, label, event = GTM_STANDARD_EVENT_NAME }) {
  window.dataLayer.push({
    event,
    category,
    action,
    label,
  })
}
