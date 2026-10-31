import { useEffect, useState } from 'react'
import './App.css'

const initialScams = [
  { id: 1, sender: 'WhatsApp Support', title: 'Your account will be blocked today!', message: 'Your WhatsApp account has violated our policy. Verify immediately at wa-support-check.example to avoid permanent suspension.', answer: 'scam', reason: 'Official services do not ask you to verify through suspicious links sent in random messages. Urgent threats are a common pressure tactic.' },
  { id: 2, sender: 'Ayesha', title: 'Family group message', message: 'Assalam-o-alaikum! I have shared the Eid family photos in our family group. Have a look when you get time ❤️', answer: 'safe', reason: 'This is a normal conversational message with no request for money, passwords, OTPs, or suspicious links. Still, only open files you were expecting.' },
  { id: 3, sender: 'Unknown Number', title: 'You won a prize!', message: 'Congratulations! You have won Rs. 50,000. Send your CNIC and bank OTP to claim your reward now.', answer: 'scam', reason: 'Unexpected prizes, requests for sensitive identity details, and OTP requests are strong warning signs. Never share an OTP.' },
]

const lessons = [
  { id: 'whatsapp', icon: '◉', title: 'WhatsApp practice', desc: 'Learn to send messages, photos and voice notes safely.', time: '5 min', tag: 'Interactive practice' },
  { id: 'scams', icon: '♢', title: 'Spot the scam', desc: 'Practise recognising suspicious messages before they trick you.', time: '3 min', tag: 'Stay safe online' },
  { id: 'basics', icon: '⌘', title: 'Phone basics', desc: 'Get comfortable with everyday buttons and settings.', time: '4 min', tag: 'Coming soon' },
]

