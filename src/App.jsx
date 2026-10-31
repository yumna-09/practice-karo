import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const scamExamples = [
  { sender: 'Unknown number', title: 'Your account will close today', message: 'Your account will be blocked in 2 hours. Verify your details now using this link to avoid losing access.', answer: 'scam', reason: 'Urgent threats and unexpected verification links are common pressure tactics. Open the official app or website yourself instead of tapping a message link.' },
  { sender: 'Ayesha · Family', title: 'A family photo', message: 'Assalam-o-alaikum! I shared yesterday’s family photos in our family group. Have a look whenever you get time. ❤️', answer: 'safe', reason: 'This looks like an ordinary personal message and does not ask for secrets or money. Still, only open attachments you were expecting.' },
  { sender: 'Prize Centre', title: 'You won Rs. 50,000!', message: 'Congratulations! Send your CNIC number and bank OTP right now to claim your cash prize.', answer: 'scam', reason: 'Unexpected prizes and requests for OTPs or identity details are major warning signs. Never share an OTP, PIN or password.' },
  { sender: 'Delivery Support', title: 'Package delivery fee', message: 'Your parcel is on hold. Pay a small fee using this shortened link within 30 minutes.', answer: 'scam', reason: 'Unexpected payment requests, shortened links and artificial deadlines are warning signs. Check delivery status through the courier’s official website or app.' },
  { sender: 'Your cousin', title: 'A quick favour', message: 'Hi! I changed my phone number. Can you call me on this new number when you have a moment?', answer: 'safe', reason: 'This message does not request money or private information, but a changed number should still be verified using a contact method you already trust.' },
]

const starterMessages = [
  { from: 'dost', text: 'Assalam-o-alaikum! I’m your Digital Dost. We can practise everyday technology together, one small step at a time.' },
  { from: 'dost', text: 'What would you like help with today? Choose a guided topic or ask a question. There are no silly questions.' },
]

const guidance = [
  { match: /whatsapp|message|reply|send/, title: 'Send a message safely', steps: ['Open the practice conversation.', 'Select the message box at the bottom.', 'Type a short reply in your own words.', 'Select Send. Your practice message stays inside this demo.'] },
  { match: /photo|picture|image|attach/, title: 'Share a photo in practice', steps: ['Open WhatsApp Practice.', 'Select the attachment icon beside the message box.', 'Choose a sample image from your device if you wish.', 'Preview it before selecting Add to practice chat. No image is uploaded to a server.'] },
  { match: /scam|otp|password|safe|link|fraud/, title: 'Check a suspicious message', steps: ['Pause. Do not tap the link or reply immediately.', 'Look for pressure, prizes, unusual requests or spelling mistakes.', 'Never share an OTP, PIN, password or banking details.', 'Verify through an official app, website or trusted phone number.'] },
  { match: /setting|text size|font|voice|read aloud/, title: 'Make Digital Dost easier to use', steps: ['Open Settings from the navigation.', 'Choose a comfortable text size and colour theme.', 'Set read-aloud preferences.', 'Changes are saved in this browser on this device.'] },
]

const romanUrdu = {
  'Assalam-o-alaikum! I’m your Digital Dost. We can practise everyday technology together, one small step at a time.': 'Assalam-o-alaikum! Main aap ka Digital Dost hoon. Hum rozmarra technology mil kar, aik aik qadam seekh sakte hain.',
  'What would you like help with today? Choose a guided topic or ask a question. There are no silly questions.': 'Aaj aap kis cheez mein madad chahtay hain? Koi topic chunein ya sawal poochein. Yahan koi sawal ghalat nahi hota.',
  'Send a message safely': 'Mehfooz tareeqay se message bhejein',
  'Check a suspicious message': 'Mashkook message ko check karein',
  'Make Digital Dost easier to use': 'Digital Dost ko istemal karna asaan banayein',
  'Pause before you tap.': 'Click karne se pehle ruk kar sochein.',
  'Never share an OTP, PIN or password.': 'Apna OTP, PIN ya password kabhi kisi ko na batayein.',
}

function safeNumber(key, fallback) {
  try {
    const value = Number(localStorage.getItem(key))
    return Number.isFinite(value) && value >= 0 ? value : fallback
  } catch { return fallback }
}

