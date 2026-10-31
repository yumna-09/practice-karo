import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const scamExamples = [
  { sender: 'Unknown number', title: 'Your account will close today', message: 'Your account will be blocked in 2 hours. Verify your details now using this link to avoid losing access.', answer: 'scam', reason: 'Urgent threats and unexpected verification links are common pressure tactics. Open the official app or website yourself instead of tapping a message link.' },
  { sender: 'Ayesha · Family', title: 'A family photo', message: 'Assalam-o-alaikum! I shared yesterday’s family photos in our family group. Have a look whenever you get time. ❤️', answer: 'safe', reason: 'This looks like an ordinary personal message and does not ask for secrets or money. Still, only open attachments you were expecting.' },
  { sender: 'Prize Centre', title: 'You won Rs. 50,000!', message: 'Congratulations! Send your CNIC number and bank OTP right now to claim your cash prize.', answer: 'scam', reason: 'Unexpected prizes and requests for OTPs or identity details are major warning signs. Never share an OTP, PIN or password.' },
]

const starterMessages = [
  { from: 'dost', text: 'Assalam-o-alaikum! 🌿 I’m your Digital Dost. We can practise everyday technology together, one small step at a time.' },
  { from: 'dost', text: 'What would you like help with today? You can ask me anything — there are no silly questions.' },
]

function detectSpeechLanguage(text) {
  if (/[\u0600-\u06FF]/.test(text)) return 'ur-PK'
  const romanUrdu = /\b(kaise|kesay|kese|kya|kyun|hai|hain|mein|mujhe|ap|aap|acha|theek|shukriya|assalam|walaikum|krna|karna|karo|batao|samajh|nahi|nahin|mera|meri|aapko|chahiye)\b/i
  return romanUrdu.test(text) ? 'en-PK' : 'en-US'
}

