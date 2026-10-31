import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertOctagon, AlertTriangle, BadgeCheck, ClipboardPaste, Clock, Eye, Gift, Key, Link2, ScanSearch, ShieldCheck, ShieldQuestion, Sparkles, Trash2, TrendingUp, Type, User, Users, Wallet, ArrowRight, CheckCircle2, XCircle, Flag } from 'lucide-react'
import { analyzeMessage, SAMPLE_MESSAGES } from '../lib/scamEngine'
import { PageHead } from '../components/ui'

const ICONS = { key: Key, clock: Clock, alert: AlertTriangle, gift: Gift, wallet: Wallet, link: Link2, badge: BadgeCheck, users: Users, trend: TrendingUp, eye: Eye, user: User, type: Type }

const EXAMPLES = [
  { sender: 'Unknown number', title: 'Your account will close today', message: 'Your account will be blocked in 2 hours. Verify your details now using this link to avoid losing access.', answer: 'scam', reason: 'Urgent threats and unexpected verification links are common pressure tactics. Open the official app or website yourself instead of tapping a message link.' },
  { sender: 'Ayesha · Family', title: 'A family photo', message: 'Assalam-o-alaikum! I shared yesterday’s family photos in our family group. Have a look whenever you get time. ❤️', answer: 'safe', reason: 'This looks like an ordinary personal message and does not ask for secrets or money. Still, only open attachments you were expecting.' },
  { sender: 'Prize Centre', title: 'You won Rs. 50,000!', message: 'Congratulations! Send your CNIC number and bank OTP right now to claim your cash prize.', answer: 'scam', reason: 'Unexpected prizes and requests for OTPs or identity details are major warning signs. Never share an OTP, PIN or password.' },
  { sender: 'Delivery Support', title: 'Package delivery fee', message: 'Your parcel is on hold. Pay a small fee using this shortened link within 30 minutes.', answer: 'scam', reason: 'Unexpected payment requests, shortened links and artificial deadlines are warning signs. Check delivery status through the courier’s official website or app.' },
  { sender: 'Your cousin', title: 'A quick favour', message: 'Hi! I changed my phone number. Can you call me on this new number when you have a moment?', answer: 'safe', reason: 'This message does not request money or private information, but a changed number should still be verified using a contact method you already trust.' },
]

const VERDICT = {
  scam: { Icon: AlertOctagon, tone: 'bad', tag: 'High risk' },
  suspicious: { Icon: AlertTriangle, tone: 'warn', tag: 'Medium risk' },
  safe: { Icon: ShieldCheck, tone: 'good', tag: 'Low risk' },
}

function Highlighted({ text, ranges }) {
  if (!ranges.length) return <>{text}</>
  const out = []
  let pos = 0
  ranges.forEach(([s, e], i) => {
    if (s > pos) out.push(text.slice(pos, s))
    out.push(<mark key={i}>{text.slice(s, e)}</mark>)
    pos = e
  })
  if (pos < text.length) out.push(text.slice(pos))
  return <>{out}</>
}

function Gauge({ score, tone }) {
  const r = 52, c = 2 * Math.PI * r
  const [v, setV] = useState(0)
  useEffect(() => { const id = requestAnimationFrame(() => setV(score)); return () => cancelAnimationFrame(id) }, [score])
  return (
    <svg className={`gauge ${tone}`} viewBox="0 0 124 124" role="img" aria-label={`Risk score ${score} out of 100`}>
      <circle cx="62" cy="62" r={r} className="g-track" />
      <circle cx="62" cy="62" r={r} className="g-fill" strokeDasharray={c} strokeDashoffset={c - (c * v) / 100} transform="rotate(-90 62 62)" />
      <text x="62" y="60" textAnchor="middle" className="g-num">{score}</text>
      <text x="62" y="80" textAnchor="middle" className="g-sub">risk / 100</text>
    </svg>
  )
}

