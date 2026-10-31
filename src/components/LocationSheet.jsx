import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Crosshair, MapPin, Send, ShieldCheck, X } from 'lucide-react'

// Practice location: a sample spot, or (optionally) the device's real position.
// Nothing is uploaded; coordinates stay in this browser tab.
export const SAMPLE_PLACE = { label: 'Sample place · Hyderabad', lat: 25.396, lng: 68.3578, real: false }

export function MapPreview({ pin = true }) {
  return (
    <svg viewBox="0 0 240 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="240" height="120" fill="#E9E0D0" />
      <path d="M0 80 C60 60 90 100 150 70 S220 60 240 50" stroke="#B8A99A" strokeWidth="14" fill="none" />
      <path d="M20 0 L70 120 M120 0 L110 120 M180 0 L210 120 M0 40 L240 30" stroke="#FBF8F2" strokeWidth="7" />
      {pin && <g transform="translate(120 52)"><ellipse cx="0" cy="22" rx="9" ry="3" fill="rgba(58,45,37,.25)" /><path d="M0 20 C-14 2 -14 -16 0 -16 C14 -16 14 2 0 20Z" fill="#3A2D25" /><circle cx="0" cy="-5" r="5" fill="#FBF8F2" /></g>}
    </svg>
  )
}

export default function LocationSheet({ contactName, onClose, onSend, notify }) {
  const [place, setPlace] = useState(null)
  const [busy, setBusy] = useState(false)
  const sheet = useRef(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    sheet.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const useReal = () => {
    if (!navigator.geolocation) { notify('This device cannot share location here. Try the sample place instead.'); return }
    setBusy(true)
    navigator.geolocation.getCurrentPosition(
      (p) => { setBusy(false); setPlace({ label: 'My current location', lat: +p.coords.latitude.toFixed(5), lng: +p.coords.longitude.toFixed(5), real: true }) },
      () => { setBusy(false); notify('Location was not allowed. No problem, you can use the sample place.') },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    )
  }

  return createPortal(
    <div className="sheet-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet glass pop" role="dialog" aria-modal="true" aria-label="Share location" tabIndex={-1} ref={sheet} data-no-read>
        <div className="sheet-head">
          <div><span className="eyebrow">Share location</span><h2>Send your location to {contactName}</h2></div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <ol className="steps">
          <li>Tap the paperclip (+) in the chat.</li>
          <li>Choose <b>Location</b>.</li>
          <li>Allow location if your phone asks.</li>
          <li>Check the pin on the map, then tap <b>Send</b>.</li>
        </ol>
        {!place ? (
          <>
            <button className="loc-opt" onClick={useReal} disabled={busy}><Crosshair size={22} /><span><b>{busy ? 'Finding you…' : 'Use my current location'}</b><small>Your phone will ask permission. Stays on this device.</small></span></button>
            <button className="loc-opt" onClick={() => setPlace(SAMPLE_PLACE)}><MapPin size={22} /><span><b>Use a sample place</b><small>Safe practice, no permission needed.</small></span></button>
          </>
        ) : (
          <div className="loc-card"><div className="loc-map"><MapPreview /></div><div className="loc-info"><b>{place.label}</b><small>{place.lat}, {place.lng}</small></div></div>
        )}
        <p className="sheet-note"><ShieldCheck size={16} /> Practice only. Your location is never uploaded or sent to a real contact.</p>
        <div className="sheet-foot">
          <button className="btn btn-glass" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!place} onClick={() => { onSend(place); onClose() }}><Send size={18} /> Send location</button>
        </div>
      </div>
    </div>,
    document.querySelector('.app') || document.body,
  )
}
