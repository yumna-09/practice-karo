import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, Ban, Camera, Image as ImageIcon, MapPin, MoreVertical, Paperclip, Send, ShieldAlert, ShieldCheck, Smile, Sparkles, Trash2, X } from 'lucide-react'
import { Avatar, Ticks } from './ui'
import { fmtTime, dayLabel } from '../lib/format'
import MediaSheet from './MediaSheet'
import LocationSheet, { MapPreview } from './LocationSheet'

const EMOJIS = ['😊', '😄', '😂', '🥰', '👍', '🙏', '❤️', '🎉', '☕', '🍛', '👋', '😍']

export default function Conversation({ contact, chat, onBack, onSendText, onSendMedia, onSendLocation, onClear, onBlock, onCheck, onEvent, notify, hideBack }) {
  const [draft, setDraft] = useState('')
  const [menu, setMenu] = useState(null) // 'attach' | 'emoji' | 'more'
  const [sheet, setSheet] = useState(null)
  const [lightbox, setLightbox] = useState(null)
  const [locSheet, setLocSheet] = useState(false)
  const end = useRef(null)
  const cameraInput = useRef(null)
  const input = useRef(null)

  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [chat.messages.length, chat.typing])
  useEffect(() => {
    if (!menu) return
    const close = (e) => { if (!e.target.closest('.popover, .menu-trigger')) setMenu(null) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [menu])

  const submit = (e) => {
    e.preventDefault()
    if (!draft.trim() || chat.blocked) return
    onSendText(draft)
    setDraft('')
    setMenu(null)
  }

  const openAttach = () => { setMenu(menu === 'attach' ? null : 'attach'); if (menu !== 'attach') onEvent?.('menu') }
  const fromCamera = (files) => {
    const f = files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) { notify('Please take or choose a picture.'); return }
    setSheet([{ name: f.name, url: URL.createObjectURL(f), local: true }])
    onEvent?.('pick')
  }

  const status = chat.blocked ? 'Blocked' : chat.typing ? 'typing…' : contact.online ? 'online' : 'last seen today'

  return (
    <section className="convo glass" aria-label={`Chat with ${contact.name}`}>
      <header className="convo-head">
        {!hideBack && <button className="icon-btn back-btn" onClick={onBack} aria-label="Back to chats"><ArrowLeft size={20} /></button>}
        <Avatar name={contact.name} hue={contact.hue} size={46} online={contact.online && !chat.blocked} />
        <div className="convo-title">
          <strong>{contact.name}</strong>
          <small className={chat.typing ? 'typing-label' : ''}>{status}</small>
        </div>
        <span className="chip chip-sim"><ShieldCheck size={14} /> Simulated</span>
        <div className="menu-wrap">
          <button className="icon-btn menu-trigger" onClick={() => setMenu(menu === 'more' ? null : 'more')} aria-label="More options" aria-expanded={menu === 'more'}><MoreVertical size={20} /></button>
          {menu === 'more' && (
            <div className="popover pop right" role="menu">
              {contact.kind === 'scam' && !chat.blocked && <button role="menuitem" onClick={() => { onBlock(); setMenu(null) }}><Ban size={18} /> Block and report</button>}
              <button role="menuitem" onClick={() => { onClear(); setMenu(null); notify('Practice chat cleared.') }}><Trash2 size={18} /> Clear practice chat</button>
            </div>
          )}
        </div>
      </header>

      <div className="convo-body" aria-live="polite" aria-relevant="additions">
        {chat.messages.length === 0 && <div className="empty-chat"><Sparkles size={28} /><strong>No messages yet</strong><span>Say hello to {contact.name} to begin.</span></div>}
        {chat.messages.map((m, idx) => {
          const label = dayLabel(m.time)
          const showDay = idx === 0 || label !== dayLabel(chat.messages[idx - 1].time)
          return (
            <div key={m.id} className="msg-wrap">
              {showDay && <div className="day-chip">{label}</div>}
              {m.from === 'coach' ? (
                <div className="coach-note pop"><ShieldAlert size={20} /><div><strong>Dost Coach</strong><span>{m.text}</span></div></div>
              ) : (
                <div className={`bubble pop ${m.from === 'me' ? 'out' : 'in'}`}>
                  {m.kind === 'media' && (
                    <div className={`media-grid n${Math.min(m.images.length, 4)}`}>
                      {m.images.slice(0, 4).map((img, i) => (
                        <button key={img.url} className="media-cell" onClick={() => setLightbox(img)} aria-label={`Open picture ${i + 1}`}>
                          <img src={img.url} alt={`Picture ${i + 1} you shared`} />
                          {i === 3 && m.images.length > 4 && <span className="more-count">+{m.images.length - 4}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                  {m.kind === 'location' && (
                    <a className="loc-card" href={`https://www.google.com/maps?q=${m.place.lat},${m.place.lng}`} target="_blank" rel="noopener noreferrer" aria-label={`Open ${m.place.label} on a map`}>
                      <div className="loc-map"><MapPreview /></div>
                      <div className="loc-info"><b>{m.place.label}</b><small>{m.place.lat}, {m.place.lng}</small></div>
                    </a>
                  )}
                  {m.text && <p>{m.text}</p>}
                  <span className="meta">
                    {m.from === 'them' && contact.kind === 'scam' && (
                      <button className="check-link" onClick={() => onCheck(m.text)}><ShieldCheck size={14} /> Check this message</button>
                    )}
                    {fmtTime(m.time)} {m.from === 'me' && <Ticks status={m.status} />}
                  </span>
                </div>
              )}
            </div>
          )
        })}
        {chat.typing && <div className="bubble in typing pop" aria-label={`${contact.name} is typing`}><i /><i /><i /></div>}
        <div ref={end} />
      </div>

      {chat.blocked ? (
        <div className="blocked-bar"><Ban size={18} /> You blocked this number. Practice complete!</div>
      ) : (
        <form className="composer" onSubmit={submit}>
          <div className="menu-wrap">
            <button type="button" className="icon-btn menu-trigger" onClick={() => setMenu(menu === 'emoji' ? null : 'emoji')} aria-label="Choose an emoji" aria-expanded={menu === 'emoji'}><Smile size={22} /></button>
            {menu === 'emoji' && (
              <div className="popover pop emoji-pop">
                {EMOJIS.map((e) => <button type="button" key={e} onClick={() => { setDraft((d) => d + e); input.current?.focus() }} aria-label={`Add ${e}`}>{e}</button>)}
              </div>
            )}
          </div>
          <div className="menu-wrap">
            <button type="button" className="icon-btn menu-trigger attach-btn" onClick={openAttach} aria-label="Attach photo or media" aria-expanded={menu === 'attach'}><Paperclip size={22} /></button>
            {menu === 'attach' && (
              <div className="popover pop attach-pop" role="menu">
                <button type="button" role="menuitem" onClick={() => { setMenu(null); setSheet([]) }}><span className="pop-ico a"><ImageIcon size={20} /></span> Photos &amp; gallery</button>
                <button type="button" role="menuitem" onClick={() => { setMenu(null); cameraInput.current?.click() }}><span className="pop-ico b"><Camera size={20} /></span> Camera</button>
                <button type="button" role="menuitem" onClick={() => { setMenu(null); setSheet([]) }}><span className="pop-ico c"><Sparkles size={20} /></span> Sample pictures</button>
                <button type="button" role="menuitem" onClick={() => { setMenu(null); setLocSheet(true) }}><span className="pop-ico a"><MapPin size={20} /></span> Location</button>
              </div>
            )}
          </div>
          <input ref={cameraInput} className="visually-hidden" type="file" accept="image/*" capture="environment" onChange={(e) => { fromCamera(e.target.files); e.target.value = '' }} aria-label="Take a photo" />
          <input ref={input} className="composer-input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={`Message ${contact.name}…`} aria-label={`Type a practice message to ${contact.name}`} autoComplete="off" />
          <button type="submit" className="send-btn" disabled={!draft.trim()} aria-label="Send message"><Send size={20} /></button>
        </form>
      )}
      <p className="convo-foot">Practice chat · replies are simulated · never type real passwords or OTPs</p>

      {sheet && (
        <MediaSheet
          contactName={contact.name}
          initial={sheet}
          onClose={() => setSheet(null)}
          onSend={(imgs, cap) => { onSendMedia(imgs, cap); onEvent?.('sent') }}
          onEvent={onEvent}
          notify={notify}
        />
      )}
      {locSheet && <LocationSheet contactName={contact.name} onClose={() => setLocSheet(false)} onSend={(pl) => { onSendLocation(pl); onEvent?.('sent') }} notify={notify} />}
      {lightbox && createPortal(
        <div className="sheet-backdrop" onClick={() => setLightbox(null)} role="dialog" aria-modal="true" aria-label="Picture preview">
          <button className="icon-btn lightbox-x" onClick={() => setLightbox(null)} aria-label="Close preview"><X size={22} /></button>
          <img className="lightbox-img pop" src={lightbox.url} alt="Enlarged practice picture" />
        </div>,
        document.querySelector('.app') || document.body,
      )}
    </section>
  )
}
