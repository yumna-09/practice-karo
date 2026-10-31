import { Check, CheckCheck } from 'lucide-react'

export function Avatar({ name, hue = 38, size = 44, online, glyph }) {
  const initials = glyph || name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <span className="avatar" style={{ width: size, height: size, '--h': hue, fontSize: size * 0.38 }} aria-hidden="true">
      {initials}
      {online !== undefined && <i className={online ? 'dot online' : 'dot'} />}
    </span>
  )
}

export function Ticks({ status }) {
  if (status === 'sent') return <Check size={15} className="tick" aria-label="Sent" />
  if (status === 'delivered') return <CheckCheck size={15} className="tick" aria-label="Delivered" />
  if (status === 'read') return <CheckCheck size={15} className="tick read" aria-label="Read" />
  return null
}

export function PageHead({ eyebrow, title, accent, children }) {
  return (
    <header className="page-head rise">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title} <em>{accent}</em></h1>
      {children && <p>{children}</p>}
    </header>
  )
}
