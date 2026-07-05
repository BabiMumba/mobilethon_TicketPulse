/** Broadcast when the events catalogue changes (create, etc.). */
export function notifyEventsChanged() {
  window.dispatchEvent(new Event('tp:events-changed'))
}

export const EVENTS_CHANGED = 'tp:events-changed'
