import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Camera, MessageCircle, Send, ShieldCheck, Sparkles, ScanSearch, Heart, CheckCircle2, Search } from 'lucide-react'
import { Avatar } from '../components/ui'

const GUIDES = [
  { re: /whatsapp|message|reply|send|chat/, title: 'Send a message safely', page: 'whatsapp', cta: 'Open WhatsApp practice', steps: ['Open a practice chat.', 'Tap the message box and type a short reply.', 'Press the round send button.', 'Watch the ticks change: one means sent, two mean delivered.'] },
  { re: /photo|picture|image|attach|media/, title: 'Share a photo', page: 'photo', cta: 'Open the photo lesson', steps: ['Tap the paperclip beside the message box.', 'Choose Photos, Camera or a sample picture.', 'Preview it and add a caption.', 'Press Send. Nothing leaves this device.'] },
  { re: /scam|otp|password|safe|link|fraud|suspicious|check/, title: 'Check a suspicious message', page: 'scam', cta: 'Open Spot a scam', steps: ['Pause. Do not tap the link or reply.', 'Paste the message into the checker.', 'Read the warning signs it finds.', 'Verify through an official app or a number you trust.'] },
  { re: /setting|text size|font|voice|read aloud|bigger|louder/, title: 'Make Digital Dost easier to use', page: 'settings', cta: 'Open settings', steps: ['Open Settings.', 'Drag the text size slider.', 'Turn read-aloud on or off.', 'Changes are saved in this browser.'] },
]

const TOPICS = [
  { page: 'whatsapp', icon: MessageCircle, title: 'Practise a chat', text: 'Talk with practice contacts who reply in real time.', q: 'How do I send a WhatsApp message?', tone: 'a' },
  { page: 'photo', icon: Camera, title: 'Share a photo', text: 'Attach, preview, caption and send a picture.', q: 'How do I attach a photo?', tone: 'b' },
  { page: 'scam', icon: ScanSearch, title: 'Spot a scam', text: 'Paste any message and see if it is safe.', q: 'How can I spot a scam?', tone: 'c' },
]

const START = [
  'Assalam-o-alaikum! I’m your Digital Dost. We can practise everyday technology together, one small step at a time.',
  'What would you like help with today? Choose a guided topic or ask a question. There are no silly questions.',
]

export default function Home({ go, done, scamsChecked, reviewed, speakText }) {
  const [msgs, setMsgs] = useState(START.map((t) => ({ from: 'dost', text: t })))
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const end = useRef(null)
  const timer = useRef(null)
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [msgs, typing])
  useEffect(() => () => clearTimeout(timer.current), [])

  const ask = (text) => {
    const t = text.trim()
    if (!t) return
    setMsgs((m) => [...m, { from: 'me', text: t }])
    setDraft('')
    setTyping(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      const g = GUIDES.find((x) => x.re.test(t.toLowerCase()))
      const reply = g
        ? { from: 'dost', title: g.title, steps: g.steps, action: { label: g.cta, page: g.page } }
        : { from: 'dost', text: 'Of course. Let’s take it slowly. Tell me which part feels confusing and I’ll break it into smaller steps. You can practise here without a real account. Never share a real password, PIN or OTP.' }
      setMsgs((m) => [...m, reply])
      setTyping(false)
      if (g) speakText?.(`${g.title}. ${g.steps.join(' ')}`)
    }, 900)
  }

  return (
    <div className="page home">
      <header className="hero rise">
        <div>
          <span className="eyebrow"><Sparkles size={14} /> Welcome to your safe learning space</span>
          <h1>Technology, made <em>less confusing.</em></h1>
          <p>Learn everyday digital skills with patient, step-by-step practice. Start wherever you feel comfortable.</p>
          <div className="btn-row">
            <button className="btn btn-primary" onClick={() => go('whatsapp')}>Start practising <ArrowRight size={19} /></button>
            <button className="btn btn-glass" onClick={() => go('scam')}><ShieldCheck size={19} /> Check a message</button>
          </div>
        </div>
        <div className="hero-art glass" aria-hidden="true">
          <div className="mini-bubble in"><span /><span /></div>
          <div className="mini-bubble out"><span /></div>
          <div className="mini-shield"><ShieldCheck size={34} /></div>
          <div className="mini-photo"><Camera size={22} /></div>
        </div>
      </header>

      <div className="home-grid">
        <section className="companion glass rise d1" aria-label="Your Digital Dost">
          <header className="convo-head">
            <Avatar name="Digital Dost" glyph="د" hue={38} size={46} online />
            <div className="convo-title"><strong>Your Digital Dost</strong><small>Guided help · always patient</small></div>
            <span className="chip chip-sim"><ShieldCheck size={14} /> Safe practice</span>
          </header>
          <div className="convo-body" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className="msg-wrap">
                <div className={`bubble pop ${m.from === 'me' ? 'out' : 'in'}`}>
                  {m.title && <strong className="guide-title">{m.title}</strong>}
                  {m.text && <p>{m.text}</p>}
                  {m.steps && <ol className="guide-steps">{m.steps.map((s) => <li key={s}>{s}</li>)}</ol>}
                  {m.action && <button className="btn btn-primary small" onClick={() => go(m.action.page)}>{m.action.label} <ArrowRight size={16} /></button>}
                </div>
              </div>
            ))}
            {typing && <div className="bubble in typing pop"><i /><i /><i /></div>}
            <div ref={end} />
          </div>
          <form className="composer" onSubmit={(e) => { e.preventDefault(); ask(draft) }}>
            <Search size={20} className="composer-ico" />
            <input className="composer-input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask a question or choose a topic…" aria-label="Message your Digital Dost" />
            <button type="submit" className="send-btn" disabled={!draft.trim()} aria-label="Send question"><Send size={20} /></button>
          </form>
          <p className="convo-foot">Guided local help · no live AI service is connected · never enter real passwords or OTPs</p>
        </section>

        <aside className="topics rise d2">
          <h2>What would you like to learn?</h2>
          {TOPICS.map((t) => (
            <button key={t.page} className={`topic glass ${t.tone}`} onClick={() => { ask(t.q); }}>
              <span className="topic-ico"><t.icon size={26} /></span>
              <span><b>{t.title}</b><small>{t.text}</small></span>
              <ArrowRight size={20} className="go" />
            </button>
          ))}
        </aside>
      </div>

      <div className="stats rise d3">
        <div className="stat glass"><CheckCircle2 size={26} /><div><strong>{done}/4</strong><small>Skills practised</small></div></div>
        <div className="stat glass"><ScanSearch size={26} /><div><strong>{scamsChecked + reviewed}</strong><small>Messages checked</small></div></div>
        <div className="stat glass"><Heart size={26} /><div><strong>At your pace</strong><small>No deadlines, ever</small></div></div>
      </div>
    </div>
  )
}
