import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Camera, Image as ImageIcon, Images, Send, Sparkles, UploadCloud, X, Plus } from 'lucide-react'
import { SAMPLE_IMAGES } from '../lib/samples'

const MAX = 6
const MAX_MB = 8

export default function MediaSheet({ contactName, initial = [], onClose, onSend, onEvent, notify }) {
  const [items, setItems] = useState(initial)
  const [caption, setCaption] = useState('')
  const [drag, setDrag] = useState(false)
  const gallery = useRef(null)
  const camera = useRef(null)
  const sheet = useRef(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    sheet.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const addFiles = (fileList) => {
    const files = Array.from(fileList || [])
    if (!files.length) return
    const next = []
    for (const f of files) {
      if (!f.type.startsWith('image/')) { notify('Only picture files can be added. Please choose a photo.'); continue }
      if (f.size > MAX_MB * 1024 * 1024) { notify(`“${f.name}” is larger than ${MAX_MB} MB. Please choose a smaller picture.`); continue }
      next.push({ name: f.name, url: URL.createObjectURL(f), local: true })
    }
    setItems((cur) => {
      const merged = [...cur, ...next]
      if (merged.length > MAX) notify(`You can add up to ${MAX} pictures at once.`)
      return merged.slice(0, MAX)
    })
    if (next.length) onEvent?.('pick')
  }

  const addSample = () => {
    const have = new Set(items.map((i) => i.name))
    const pick = SAMPLE_IMAGES.find((s) => !have.has(s.name))
    if (!pick) { notify('All sample pictures are already added.'); return }
    if (items.length >= MAX) { notify(`You can add up to ${MAX} pictures at once.`); return }
    setItems((cur) => [...cur, pick])
    onEvent?.('pick')
  }

  const remove = (i) => setItems((cur) => {
    const it = cur[i]
    if (it?.local) URL.revokeObjectURL(it.url)
    return cur.filter((_, idx) => idx !== i)
  })

  const send = () => {
    if (!items.length) return
    onSend(items, caption)
    onClose()
  }

  return createPortal(
    <div className="sheet-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet glass pop" role="dialog" aria-modal="true" aria-label="Add photos to chat" tabIndex={-1} ref={sheet} data-no-read>
        <div className="sheet-head">
          <div><span className="eyebrow">Add media</span><h2>Send photos to {contactName}</h2></div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        <div
          className={drag ? 'dropzone over' : 'dropzone'}
          onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files) }}
        >
          <UploadCloud size={34} />
          <strong>Drag pictures here</strong>
          <span>or choose how to add them</span>
          <div className="drop-actions">
            <button className="btn btn-primary" onClick={() => gallery.current?.click()}><Images size={18} /> Choose from gallery</button>
            <button className="btn btn-glass" onClick={() => camera.current?.click()}><Camera size={18} /> Take a photo</button>
            <button className="btn btn-glass" onClick={addSample}><Sparkles size={18} /> Use a sample picture</button>
          </div>
          <input ref={gallery} className="visually-hidden" type="file" accept="image/*" multiple onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} aria-label="Choose pictures from your device" />
          <input ref={camera} className="visually-hidden" type="file" accept="image/*" capture="environment" onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} aria-label="Take a photo with your camera" />
        </div>

        {items.length > 0 && (
          <div className="thumbs" aria-label="Selected pictures">
            {items.map((it, i) => (
              <figure key={it.url} className="thumb pop">
                <img src={it.url} alt={`Selected picture ${i + 1}: ${it.name}`} />
                <button className="thumb-x" onClick={() => remove(i)} aria-label={`Remove ${it.name}`}><X size={14} /></button>
              </figure>
            ))}
            {items.length < MAX && <button className="thumb add" onClick={() => gallery.current?.click()} aria-label="Add more pictures"><Plus size={24} /></button>}
          </div>
        )}

        <label className="caption-field">
          <span>Add a caption (optional)</span>
          <input value={caption} onChange={(e) => { setCaption(e.target.value); if (e.target.value.length === 1) onEvent?.('caption') }} placeholder="Write something about this photo…" maxLength={140} />
        </label>

        <p className="sheet-note"><ImageIcon size={16} /> Pictures stay in this browser. Nothing is uploaded or sent to a real contact.</p>

        <div className="sheet-foot">
          <button className="btn btn-glass" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!items.length} onClick={send}><Send size={18} /> Send {items.length > 1 ? `${items.length} photos` : items.length === 1 ? '1 photo' : 'photo'}</button>
        </div>
      </div>
    </div>,
    document.querySelector('.app') || document.body,
  )
}
