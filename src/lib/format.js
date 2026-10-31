export const fmtTime = (t) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export function dayLabel(t) {
  const d = new Date(t), n = new Date()
  return d.toDateString() === n.toDateString() ? 'Today' : d.toLocaleDateString([], { day: 'numeric', month: 'short' })
}
