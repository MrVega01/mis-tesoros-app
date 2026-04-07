export function makeLocalDate (hours, minutes = 0) {
  const d = new Date()
  d.setHours(hours, minutes, 0, 0)
  return d
}

export function dateToIsoTime (date) {
  const h = String(date.getUTCHours()).padStart(2, '0')
  const m = String(date.getUTCMinutes()).padStart(2, '0')
  return `${h}:${m}:00Z`
}

export function isoTimeToDate (isoTime) {
  if (!isoTime) return null
  const withoutZ = isoTime.endsWith('Z') ? isoTime.slice(0, -1) : isoTime
  const [h, m] = withoutZ.split(':').map(Number)
  const d = new Date()
  d.setUTCHours(h, m, 0, 0)
  return d
}

export function formatDisplayTime (date) {
  if (!date) return '--:--'
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
