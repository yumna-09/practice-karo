import { Award, RotateCcw, ArrowRight, CheckCircle2 } from 'lucide-react'
import { PageHead } from '../components/ui'

import { MILESTONES } from '../lib/milestones'

export default function Progress({ milestones, scamsChecked, reviewed, go, reset }) {
  const done = milestones.length
  const pct = Math.round((done / MILESTONES.length) * 100)
  const r = 70, c = 2 * Math.PI * r, c2 = 2 * Math.PI * 44
  const bars = [{ label: 'Skills', value: done }, { label: 'Checked', value: scamsChecked }, { label: 'Reviewed', value: reviewed }]
  const maxBar = Math.max(4, ...bars.map((b) => b.value))
  return (
    <div className="page">
      <PageHead eyebrow="Your learning journey" title="Progress at" accent="your pace">Your activity is saved in this browser only. It is not synced between devices.</PageHead>
      <div className="progress-grid rise d1">
        <section className="glass panel ring-panel">
          <svg viewBox="0 0 180 180" className="ring" role="img" aria-label={`${done} of ${MILESTONES.length} skills practised`}>
            <circle cx="90" cy="90" r={r} className="g-track" />
            <circle cx="90" cy="90" r={r} className="g-fill good" strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100} transform="rotate(-90 90 90)" />
            <text x="90" y="88" textAnchor="middle" className="g-num big">{pct}%</text>
            <text x="90" y="112" textAnchor="middle" className="g-sub">{done} of {MILESTONES.length} skills</text>
          </svg>
          <div className="mini-stats">
            <div><strong>{scamsChecked}</strong><small>Messages checked</small></div>
            <div><strong>{reviewed}</strong><small>Examples reviewed</small></div>
          </div>
          {done === MILESTONES.length && <div className="win pop"><Award size={24} /><div><strong>All skills practised!</strong><span>Wonderful work. Keep revisiting any time.</span></div></div>}
        </section>
        <section className="glass panel">
          <div className="panel-title"><Award size={22} /><div><h2>Your skills</h2><span>Complete each one by trying it</span></div></div>
          <ul className="milestones">
            {MILESTONES.map((m) => {
              const ok = milestones.includes(m.id)
              return (
                <li key={m.id} className={ok ? 'ms ok' : 'ms'}>
                  <span className="ms-ico"><m.icon size={22} /></span>
                  <div><b>{m.title}</b><small>{m.text}</small></div>
                  {ok ? <span className="tag good"><CheckCircle2 size={16} /> Done</span> : <button className="btn btn-glass small" onClick={() => go(m.page)}>Try it <ArrowRight size={16} /></button>}
                </li>
              )
            })}
          </ul>
          <div className="btn-row">
            <button className="btn btn-primary" onClick={() => go('home')}>Back to home <ArrowRight size={18} /></button>
            <button className="btn btn-glass" onClick={reset}><RotateCcw size={18} /> Reset local progress</button>
          </div>
        </section>
      </div>
      <div className="charts rise d2">
        <section className="glass chart-card">
          <h3>Activity</h3><small>What you have practised so far</small>
          <div className="bars" role="img" aria-label={`Skills ${done}, messages checked ${scamsChecked}, examples reviewed ${reviewed}`}>
            {bars.map((b) => (
              <div className="bar" key={b.label}><b>{b.value}</b><i style={{ height: `${Math.max(4, (b.value / maxBar) * 100)}%` }} /><span>{b.label}</span></div>
            ))}
          </div>
        </section>
        <section className="glass chart-card">
          <h3>Skills split</h3><small>Done and still to try</small>
          <div className="donut">
            <svg viewBox="0 0 120 120" role="img" aria-label={`${done} done, ${MILESTONES.length - done} to go`}>
              <circle cx="60" cy="60" r="44" fill="none" stroke="rgba(124,108,92,0.22)" strokeWidth="16" />
              <circle cx="60" cy="60" r="44" fill="none" stroke="var(--mint)" strokeWidth="16" strokeLinecap="round" strokeDasharray={c2} strokeDashoffset={c2 - (c2 * pct) / 100} transform="rotate(-90 60 60)" style={{ transition: 'stroke-dashoffset .8s' }} />
            </svg>
            <ul className="legend"><li><i style={{ background: 'var(--mint)' }} /> Done: {done}</li><li><i style={{ background: 'rgba(124,108,92,0.4)' }} /> To go: {MILESTONES.length - done}</li></ul>
          </div>
        </section>
        <section className="glass chart-card" style={{ gridColumn: '1 / -1' }}>
          <h3>Skill by skill</h3><small>Tick off each one to fill its bar</small>
          {MILESTONES.map((m) => <div key={m.id}><span>{m.title}</span><div className="hbar"><span style={{ width: milestones.includes(m.id) ? '100%' : '6%' }} /></div></div>)}
        </section>
      </div>
    </div>
  )
}