function App() {
  const [page, setPage] = useState('home')
  const [language, setLanguage] = useState('English')
  const [completed, setCompleted] = useState(() => Number(localStorage.getItem('dd-completed') || 0))
  const [messages, setMessages] = useState([
    { from: 'them', text: 'Assalam-o-alaikum! Hope you are doing well. 😊' },
    { from: 'me', text: 'Wa-alaikum-assalam! I am good, thank you.' },
    { from: 'them', text: 'Can you send me the family photo from yesterday?' },
  ])
  const [draft, setDraft] = useState('')
  const [guideOpen, setGuideOpen] = useState(false)
  const [guideText, setGuideText] = useState('I am here to help. What would you like to practise?')
  const [scamIndex, setScamIndex] = useState(0)
  const [choice, setChoice] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [doneScams, setDoneScams] = useState(() => Number(localStorage.getItem('dd-scams') || 0))
  const [toast, setToast] = useState('')

  useEffect(() => { localStorage.setItem('dd-completed', String(completed)) }, [completed])
  useEffect(() => { localStorage.setItem('dd-scams', String(doneScams)) }, [doneScams])

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2400)
  }

  const sendMessage = (text = draft) => {
    if (!text.trim()) return
    setMessages((current) => [...current, { from: 'me', text: text.trim() }])
    setDraft('')
    if (text.toLowerCase().includes('photo')) {
      window.setTimeout(() => setMessages((current) => [...current, { from: 'them', text: 'Great, thank you! That is the one. 🌷' }]), 450)
    }
  }

  const askGuide = (question) => {
    const q = question.toLowerCase()
    if (q.includes('photo') || q.includes('picture')) setGuideText('No problem! In this practice chat, tap the small photo button beside the message box. Choose a sample photo, then press Send. You are practising here — no real photo is shared.')
    else if (q.includes('send') || q.includes('message')) setGuideText('To send a message: tap the message box at the bottom, type a short reply, then tap the green Send button. Take your time. There is no rush.')
    else if (q.includes('scam') || q.includes('safe') || q.includes('otp')) setGuideText('Remember: never share an OTP, PIN or password. Be careful with urgent messages, unexpected prizes and links from unknown people. When unsure, ask someone you trust.')
    else setGuideText('Of course. We can learn one small step at a time. Try the green buttons in the practice area. If something feels confusing, tell me which part and I will explain it in simpler words.')
    setGuideOpen(true)
  }

  const finishScam = () => {
    if (!choice) return
    setRevealed(true)
    if (choice === initialScams[scamIndex].answer) setDoneScams((n) => n + 1)
  }

  const nextScam = () => {
    setScamIndex((n) => (n + 1) % initialScams.length)
    setChoice('')
    setRevealed(false)
  }

  const markLesson = () => {
    setCompleted((n) => Math.min(n + 1, 3))
    notify('Lovely work! Your progress has been saved on this device.')
  }

  const nav = [
    ['home', '⌂', 'Home'],
    ['whatsapp', '◉', 'WhatsApp practice'],
    ['scams', '♢', 'Scam detective'],
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setPage('home')} aria-label="Digital Dost home">
          <span className="brand-mark">د</span><span>digital<span className="brand-light"> dost</span><small>Learn at your own pace</small></span>
        </button>
        <div className="side-label">YOUR LEARNING SPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {nav.map(([id, icon, label]) => <button key={id} className={page === id ? 'nav-link active' : 'nav-link'} onClick={() => setPage(id)}><span className="nav-icon">{icon}</span>{label}{id === 'scams' && <span className="nav-dot" />}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><span className="help-spark">✳</span><strong>Need a little help?</strong><p>Your friendly guide is always here. No question is too small.</p><button onClick={() => { setGuideOpen(true); setGuideText('Hello! I am your Digital Dost. Tell me what you would like help with.') }}>Talk to your guide <span>→</span></button></div>
          <div className="profile"><div className="avatar">Y</div><div><strong>My learning space</strong><small>Beginner · Doing great</small></div><span className="profile-more">•••</span></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar"><div className="breadcrumb">My learning space <span>/</span> {nav.find((n) => n[0] === page)?.[2] || 'Home'}</div><div className="top-actions"><span className="safe-pill"><i /> Safe practice mode</span><select aria-label="Choose language" value={language} onChange={(e) => setLanguage(e.target.value)}><option>English</option><option>اردو</option><option>Roman Urdu</option></select><button className="top-avatar" aria-label="Profile">Y</button></div></header>

        {page === 'home' && <section className="content">
          <div className="welcome-row"><div><div className="eyebrow"><span /> A FRIENDLY PLACE TO LEARN</div><h1>Small steps.<br /><em>More confidence.</em></h1><p className="welcome-copy">Technology gets easier when we learn together. Choose something to practise today — there is no rush.</p><div className="welcome-buttons"><button className="primary-btn" onClick={() => setPage('whatsapp')}>Start learning <span>→</span></button><button className="text-btn" onClick={() => setGuideOpen(true)}>Meet your digital guide <span>↗</span></button></div></div><div className="welcome-art"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-sun">✳</div><div className="art-note note-top">You can do this!</div><div className="art-phone"><div className="phone-speaker" /><div className="phone-chat"><span>Assalam-o-alaikum</span><b>Wa-alaikum-assalam! 😊</b><span>How are you today?</span></div><div className="phone-heart">♡</div></div><div className="art-note note-bottom">One thing at a time</div></div></div>
          <div className="stats-row"><div className="stat-card"><span className="stat-icon green">✓</span><div><strong>{completed}/3</strong><small>Lessons completed</small></div></div><div className="stat-card"><span className="stat-icon peach">♢</span><div><strong>{doneScams}</strong><small>Scams reviewed</small></div></div><div className="stat-card"><span className="stat-icon blue">◷</span><div><strong>At your pace</strong><small>No deadlines, ever</small></div></div></div>
          <div className="section-heading"><div><div className="eyebrow">YOUR NEXT LITTLE WIN</div><h2>What would you like to practise?</h2></div><span className="section-note">Choose a topic to begin</span></div>
          <div className="lesson-grid">{lessons.map((lesson) => <article className="lesson-card" key={lesson.id}><div className={'lesson-icon '+lesson.id}>{lesson.icon}</div><div className="lesson-tag">{lesson.tag}</div><h3>{lesson.title}</h3><p>{lesson.desc}</p><div className="lesson-footer"><span>◷ {lesson.time}</span>{lesson.id === 'basics' ? <span className="coming">Coming soon</span> : <button onClick={() => setPage(lesson.id)}>Practise now <b>→</b></button>}</div></article>)}</div>
          <div className="encouragement"><span>✳</span><p><strong>A gentle reminder</strong> — You do not need to know everything today. Every little thing you learn is progress.</p></div>
        </section>}

        {page === 'whatsapp' && <section className="content practice-content">
          <div className="page-intro"><div className="eyebrow">LEARN BY DOING · 5 MIN</div><h1>Let's practise <em>WhatsApp.</em></h1><p>Try a pretend conversation in this safe practice space. Nothing here is sent to a real person.</p></div>
          <div className="practice-layout"><div className="practice-main"><div className="practice-instructions"><span className="step-number">01</span><div><strong>Your practice task</strong><p>Reply to the message and send a photo. You can try as many times as you like.</p></div><span className="demo-label">DEMO CHAT</span></div><div className="chat-window"><div className="chat-head"><div className="chat-person"><div className="chat-avatar">A</div><div><strong>Ayesha · Practice contact</strong><small><i /> Online in simulation</small></div></div><span className="chat-menu">⋮</span></div><div className="chat-body"><div className="chat-date">TODAY</div>{messages.map((m, i) => <div key={i} className={'bubble-row '+(m.from === 'me' ? 'mine' : '')}><div className="chat-bubble">{m.text}<small>{m.from === 'me' ? 'You · ' : ''}10:3{i} {m.from === 'me' ? '✓✓' : ''}</small></div></div>)}<div className="chat-hint">This is a simulated conversation. Your messages stay on this page.</div></div><div className="chat-compose"><button className="attach-btn" onClick={() => notify('Photo practice: imagine choosing a photo from your gallery. No file is uploaded.')}>＋</button><input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type your message here..." aria-label="Type a practice message" /><button className="send-btn" onClick={() => sendMessage()}>Send <span>➤</span></button></div></div><button className="complete-btn" onClick={markLesson}>✓ I finished practising</button></div>
            <aside className="guide-panel"><div className="guide-panel-head"><span className="guide-avatar">✳</span><div><strong>Your digital guide</strong><small>Here whenever you need</small></div><span className="online-dot" /></div><div className="guide-welcome"><span className="guide-spark">✳</span><strong>You're doing wonderfully.</strong><p>Let's take this one step at a time. What would you like help with?</p></div><div className="quick-help"><small>QUICK HELP</small><button onClick={() => askGuide('How do I send a message?')}>How do I send a message?</button><button onClick={() => askGuide('How do I send a photo?')}>How do I send a photo?</button><button onClick={() => askGuide('Is this safe?')}>How do I stay safe?</button></div><div className="guide-answer">{guideText}</div><div className="guide-input"><input placeholder="Ask me anything..." onKeyDown={(e) => { if (e.key === 'Enter') askGuide(e.currentTarget.value) }} /><button onClick={() => askGuide('How do I send a message?')}>↑</button></div><small className="guide-disclaimer">Practice guidance only · No real account connected</small></aside></div>
        </section>}

        {page === 'scams' && <section className="content scam-content">
          <div className="page-intro"><div className="eyebrow">STAY SAFE ONLINE · 3 MIN</div><h1>Can you spot <em>the scam?</em></h1><p>Some messages are tricky. Learn the warning signs in a safe, pretend inbox.</p></div>
          <div className="scam-layout"><div className="scam-card"><div className="scam-card-top"><span className="inbox-label">✉ MESSAGE IN YOUR INBOX</span><span className="question-count">EXAMPLE {scamIndex + 1} OF {initialScams.length}</span></div><div className="sender-row"><div className="sender-avatar">{initialScams[scamIndex].sender[0]}</div><div><strong>{initialScams[scamIndex].sender}</strong><small>Just now · Message preview</small></div><span className="more-dots">•••</span></div><h2>{initialScams[scamIndex].title}</h2><div className="message-preview">{initialScams[scamIndex].message}</div><div className="scam-question">What do you think about this message?</div><div className="choice-grid"><button className={choice === 'safe' ? 'choice selected' : 'choice'} onClick={() => { setChoice('safe'); setRevealed(false) }}><span>✓</span><b>Looks safe</b><small>I think this message is okay</small></button><button className={choice === 'scam' ? 'choice selected danger' : 'choice'} onClick={() => { setChoice('scam'); setRevealed(false) }}><span>⚑</span><b>It's a scam</b><small>Something feels suspicious</small></button></div>{!revealed ? <button className="primary-btn check-btn" disabled={!choice} onClick={finishScam}>Check my answer <span>→</span></button> : <div className={choice === initialScams[scamIndex].answer ? 'feedback correct' : 'feedback incorrect'}><strong>{choice === initialScams[scamIndex].answer ? '✓ That is right. Well spotted!' : 'A good try — let’s learn from this.'}</strong><p>{initialScams[scamIndex].reason}</p><button onClick={nextScam}>Next example <span>→</span></button></div>}</div>
            <aside className="safety-sidebar"><div className="shield-icon">♢</div><h3>Remember these 3 things</h3><ul><li><span>01</span><div><strong>Pause before you tap</strong><p>Do not rush because a message says “urgent”.</p></div></li><li><span>02</span><div><strong>Keep secrets secret</strong><p>Never share your OTP, PIN or password.</p></div></li><li><span>03</span><div><strong>Check who sent it</strong><p>Contact the person or organisation through a trusted number.</p></div></li></ul><div className="safety-foot">Your safety matters more than a quick reply.</div></aside></div>
        </section>}
      </main>

      {guideOpen && <div className="modal-backdrop" role="presentation" onClick={() => setGuideOpen(false)}><section className="guide-modal" role="dialog" aria-modal="true" aria-labelledby="guide-title" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setGuideOpen(false)} aria-label="Close guide">×</button><div className="guide-avatar large">✳</div><div className="eyebrow">YOUR FRIENDLY DIGITAL COMPANION</div><h2 id="guide-title">Hello, I'm your Digital Dost.</h2><p>{guideText}</p><div className="modal-prompts"><button onClick={() => askGuide('How do I send a message?')}>Help me send a message</button><button onClick={() => askGuide('How do I spot a scam?')}>Teach me about online safety</button><button onClick={() => askGuide('I feel confused')}>I feel a little confused</button></div><p className="modal-note">This demo uses built-in guidance. No AI service or personal account is connected.</p></section></div>}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}

export default App