function App() {
  const [page, setPage] = useState('home')
  const [messages, setMessages] = useState(starterMessages)
  const [draft, setDraft] = useState('')
  const [autoRead, setAutoRead] = useState(true)
  const [speechState, setSpeechState] = useState('idle')
  const [completed, setCompleted] = useState(() => Number(localStorage.getItem('dd-completed') || 0))
  const [scamsReviewed, setScamsReviewed] = useState(() => Number(localStorage.getItem('dd-scams') || 0))
  const [scamIndex, setScamIndex] = useState(0)
  const [choice, setChoice] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [toast, setToast] = useState('')
  const [guidePrompt, setGuidePrompt] = useState('')
  const hoverTimer = useRef(null)
  const lastSpoken = useRef('')
  const toastTimer = useRef(null)

  useEffect(() => { localStorage.setItem('dd-completed', String(completed)) }, [completed])
  useEffect(() => { localStorage.setItem('dd-scams', String(scamsReviewed)) }, [scamsReviewed])

  const speak = (text) => {
    if (!autoRead || !('speechSynthesis' in window) || !text?.trim()) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text.trim())
    utterance.lang = detectSpeechLanguage(text)
    utterance.rate = 0.88
    utterance.pitch = 1
    const voices = window.speechSynthesis.getVoices()
    const prefix = utterance.lang.slice(0, 2)
    const voice = voices.find((item) => item.lang.toLowerCase().startsWith(prefix))
    if (voice) utterance.voice = voice
    utterance.onstart = () => setSpeechState('speaking')
    utterance.onend = () => setSpeechState('idle')
    utterance.onerror = () => setSpeechState('idle')
    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    const readTarget = (target) => {
      const element = target?.closest?.('[data-read], h1, h2, h3, p, label, .chat-bubble, .lesson-card, .quick-action, .scam-message')
      if (!element || element.closest('input, textarea, select, [data-no-read]')) return
      const text = element.getAttribute('data-read') || element.innerText
      if (!text?.trim() || text.trim() === lastSpoken.current) return
      lastSpoken.current = text.trim()
      speak(text)
    }
    const onPointerOver = (event) => {
      if (!autoRead) return
      const element = event.target?.closest?.('[data-read], h1, h2, h3, p, label, .chat-bubble, .lesson-card, .quick-action, .scam-message')
      if (!element || element.contains(event.relatedTarget)) return
      window.clearTimeout(hoverTimer.current)
      hoverTimer.current = window.setTimeout(() => readTarget(element), 650)
    }
    const onPointerOut = () => window.clearTimeout(hoverTimer.current)
    const onFocus = (event) => readTarget(event.target)
    document.addEventListener('pointerover', onPointerOver)
    document.addEventListener('pointerout', onPointerOut)
    document.addEventListener('focusin', onFocus)
    return () => {
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('pointerout', onPointerOut)
      document.removeEventListener('focusin', onFocus)
      window.clearTimeout(hoverTimer.current)
      window.speechSynthesis?.cancel()
    }
  }, [autoRead])

  const notify = (message) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2600)
  }

  const respond = (text) => {
    const lower = text.toLowerCase()
    let answer = 'Of course. Let’s take it slowly. Tell me which part feels confusing, and I’ll explain it in a simpler way. You can practise here without connecting a real account.'
    if (/whatsapp|message|reply|send/.test(lower)) answer = 'To send a message: tap the message box, type a short reply, then press the green Send button. This is only a practice chat — nothing goes to a real person.'
    else if (/photo|picture|image/.test(lower)) answer = 'In a real chat, you would use the attachment or plus button to choose a photo. In our safe demo, try the WhatsApp Practice section. No personal photo is uploaded.'
    else if (/scam|otp|password|safe|link/.test(lower)) answer = 'Pause before tapping. Never share an OTP, PIN or password. Be careful with urgent threats, unexpected prizes and links from unknown people. If unsure, contact the person through a number you already trust.'
    else if (/urdu|roman/.test(lower)) answer = 'You can write in English, Urdu or Roman Urdu. I can read text aloud using the voices available on your device. Speech pronunciation may vary by browser and installed voices.'
    setMessages((items) => [...items, { from: 'me', text }, { from: 'dost', text: answer }])
    setDraft('')
  }

  const askQuick = (text) => {
    setGuidePrompt(text)
    respond(text)
  }

  const finishScam = () => {
    if (!choice) return
    setRevealed(true)
    setScamsReviewed((n) => n + 1)
  }

  const nextScam = () => {
    setScamIndex((n) => (n + 1) % scamExamples.length)
    setChoice('')
    setRevealed(false)
  }

  const completePractice = () => {
    setCompleted((n) => Math.min(n + 1, 3))
    notify('Well done! Your practice progress is saved on this device.')
  }

  const currentScam = scamExamples[scamIndex]
  const navItems = useMemo(() => [
    { id: 'home', icon: '⌂', label: 'My Digital Dost' },
    { id: 'whatsapp', icon: '◉', label: 'WhatsApp practice' },
    { id: 'scams', icon: '◇', label: 'Scam detective' },
    { id: 'progress', icon: '▥', label: 'My progress' },
  ], [])

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setPage('home')} aria-label="Digital Dost home">
          <span className="brand-mark">د</span><span className="brand-name">digital dost<small>Your friendly learning companion</small></span>
        </button>
        <div className="side-caption">YOUR SPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item) => <button key={item.id} className={page === item.id ? 'nav-link active' : 'nav-link'} onClick={() => setPage(item.id)}><span className="nav-icon">{item.icon}</span>{item.label}</button>)}
        </nav>
        <div className="sidebar-note"><span className="leaf">✳</span><strong>Learning has no age.</strong><p>Take your time. Every small step counts.</p></div>
        <div className="profile-row"><div className="profile-avatar">Y</div><div><strong>My learning space</strong><small>Safe practice mode</small></div><span className="profile-menu">•••</span></div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="crumb">A little help, whenever you need it <span>·</span> <b>{navItems.find((item) => item.id === page)?.label}</b></div>
          <div className="top-controls">
            <span className="safe-label"><i /> Practice only · No real accounts</span>
            <div className="read-controls" data-no-read>
              <button className={autoRead ? 'read-toggle enabled' : 'read-toggle'} onClick={() => { setAutoRead((v) => !v); window.speechSynthesis?.cancel(); setSpeechState('idle') }} aria-pressed={autoRead}><span>◖))</span> Read aloud {autoRead ? 'On' : 'Off'}</button>
              <button className="read-icon" onClick={() => { if (speechState === 'speaking') { window.speechSynthesis.pause(); setSpeechState('paused') } else if (speechState === 'paused') { window.speechSynthesis.resume(); setSpeechState('speaking') } }} title="Pause or resume speech" aria-label="Pause or resume speech">Ⅱ</button>
              <button className="read-icon" onClick={() => { window.speechSynthesis?.cancel(); setSpeechState('idle'); lastSpoken.current = '' }} title="Stop reading" aria-label="Stop reading">■</button>
            </div>
          </div>
        </header>

        {page === 'home' && <section className="content chat-home">
          <div className="welcome-line"><div><div className="eyebrow">WELCOME TO YOUR SAFE LEARNING SPACE</div><h1>Assalam-o-alaikum. <em>How can I help?</em></h1><p>Ask a question, explore a practice activity, or simply say hello. We’ll figure it out together.</p></div><div className="welcome-badge"><span>✳</span><small>One step<br/>at a time</small></div></div>
          <div className="chat-layout">
            <section className="conversation-panel">
              <div className="conversation-head"><div className="dost-avatar">د</div><div><strong>Your Digital Dost</strong><small><i /> Here to help · Patiently, always</small></div><span className="secure-chip">✦ Safe space</span></div>
              <div className="conversation-body" aria-live="polite">
                {messages.map((message, index) => <div key={index} className={'message-row ' + (message.from === 'me' ? 'user-row' : '')}><div className={message.from === 'me' ? 'message-avatar user-avatar' : 'message-avatar'}>{message.from === 'me' ? 'Y' : 'د'}</div><div className="message-stack"><span className="message-name">{message.from === 'me' ? 'You' : 'Digital Dost'}</span><div className="chat-bubble">{message.text}</div></div></div>)}
              </div>
              <form className="message-composer" onSubmit={(event) => { event.preventDefault(); if (draft.trim()) respond(draft.trim()) }}>
                <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Type in English, Urdu or Roman Urdu..." aria-label="Message your Digital Dost" />
                <button type="submit" disabled={!draft.trim()} aria-label="Send message">Send <span>➤</span></button>
              </form>
              <div className="composer-foot"><span>↳ You can ask in your own words. No passwords or OTPs, please.</span><span>Demo companion · Predefined guidance</span></div>
            </section>
            <aside className="companion-side">
              <div className="side-card guide-card"><div className="card-kicker">NOT SURE WHERE TO START?</div><h2>I'm right here<br/><em>with you.</em></h2><p>Choose a question and I’ll guide you through it, one step at a time.</p><div className="quick-actions"><button className="quick-action" onClick={() => askQuick('How do I send a WhatsApp message?')}><span>◉</span><b>Send a message</b><i>→</i></button><button className="quick-action" onClick={() => askQuick('How do I send a photo?')}><span>▧</span><b>Share a photo</b><i>→</i></button><button className="quick-action" onClick={() => askQuick('How can I spot a scam?')}><span>◇</span><b>Stay safe online</b><i>→</i></button></div></div>
              <div className="side-card practice-card"><div className="practice-card-top"><span>YOUR NEXT LITTLE WIN</span><span>✳</span></div><h3>Practise without pressure.</h3><p>Try a pretend WhatsApp conversation or learn to spot suspicious messages.</p><button onClick={() => setPage('whatsapp')}>Explore practice <b>→</b></button></div>
            </aside>
          </div>
          <div className="bottom-stats"><div><span className="stat-symbol">✓</span><strong>{completed}/3</strong><small>Practice sessions</small></div><div><span className="stat-symbol peach">◇</span><strong>{scamsReviewed}</strong><small>Messages reviewed</small></div><div><span className="stat-symbol blue">♡</span><strong>At your pace</strong><small>No deadlines, ever</small></div></div>
        </section>}

        {page === 'whatsapp' && <section className="content activity-content">
          <div className="page-heading"><div className="eyebrow">LEARN BY DOING · SAFE SIMULATION</div><h1>Let's practise <em>WhatsApp.</em></h1><p>Reply to a pretend message. Nothing is sent to a real person.</p></div>
          <div className="activity-grid"><section className="activity-panel"><div className="activity-top"><span className="step-pill">STEP 01</span><div><strong>Your practice task</strong><small>Reply to Ayesha and try sending a message.</small></div><span className="demo-chip">DEMO CHAT</span></div><div className="mock-chat"><div className="mock-chat-head"><div className="contact-avatar">A</div><div><strong>Ayesha</strong><small>Practice contact · Simulated</small></div><span>•••</span></div><div className="mock-chat-body"><div className="date-chip">TODAY</div><div className="mock-bubble">Assalam-o-alaikum! How are you today?<small>10:30</small></div><div className="mock-bubble outgoing">Wa-alaikum-assalam! I am doing well, thank you. 😊<small>10:31 ✓✓</small></div><div className="mock-bubble">Could you send me the family photo from yesterday?<small>10:32</small></div></div><form className="mock-composer" onSubmit={(event) => { event.preventDefault(); if (draft.trim()) { setMessages((items) => [...items, { from: 'me', text: draft.trim() }]); setDraft(''); notify('Your practice reply was added to the learning chat.') } }}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a pretend reply..." aria-label="Write a pretend WhatsApp reply"/><button type="submit" disabled={!draft.trim()}>Send</button></form></div><button className="finish-button" onClick={completePractice}>✓ I finished practising</button></section><aside className="activity-panel tips-panel"><div className="dost-avatar">د</div><div className="eyebrow">A LITTLE GUIDANCE</div><h2>Take your time.</h2><p>Try typing a friendly reply. You can make mistakes here — that’s how we learn.</p><div className="tip-box"><strong>Need an idea?</strong><button onClick={() => setDraft('Wa-alaikum-assalam! I will send it in a moment.')}>Use a sample reply <span>→</span></button></div><div className="safety-note">🔒 This is a simulated chat. It does not connect to WhatsApp or your contacts.</div></aside></div>
        </section>}

        {page === 'scams' && <section className="content activity-content"><div className="page-heading"><div className="eyebrow">STAY SAFE ONLINE · LEARN THE SIGNS</div><h1>Can you spot <em>the scam?</em></h1><p>Look closely at this pretend message. What would you do?</p></div><div className="activity-grid scam-grid"><section className="activity-panel scam-panel"><div className="activity-top"><span className="step-pill">EXAMPLE {scamIndex + 1} / {scamExamples.length}</span><strong>Message preview</strong><span className="demo-chip">FICTIONAL</span></div><div className="sender-line"><div className="contact-avatar">{currentScam.sender[0]}</div><div><strong>{currentScam.sender}</strong><small>Unknown sender · Just now</small></div></div><h2>{currentScam.title}</h2><div className="scam-message">{currentScam.message}</div><p className="question">What do you think — is this message safe?</p><div className="answer-options"><button className={choice === 'safe' ? 'answer-option selected' : 'answer-option'} onClick={() => { setChoice('safe'); setRevealed(false) }}>✓ <span><b>Looks safe</b><small>This seems like a normal message.</small></span></button><button className={choice === 'scam' ? 'answer-option selected risky' : 'answer-option'} onClick={() => { setChoice('scam'); setRevealed(false) }}>⚑ <span><b>It's a scam</b><small>Something feels suspicious.</small></span></button></div>{!revealed ? <button className="solid-button" disabled={!choice} onClick={finishScam}>Check my answer <span>→</span></button> : <div className={choice === currentScam.answer ? 'result-box correct' : 'result-box'}><strong>{choice === currentScam.answer ? '✓ Well spotted!' : 'Good try — now you know what to look for.'}</strong><p>{currentScam.reason}</p><button onClick={nextScam}>Next example →</button></div>}</section><aside className="activity-panel tips-panel safety-tips"><div className="eyebrow">KEEP THESE IN MIND</div><h2>Three gentle reminders.</h2><ol><li><b>Pause before you tap.</b><span>Urgent messages want you to rush.</span></li><li><b>Keep secrets secret.</b><span>Never share an OTP, PIN or password.</span></li><li><b>Check who sent it.</b><span>Use a trusted number to verify.</span></li></ol><div className="safety-note">Your safety matters more than a quick reply.</div></aside></div></section>}

        {page === 'progress' && <section className="content activity-content"><div className="page-heading"><div className="eyebrow">LOOK HOW FAR YOU'VE COME</div><h1>Your progress, <em>your pace.</em></h1><p>Small steps add up. Your demo progress is saved on this device.</p></div><div className="progress-grid"><div className="progress-tile"><span>✓</span><strong>{completed} / 3</strong><small>Practice sessions completed</small></div><div className="progress-tile"><span>◇</span><strong>{scamsReviewed}</strong><small>Scam examples reviewed</small></div><div className="progress-tile"><span>♡</span><strong>Keep going</strong><small>There is no rush to learn</small></div></div><button className="solid-button" onClick={() => setPage('home')}>Back to my Digital Dost →</button></section>}
      </main>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}

export default App
