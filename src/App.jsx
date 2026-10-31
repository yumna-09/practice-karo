import { useCallback, useEffect, useRef, useState } from 'react'
import { BarChart3, Camera, Home as HomeIcon, MessageCircle, Settings as Cog, ShieldAlert, Volume2, VolumeX } from 'lucide-react'
import { useChats } from './hooks/useChats'
import { useSpeech } from './hooks/useSpeech'
import Home from './pages/Home'
import WhatsApp from './pages/WhatsApp'
import Scam from './pages/Scam'
import Photo from './pages/Photo'
import Progress from './pages/Progress'
import Settings from './pages/Settings'

const NAV = [
  { id: 'home', label: 'Home', short: 'Home', icon: HomeIcon },
  { id: 'whatsapp', label: 'WhatsApp practice', short: 'Chat', icon: MessageCircle },
  { id: 'scam', label: 'Spot a scam', short: 'Scams', icon: ShieldAlert },
  { id: 'photo', label: 'Share a photo', short: 'Photos', icon: Camera },
  { id: 'progress', label: 'My progress', short: 'Progress', icon: BarChart3 },
  { id: 'settings', label: 'Settings', short: 'Settings', icon: Cog },
]

const load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d } catch { return d } }
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* storage unavailable */ } }

export default function App() {
  const [page, setPage] = useState('home')
  const [textSize, setTextSize] = useState(() => { const n = Number(load('dd-text-size', 100)); return n >= 90 && n <= 125 ? n : 100 })
  const [highContrast, setHighContrast] = useState(() => load('dd-contrast', false) === true)
  const [reducedMotion, setReducedMotion] = useState(() => load('dd-motion', false) === true)
  const [milestones, setMilestones] = useState(() => load('dd-milestones', []))
  const [scamsChecked, setScamsChecked] = useState(() => Number(load('dd-checked', 0)) || 0)
  const [reviewed, setReviewed] = useState(() => Number(load('dd-scams', 0)) || 0)
  const [toast, setToast] = useState('')
  const [prefill, setPrefill] = useState(null)
  const toastTimer = useRef(null)
  const speech = useSpeech()

  useEffect(() => { save('dd-text-size', textSize); save('dd-contrast', highContrast); save('dd-motion', reducedMotion) }, [textSize, highContrast, reducedMotion])
  useEffect(() => { document.documentElement.style.fontSize = `${16 * textSize / 100}px` }, [textSize])
  useEffect(() => { save('dd-milestones', milestones) }, [milestones])
  useEffect(() => { save('dd-checked', scamsChecked); save('dd-scams', reviewed) }, [scamsChecked, reviewed])
  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const notify = useCallback((m) => {
    setToast(m)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 3600)
  }, [])

  const milestone = useCallback((id) => {
    setMilestones((cur) => {
      if (cur.includes(id)) return cur
      const labels = { message: 'You sent your first message', photo: 'You shared a photo', location: 'You shared a location', check: 'You checked a message', block: 'You blocked a scammer' }
      setTimeout(() => notify(`🎉 Skill unlocked: ${labels[id]}!`), 0)
      return [...cur, id]
    })
  }, [notify])

  const chatApi = useChats({ onMilestone: milestone })
  const go = (p) => { setPage(p); window.scrollTo?.({ top: 0 }) }
  const goScam = (text) => { setPrefill({ text, stamp: Date.now() }); go('scam') }
  const reset = () => { setMilestones([]); setScamsChecked(0); setReviewed(0); notify('Your local learning progress has been reset.') }

  const cls = ['app', highContrast && 'high-contrast', reducedMotion && 'reduced-motion'].filter(Boolean).join(' ')
  const current = NAV.find((n) => n.id === page)

  return (
    <div className={cls}>
      <div className="bg" aria-hidden="true"><i className="orb o1" /><i className="orb o2" /><i className="orb o3" /></div>
      <a className="skip" href="#main">Skip to content</a>

      <aside className="rail glass">
        <button className="brand" onClick={() => go('home')} aria-label="Digital Dost home">
          <span className="brand-mark">د</span>
          <span className="brand-text"><b>Digital Dost</b><small>Learn. Practise. Feel confident.</small></span>
        </button>
        <nav aria-label="Main navigation">
          {NAV.map((n) => (
            <button key={n.id} className={page === n.id ? 'nav on' : 'nav'} onClick={() => go(n.id)} aria-current={page === n.id ? 'page' : undefined}>
              <n.icon size={22} /><span className="nav-long">{n.label}</span><span className="nav-short">{n.short}</span>
            </button>
          ))}
        </nav>
        <div className="rail-note"><b>Made by Shadowblades</b></div>
      </aside>

      <div className="stage">
        <header className="topbar glass">
          <div className="crumb"><span>Digital Dost</span><i>/</i><b>{current.label}</b></div>
          <span className="chip chip-sim safe-chip"><span className="pulse" /> Simulated practice · no real accounts</span>
          <div className="read" data-no-read>
            <button className={speech.autoRead ? 'btn btn-glass small on' : 'btn btn-glass small'} onClick={() => speech.toggle(!speech.autoRead)} aria-pressed={speech.autoRead}>
              {speech.autoRead ? <Volume2 size={18} /> : <VolumeX size={18} />}<span>Read aloud {speech.autoRead ? 'on' : 'off'}</span>
            </button>
            {speech.state !== 'idle' && <button className="icon-btn" onClick={speech.stop} aria-label="Stop speech">■</button>}
          </div>
        </header>

        <main id="main" className="main" key={page}>
          {page === 'home' && <Home go={go} done={milestones.length} scamsChecked={scamsChecked} reviewed={reviewed} speakText={speech.speak} />}
          {page === 'whatsapp' && <WhatsApp chatApi={chatApi} notify={notify} goScam={goScam} />}
          {page === 'scam' && <Scam prefill={prefill} onChecked={() => { setScamsChecked((n) => n + 1); milestone('check') }} onReviewed={() => setReviewed((n) => n + 1)} />}
          {page === 'photo' && <Photo chatApi={chatApi} notify={notify} />}
          {page === 'progress' && <Progress milestones={milestones} scamsChecked={scamsChecked} reviewed={reviewed} go={go} reset={reset} />}
          {page === 'settings' && <Settings prefs={{ textSize, setTextSize, highContrast, setHighContrast, reducedMotion, setReducedMotion }} speech={speech} />}
        </main>
      </div>
      {toast && <div className="toast glass pop" role="status">{toast}</div>}
    </div>
  )
}