function Checker({ initial, onChecked }) {
  const [text, setText] = useState(initial || '')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [hint, setHint] = useState('')
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const run = (value = text) => {
    const r = analyzeMessage(value)
    if (!r.ok) { setResult(null); setHint('Please paste or type the whole message (at least a short sentence) so it can be checked.'); return }
    setHint(''); setResult(null); setBusy(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => { setResult(r); setBusy(false); onChecked() }, 900)
  }
  useEffect(() => { if (!initial) return; const id = setTimeout(() => run(initial), 0); return () => clearTimeout(id) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const paste = async () => {
    try { const t = await navigator.clipboard.readText(); if (t) { setText(t); run(t) } else setHint('Your clipboard is empty. Copy a message first.') }
    catch { setHint('Your browser did not allow pasting. Please long-press or press Ctrl+V in the box instead.') }
  }

  const V = result && VERDICT[result.verdict]
  return (
    <div className="checker-grid">
      <section className="glass panel check-input">
        <div className="panel-title"><ScanSearch size={22} /><div><h2>Paste a message</h2><span>Check any SMS, WhatsApp or email text</span></div></div>
        <label className="sr-only" htmlFor="scam-text">Message to check</label>
        <textarea id="scam-text" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => (e.ctrlKey || e.metaKey) && e.key === 'Enter' && run()} placeholder="Paste or type the message you received here…" rows={7} maxLength={1500} data-no-read />
        <div className="field-foot"><span>{text.length}/1500</span><span>Press Ctrl + Enter to check</span></div>
        {hint && <p className="hint" role="alert">{hint}</p>}
        <div className="btn-row">
          <button className="btn btn-primary" onClick={() => run()} disabled={busy}><ScanSearch size={19} /> {busy ? 'Checking…' : 'Check this message'}</button>
          <button className="btn btn-glass" onClick={paste}><ClipboardPaste size={19} /> Paste</button>
          <button className="btn btn-glass" onClick={() => { setText(''); setResult(null); setHint('') }} disabled={!text}><Trash2 size={19} /> Clear</button>
        </div>
        <div className="samples"><span><Sparkles size={16} /> Try an example</span>
          {SAMPLE_MESSAGES.map((s) => <button key={s.label} className="chip-btn" onClick={() => { setText(s.text); run(s.text) }}>{s.label}</button>)}
        </div>
        <p className="privacy"><ShieldCheck size={16} /> Checked on this device only. Your message is never uploaded. This is a rules-based helper, not a live AI.</p>
      </section>

      <section className="glass panel check-result" aria-live="polite">
        {busy && <div className="scanning"><div className="scan-line" /><ScanSearch size={40} /><strong>Looking for warning signs…</strong><span>Links, urgency, money, secret codes</span></div>}
        {!busy && !result && <div className="result-empty"><ShieldQuestion size={52} /><strong>Your result will appear here</strong><span>Paste a message and press “Check this message”.</span></div>}
        {!busy && result && (
          <div className={`result ${V.tone} rise`}>
            <div className="verdict">
              <Gauge score={result.score} tone={V.tone} />
              <div>
                <span className={`tag ${V.tone}`}><V.Icon size={16} /> {V.tag}</span>
                <h2>{result.title}</h2>
                <p>{result.summary}</p>
              </div>
            </div>
            <div className="preview"><h3>Your message</h3><blockquote><Highlighted text={result.text} ranges={result.highlights} /></blockquote></div>
            {result.hits.length > 0 && (
              <div className="signals"><h3>Warning signs found ({result.hits.length})</h3>
                <ul>{result.hits.map((h, i) => { const I = ICONS[h.icon] || AlertTriangle; return (
                  <li key={h.id} style={{ '--i': i }}><span className="sig-ico"><I size={20} /></span><div><b>{h.label}</b><span>{h.why}</span></div></li>) })}</ul>
              </div>)}
            <div className="next"><h3>What to do next</h3><ol>{result.steps.map((s) => <li key={s}>{s}</li>)}</ol></div>
          </div>
        )}
      </section>
    </div>
  )
}

function Practice({ onReviewed }) {
  const [i, setI] = useState(0)
  const [choice, setChoice] = useState('')
  const [shown, setShown] = useState(false)
  const ex = EXAMPLES[i]
  const right = choice === ex.answer
  return (
    <div className="practice-grid">
      <section className="glass panel">
        <div className="panel-title"><Flag size={22} /><div><h2>Practice example {i + 1} of {EXAMPLES.length}</h2><span>Fictional message · From: {ex.sender}</span></div></div>
        <h3 className="ex-title">{ex.title}</h3>
        <blockquote className="ex-msg read-me">{ex.message}</blockquote>
        <p className="q">What would you do with this message?</p>
        <div className="choices">
          <button className={choice === 'safe' ? 'choice sel' : 'choice'} onClick={() => { setChoice('safe'); setShown(false) }} aria-pressed={choice === 'safe'}><CheckCircle2 size={24} /><span><b>Looks safe</b><small>This seems like a normal message.</small></span></button>
          <button className={choice === 'scam' ? 'choice sel' : 'choice'} onClick={() => { setChoice('scam'); setShown(false) }} aria-pressed={choice === 'scam'}><AlertTriangle size={24} /><span><b>Suspicious</b><small>I would pause and check first.</small></span></button>
        </div>
        {!shown ? (
          <button className="btn btn-primary" disabled={!choice} onClick={() => { setShown(true); onReviewed() }}>Check my answer <ArrowRight size={18} /></button>
        ) : (
          <div className={right ? 'answer good pop' : 'answer warn pop'}>
            <strong>{right ? <><CheckCircle2 size={20} /> Well spotted!</> : <><XCircle size={20} /> Good try. Now you know what to look for.</>}</strong>
            <p>{ex.reason}</p>
            <button className="btn btn-glass" onClick={() => { setI((n) => (n + 1) % EXAMPLES.length); setChoice(''); setShown(false) }}>Next example <ArrowRight size={18} /></button>
          </div>
        )}
      </section>
      <aside className="glass panel reminders">
        <span className="eyebrow">Three reminders</span>
        <h2>Protect your information</h2>
        <ol>
          <li><b>Pause before you tap.</b><span>Urgent messages want you to rush.</span></li>
          <li><b>Keep secrets secret.</b><span>Never share an OTP, PIN or password.</span></li>
          <li><b>Verify independently.</b><span>Use a trusted number or official app.</span></li>
        </ol>
      </aside>
    </div>
  )
}

export default function Scam({ prefill, onChecked, onReviewed }) {
  const [tab, setTab] = useState('check')
  const key = useMemo(() => prefill?.stamp || 0, [prefill])
  return (
    <div className="page">
      <PageHead eyebrow="Stay safe online · learn the signs" title="Spot a" accent="scam">
        Paste any message and get an instant check, or practise with fictional examples.
      </PageHead>
      <div className="tabs glass rise d1" role="tablist" aria-label="Scam tools">
        <button role="tab" aria-selected={tab === 'check'} className={tab === 'check' ? 'tab on' : 'tab'} onClick={() => setTab('check')}><ScanSearch size={18} /> Check a message</button>
        <button role="tab" aria-selected={tab === 'practice'} className={tab === 'practice' ? 'tab on' : 'tab'} onClick={() => setTab('practice')}><Flag size={18} /> Practice examples</button>
      </div>
      <div className="rise d2">
        {tab === 'check' ? <Checker key={key} initial={prefill?.text} onChecked={onChecked} /> : <Practice onReviewed={onReviewed} />}
      </div>
    </div>
  )
}
