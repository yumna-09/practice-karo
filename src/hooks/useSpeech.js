import { useEffect, useRef, useState } from 'react'

const ROMAN = {
  'Assalam-o-alaikum! I’m your Digital Dost. We can practise everyday technology together, one small step at a time.': 'Assalam-o-alaikum! Main aap ka Digital Dost hoon. Hum rozmarra technology mil kar, aik aik qadam seekh sakte hain.',
  'Pause before you tap.': 'Click karne se pehle ruk kar sochein.',
  'Never share an OTP, PIN or password.': 'Apna OTP, PIN ya password kabhi kisi ko na batayein.',
}
const read = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v } catch { return d } }
const write = (k, v) => { try { localStorage.setItem(k, String(v)) } catch { /* storage unavailable */ } }

export function useSpeech() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [autoRead, setAutoRead] = useState(() => read('dd-autoread', 'true') === 'true')
  const [language, setLanguage] = useState(() => read('dd-lang', 'en'))
  const [rate, setRate] = useState(() => read('dd-rate', 'normal'))
  const [voiceName, setVoiceName] = useState(() => read('dd-voice', ''))
  const [voices, setVoices] = useState([])
  const [state, setState] = useState('idle')
  const hover = useRef(null)
  const last = useRef('')

  useEffect(() => { write('dd-autoread', autoRead); write('dd-lang', language); write('dd-rate', rate); write('dd-voice', voiceName) }, [autoRead, language, rate, voiceName])

  useEffect(() => {
    if (!supported) return
    const load = () => setVoices(window.speechSynthesis.getVoices())
    load()
    window.speechSynthesis.addEventListener?.('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', load)
  }, [supported])

  const speak = (text, force = false) => {
    if (!supported || (!autoRead && !force) || !text?.trim()) return
    const phrase = language === 'roman' ? (ROMAN[text.trim()] || text.trim()) : text.trim()
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(phrase)
    u.lang = language === 'roman' ? 'en-PK' : 'en-US'
    u.rate = rate === 'slow' ? 0.72 : rate === 'fast' ? 1 : 0.86
    const v = voices.find((x) => x.name === voiceName) || voices.find((x) => x.lang.toLowerCase().startsWith('en'))
    if (v) u.voice = v
    u.onstart = () => setState('speaking')
    u.onend = () => setState('idle')
    u.onerror = () => setState('idle')
    window.speechSynthesis.speak(u)
  }

  const stop = () => { window.speechSynthesis?.cancel(); setState('idle'); last.current = '' }
  const pauseResume = () => {
    if (!supported) return
    if (state === 'speaking') { window.speechSynthesis.pause(); setState('paused') }
    else if (state === 'paused') { window.speechSynthesis.resume(); setState('speaking') }
  }
  const toggle = (v) => { setAutoRead(v); window.speechSynthesis?.cancel(); setState('idle') }

  // Read on hover (after a short pause) and keyboard focus.
  useEffect(() => {
    if (!supported) return
    const sel = '[data-read], h1, h2, h3, .read-me'
    const target = (el) => {
      const node = el?.closest?.(sel)
      if (!node || node.closest('input, textarea, select, [data-no-read]')) return
      const text = node.getAttribute('data-read') || node.innerText
      if (!text?.trim() || text.trim() === last.current) return
      last.current = text.trim()
      speak(text)
    }
    const over = (e) => {
      if (!autoRead) return
      const node = e.target?.closest?.(sel)
      if (!node || node.contains(e.relatedTarget)) return
      clearTimeout(hover.current)
      hover.current = setTimeout(() => target(node), 700)
    }
    const out = () => clearTimeout(hover.current)
    const focus = (e) => autoRead && target(e.target)
    document.addEventListener('pointerover', over)
    document.addEventListener('pointerout', out)
    document.addEventListener('focusin', focus)
    return () => {
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointerout', out)
      document.removeEventListener('focusin', focus)
      clearTimeout(hover.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRead, language, rate, voiceName, voices])

  useEffect(() => () => window.speechSynthesis?.cancel(), [])

  return { supported, autoRead, toggle, language, setLanguage, rate, setRate, voiceName, setVoiceName, voices, state, speak, stop, pauseResume }
}