function App() {
  const [page, setPage] = useState('home')
  const [messages, setMessages] = useState(starterMessages)
  const [draft, setDraft] = useState('')
  const [autoRead, setAutoRead] = useState(true)
  const [speechState, setSpeechState] = useState('idle')
  const [speechLanguage, setSpeechLanguage] = useState('en')
  const [speechRate, setSpeechRate] = useState('normal')
  const [voiceName, setVoiceName] = useState('')
  const [voices, setVoices] = useState([])
  const [theme, setTheme] = useState(() => localStorage.getItem('dd-theme') || 'light')
  const [textSize, setTextSize] = useState(() => localStorage.getItem('dd-text-size') || 'large')
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('dd-contrast') === 'true')
  const [reducedMotion, setReducedMotion] = useState(() => localStorage.getItem('dd-motion') === 'true')
  const [completed, setCompleted] = useState(() => safeNumber('dd-completed', 0))
  const [scamsReviewed, setScamsReviewed] = useState(() => safeNumber('dd-scams', 0))
  const [scamIndex, setScamIndex] = useState(0)
  const [choice, setChoice] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [toast, setToast] = useState('')
  const [guidePrompt, setGuidePrompt] = useState('')
  const [attachment, setAttachment] = useState(null)
  const [practiceReplies, setPracticeReplies] = useState([])
  const hoverTimer = useRef(null)
  const lastSpoken = useRef('')
  const toastTimer = useRef(null)
  const fileInput = useRef(null)

  useEffect(() => { localStorage.setItem('dd-completed', String(completed)) }, [completed])
  useEffect(() => { localStorage.setItem('dd-scams', String(scamsReviewed)) }, [scamsReviewed])
  useEffect(() => {
    localStorage.setItem('dd-theme', theme)
    localStorage.setItem('dd-text-size', textSize)
    localStorage.setItem('dd-contrast', String(highContrast))
    localStorage.setItem('dd-motion', String(reducedMotion))
  }, [theme, textSize, highContrast, reducedMotion])

  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices())
    loadVoices()
    window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices)
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', loadVoices)
  }, [])

  const speak = (text) => {
    if (!autoRead || !('speechSynthesis' in window) || !text?.trim()) return
    const phrase = speechLanguage === 'roman' ? (romanUrdu[text.trim()] || text.trim()) : text.trim()
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(phrase)
    utterance.lang = speechLanguage === 'roman' ? 'en-PK' : 'en-US'
    utterance.rate = speechRate === 'slow' ? 0.72 : speechRate === 'fast' ? 1 : 0.86
    utterance.pitch = 1
    const selected = voices.find((voice) => voice.name === voiceName)
    const preferred = voices.find((voice) => voice.lang.toLowerCase().startsWith(speechLanguage === 'roman' ? 'en' : 'en'))
    if (selected || preferred) utterance.voice = selected || preferred
    utterance.onstart = () => setSpeechState('speaking')
    utterance.onend = () => setSpeechState('idle')
    utterance.onerror = () => setSpeechState('idle')
    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    const selector = '[data-read], h1, h2, h3, p, label, .chat-bubble, .quick-action, .scam-message, .step-list li'
    const readTarget = (target) => {
      const element = target?.closest?.(selector)
      if (!element || element.closest('input, textarea, select, button[data-no-read]')) return
      const text = element.getAttribute('data-read') || element.innerText
      if (!text?.trim() || text.trim() === lastSpoken.current) return
      lastSpoken.current = text.trim()
      speak(text)
    }
    const onPointerOver = (event) => {
      if (!autoRead) return
      const element = event.target?.closest?.(selector)
      if (!element || element.contains(event.relatedTarget)) return
      window.clearTimeout(hoverTimer.current)
      hoverTimer.current = window.setTimeout(() => readTarget(element), 700)
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
  }, [autoRead, speechLanguage, speechRate, voiceName, voices])

  const notify = (message) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 3000)
  }

  const respond = (text) => {
    const lower = text.toLowerCase()
    const match = guidance.find((item) => item.match.test(lower))
    const answer = match
      ? `Here is a simple guide: ${match.title}. ${match.steps.map((step, index) => `${index + 1}. ${step}`).join(' ')}`
      : 'Of course. Let’s take it slowly. Tell me which part feels confusing, and I’ll break it into smaller steps. You can practise here without connecting a real account. Never share a real password, PIN or OTP.'
    setMessages((items) => [...items, { from: 'me', text }, { from: 'dost', text: answer }])
    setDraft('')
    setGuidePrompt('')
  }

  const askQuick = (text) => { setGuidePrompt(text); respond(text) }
  const finishScam = () => { if (!choice) return; setRevealed(true); setScamsReviewed((n) => n + 1) }
  const nextScam = () => { setScamIndex((n) => (n + 1) % scamExamples.length); setChoice(''); setRevealed(false) }
  const completePractice = () => { setCompleted((n) => Math.min(n + 1, 3)); notify('Practice completed. Your progress is saved in this browser.') }
  const currentScam = scamExamples[scamIndex]
  const navItems = useMemo(() => [
    { id: 'home', icon: '⌂', label: 'Home' },
    { id: 'whatsapp', icon: '◉', label: 'WhatsApp practice' },
    { id: 'scams', icon: '◇', label: 'Scam detective' },
    { id: 'progress', icon: '▥', label: 'My progress' },
    { id: 'settings', icon: '⚙', label: 'Settings' },
  ], [])

  const addAttachment = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { notify('Please choose an image file.'); return }
    if (file.size > 5 * 1024 * 1024) { notify('Choose an image smaller than 5 MB.'); return }
    const reader = new FileReader()
    reader.onload = () => setAttachment({ name: file.name, url: reader.result })
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const sendPractice = (event) => {
    event.preventDefault()
    if (draft.trim()) { setPracticeReplies((items) => [...items, { type: 'text', text: draft.trim() }]); setDraft('') }
    else if (attachment) { setPracticeReplies((items) => [...items, { type: 'image', ...attachment }]); setAttachment(null) }
    else return
    notify('Added to this simulated practice conversation. Nothing was sent externally.')
  }

  return (
    <div className={`app-shell theme-${theme} text-${textSize} ${highContrast ? 'high-contrast' : ''} ${reducedMotion ? 'reduced-motion' : ''}`}>
      <aside className="sidebar">
        <button className="brand" onClick={() => setPage('home')} aria-label="Digital Dost home">
          <span className="brand-mark">د</span><span className="brand-name">Digital Dost<small>Learn. Practise. Feel confident.</small></span>
        </button>
        <div className="side-caption">LEARNING SPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item) => <button key={item.id} className={page === item.id ? 'nav-link active' : 'nav-link'} onClick={() => setPage(item.id)}><span className="nav-icon">{item.icon}</span>{item.label}</button>)}
        </nav>
        <div className="sidebar-note"><span className="leaf">✳</span><strong>Learning has no age.</strong><p>Take your time. Every small step counts.</p></div>
        <div className="profile-row"><div className="profile-avatar">D</div><div><strong>Guest learning space</strong><small>Progress saved on this device</small></div></div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="crumb">Your friendly digital learning space <span>·</span> <b>{navItems.find((item) => item.id === page)?.label}</b></div>
          <div className="top-controls">
            <span className="safe-label"><i /> SIMULATED PRACTICE · NO REAL ACCOUNTS</span>
            <div className="read-controls" data-no-read>
              <button className={autoRead ? 'read-toggle enabled' : 'read-toggle'} onClick={() => { setAutoRead((v) => !v); window.speechSynthesis?.cancel(); setSpeechState('idle') }} aria-pressed={autoRead}>◖)) Read aloud {autoRead ? 'On' : 'Off'}</button>
              <button className="read-icon" onClick={() => { if (speechState === 'speaking') { window.speechSynthesis.pause(); setSpeechState('paused') } else if (speechState === 'paused') { window.speechSynthesis.resume(); setSpeechState('speaking') } }} aria-label="Pause or resume speech" title="Pause or resume">Ⅱ</button>
              <button className="read-icon" onClick={() => { window.speechSynthesis?.cancel(); setSpeechState('idle'); lastSpoken.current = '' }} aria-label="Stop speech" title="Stop">■</button>
            </div>
          </div>
        </header>

        {page === 'home' && <section className="content">
          <div className="welcome-line"><div><div className="eyebrow">WELCOME TO YOUR SAFE LEARNING SPACE</div><h1>Technology, made <em>less confusing.</em></h1><p>Learn everyday digital skills with patient, step-by-step practice. Start wherever you feel comfortable.</p></div><div className="welcome-badge"><span>✳</span><small>One step<br/>at a time</small></div></div>
          <div className="home-grid">
            <section className="conversation-panel">
              <div className="conversation-head"><div className="dost-avatar">د</div><div><strong>Your Digital Dost</strong><small><i /> Guided help · Available whenever you practise</small></div><span className="secure-chip">SAFE PRACTICE</span></div>
              <div className="conversation-body" aria-live="polite">
                {messages.map((message, index) => <div key={index} className={'message-row ' + (message.from === 'me' ? 'user-row' : '')}><div className={message.from === 'me' ? 'message-avatar user-avatar' : 'message-avatar'}>{message.from === 'me' ? 'Y' : 'د'}</div><div className="message-stack"><span className="message-name">{message.from === 'me' ? 'You' : 'Digital Dost'}</span><div className="chat-bubble">{message.text}</div></div></div>)}
              </div>
              <form className="message-composer" onSubmit={(event) => { event.preventDefault(); if (draft.trim()) respond(draft.trim()) }}>
                <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask a question or choose a guided topic..." aria-label="Message your Digital Dost" />
                <button type="submit" disabled={!draft.trim()}>Send <span>➤</span></button>
              </form>
              <div className="composer-foot"><span>Guided local help · No live AI service is connected</span><span>Never enter real passwords or OTPs</span></div>
            </section>
            <aside className="companion-side">
              <div className="side-card guide-card"><div className="card-kicker">START WITH A GUIDED TOPIC</div><h2>What would you<br/>like to <em>learn?</em></h2><p>Choose a task and follow clear steps at your own pace.</p><div className="quick-actions"><button className="quick-action" onClick={() => askQuick('How do I send a WhatsApp message?')}><span>◉</span><b>Send a message</b><i>→</i></button><button className="quick-action" onClick={() => askQuick('How do I attach a photo?')}><span>▧</span><b>Share a photo</b><i>→</i></button><button className="quick-action" onClick={() => askQuick('How can I spot a scam?')}><span>◇</span><b>Spot a scam</b><i>→</i></button></div></div>
              <div className="side-card practice-card"><div className="practice-card-top"><span>YOUR NEXT LITTLE WIN</span><span>✳</span></div><h3>Practise without pressure.</h3><p>Try a pretend conversation or learn to recognise suspicious messages.</p><button onClick={() => setPage('whatsapp')}>Explore practice <b>→</b></button></div>
            </aside>
          </div>
          <div className="bottom-stats"><div><span className="stat-symbol">✓</span><strong>{completed}/3</strong><small>Practice sessions</small></div><div><span className="stat-symbol peach">◇</span><strong>{scamsReviewed}</strong><small>Messages reviewed</small></div><div><span className="stat-symbol blue">♡</span><strong>At your pace</strong><small>No deadlines, ever</small></div></div>
        </section>}

        {page === 'whatsapp' && <section className="content activity-content">
          <div className="page-heading"><div className="eyebrow">LEARN BY DOING · SAFE SIMULATION</div><h1>Practise a <em>conversation.</em></h1><p>Try replying and attaching a sample photo. This practice chat never sends anything to WhatsApp.</p></div>
          <div className="activity-grid"><section className="activity-panel"><div className="activity-top"><span className="step-pill">PRACTICE 01</span><div><strong>Your practice task</strong><small>Reply to Ayesha and practise sharing a photo.</small></div><span className="demo-chip">SIMULATED</span></div><div className="mock-chat"><div className="mock-chat-head"><div className="contact-avatar">A</div><div><strong>Ayesha</strong><small>Practice contact · Not a real account</small></div><span>•••</span></div><div className="mock-chat-body"><div className="date-chip">TODAY</div><div className="mock-bubble">Assalam-o-alaikum! How are you today?<small>10:30</small></div><div className="mock-bubble outgoing">Wa-alaikum-assalam! I am doing well, thank you. 😊<small>10:31 ✓✓</small></div><div className="mock-bubble">Could you send me the family photo from yesterday?<small>10:32</small></div>{practiceReplies.map((reply, index) => <div key={index} className="mock-bubble outgoing">{reply.type === 'image' ? <><img className="attachment-preview" src={reply.url} alt="Your selected practice attachment"/><small>Image preview · local only</small></> : <>{reply.text}<small>Practice reply · not sent</small></>}</div>)}</div>
              {attachment && <div className="attachment-draft"><img src={attachment.url} alt="Selected image preview"/><span>{attachment.name}</span><button type="button" onClick={() => setAttachment(null)} aria-label="Remove selected image">Remove</button></div>}
              <form className="mock-composer" onSubmit={sendPractice}><button className="attach-button" type="button" onClick={() => fileInput.current?.click()} aria-label="Attach a practice photo">＋</button><input ref={fileInput} className="visually-hidden" type="file" accept="image/*" onChange={addAttachment}/><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a pretend reply..." aria-label="Write a pretend WhatsApp reply"/><button type="submit" disabled={!draft.trim() && !attachment}>Add to chat</button></form></div><button className="finish-button" onClick={completePractice}>✓ I finished practising</button></section>
            <aside className="activity-panel tips-panel"><div className="dost-avatar">د</div><div className="eyebrow">A LITTLE GUIDANCE</div><h2>Take your time.</h2><p>Try typing a friendly reply. You can make mistakes here — that’s how we learn.</p><div className="tip-box"><strong>Need an idea?</strong><button onClick={() => setDraft('Wa-alaikum-assalam! I will send it in a moment.')}>Use a sample reply <span>→</span></button></div><div className="safety-note">Your selected image is previewed in this browser only. It is not uploaded to a server or sent to a contact.</div></aside></div>
        </section>}

        {page === 'scams' && <section className="content activity-content"><div className="page-heading"><div className="eyebrow">STAY SAFE ONLINE · LEARN THE SIGNS</div><h1>Pause. Check. <em>Stay safe.</em></h1><p>Review fictional messages and learn which warning signs to look for.</p></div><div className="activity-grid scam-grid"><section className="activity-panel scam-panel"><div className="activity-top"><span className="step-pill">EXAMPLE {scamIndex + 1} / {scamExamples.length}</span><strong>Message preview</strong><span className="demo-chip">FICTIONAL</span></div><div className="sender-line"><div className="contact-avatar">{currentScam.sender[0]}</div><div><strong>{currentScam.sender}</strong><small>Example sender · Simulated</small></div></div><h2>{currentScam.title}</h2><div className="scam-message">{currentScam.message}</div><p className="question">What would you do with this message?</p><div className="answer-options"><button className={choice === 'safe' ? 'answer-option selected' : 'answer-option'} onClick={() => { setChoice('safe'); setRevealed(false) }}>✓ <span><b>Looks safe</b><small>This seems like a normal message.</small></span></button><button className={choice === 'scam' ? 'answer-option selected risky' : 'answer-option'} onClick={() => { setChoice('scam'); setRevealed(false) }}>⚑ <span><b>Suspicious</b><small>I would pause and check first.</small></span></button></div>{!revealed ? <button className="solid-button" disabled={!choice} onClick={finishScam}>Check my answer <span>→</span></button> : <div className={choice === currentScam.answer ? 'result-box correct' : 'result-box'}><strong>{choice === currentScam.answer ? '✓ Well spotted!' : 'Good try — now you know what to look for.'}</strong><p>{currentScam.reason}</p><button onClick={nextScam}>Next example →</button></div>}</section><aside className="activity-panel tips-panel safety-tips"><div className="eyebrow">THREE IMPORTANT REMINDERS</div><h2>Protect your information.</h2><ol><li><b>Pause before you tap.</b><span>Urgent messages want you to rush.</span></li><li><b>Keep secrets secret.</b><span>Never share an OTP, PIN or password.</span></li><li><b>Verify independently.</b><span>Use a trusted number or official app.</span></li></ol><div className="safety-note">These examples teach warning signs; they are not an automated scam detector.</div></aside></div></section>}

        {page === 'progress' && <section className="content activity-content"><div className="page-heading"><div className="eyebrow">YOUR LEARNING JOURNEY</div><h1>Progress at <em>your pace.</em></h1><p>Your activity is saved in this browser. It is not synced across devices.</p></div><div className="progress-grid"><div className="progress-tile"><span>✓</span><strong>{completed} / 3</strong><small>Practice sessions completed</small></div><div className="progress-tile"><span>◇</span><strong>{scamsReviewed}</strong><small>Messages reviewed</small></div><div className="progress-tile"><span>♡</span><strong>Keep going</strong><small>There is no rush to learn</small></div></div><div className="progress-actions"><button className="solid-button" onClick={() => setPage('home')}>Back to Home</button><button className="secondary-button" onClick={() => { setCompleted(0); setScamsReviewed(0); notify('Your local learning counters have been reset.') }}>Reset local progress</button></div></section>}

        {page === 'settings' && <section className="content activity-content"><div className="page-heading"><div className="eyebrow">MAKE THIS SPACE COMFORTABLE</div><h1>Your <em>settings.</em></h1><p>Adjust the display and read-aloud experience. Settings are saved in this browser.</p></div><div className="settings-grid">
          <section className="activity-panel setting-group"><div className="eyebrow">APPEARANCE</div><h2>Display preferences</h2><label className="setting-row"><span><b>Colour theme</b><small>Choose a comfortable display.</small></span><select value={theme} onChange={(e) => setTheme(e.target.value)}><option value="light">Light</option><option value="dark">Dark</option></select></label>
          <label className="setting-row"><span><b>Text size</b><small>Increase text across the app.</small></span><select value={textSize} onChange={(e) => setTextSize(e.target.value)}><option value="normal">Standard</option><option value="large">Large</option><option value="xlarge">Extra large</option></select></label>
          <label className="setting-row"><span><b>Higher contrast</b><small>Strengthen text and interface contrast.</small></span><input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)}/></label>
          <label className="setting-row"><span><b>Reduce motion</b><small>Limit non-essential movement.</small></span><input type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)}/></label></section>
          <section className="activity-panel setting-group"><div className="eyebrow">READ ALOUD</div><h2>Speech preferences</h2><label className="setting-row"><span><b>Read aloud on hover and focus</b><small>Turn spoken guidance on or off.</small></span><input type="checkbox" checked={autoRead} onChange={(e) => { setAutoRead(e.target.checked); window.speechSynthesis?.cancel(); setSpeechState('idle') }}/></label>
          <label className="setting-row"><span><b>Spoken language</b><small>Roman Urdu uses a limited built-in phrasebook. Other text may remain English.</small></span><select value={speechLanguage} onChange={(e) => setSpeechLanguage(e.target.value)}><option value="en">English</option><option value="roman">Roman Urdu (supported phrases)</option></select></label>
          <label className="setting-row"><span><b>Speaking speed</b><small>Choose a comfortable pace.</small></span><select value={speechRate} onChange={(e) => setSpeechRate(e.target.value)}><option value="slow">Slow</option><option value="normal">Normal</option><option value="fast">Fast</option></select></label>
          <label className="setting-row"><span><b>Device voice</b><small>Available voices depend on your browser and operating system.</small></span><select value={voiceName} onChange={(e) => setVoiceName(e.target.value)}><option value="">Automatic available voice</option>{voices.map((voice) => <option key={voice.name} value={voice.name}>{voice.name} · {voice.lang}</option>)}</select></label>
          <div className="voice-note">Voice gender and Roman Urdu pronunciation cannot be guaranteed. Only voices installed on your device are available.</div>
          <button className="secondary-button" onClick={() => speak(speechLanguage === 'roman' ? 'Make Digital Dost easier to use' : 'Your Digital Dost is ready to help you learn at your own pace.')}>Test read aloud</button>
          </section>
        </div></section>}
      </main>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}

export default App
