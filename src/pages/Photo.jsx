import { useEffect, useState } from 'react'
import { CheckCircle2, Circle, Image as ImageIcon, Lock, MapPinOff, RotateCcw, Users } from 'lucide-react'
import { CONTACTS } from '../lib/replyEngine'
import { PageHead } from '../components/ui'
import Conversation from '../components/Conversation'

const STEPS = [
  { id: 'open', title: 'Open the chat', text: 'Ayesha’s chat is open. She is waiting for a family photo.' },
  { id: 'menu', title: 'Tap the paperclip', text: 'Find the paperclip beside the message box. It opens the attach menu.' },
  { id: 'pick', title: 'Choose your photo', text: 'Pick Photos & gallery, Camera, or a sample picture. Drag and drop works too.' },
  { id: 'sent', title: 'Add a caption and send', text: 'Preview your photo, write a few words if you like, then press Send.' },
]

export default function Photo({ chatApi, notify }) {
  const { chats, open, sendText, sendMedia, clearChat } = chatApi
  const contact = CONTACTS[0]
  const [done, setDone] = useState(['open'])
  useEffect(() => { open('ayesha') }, [open])

  const mark = (id) => setDone((d) => (d.includes(id) ? d : [...d, id]))
  const reset = () => { setDone(['open']); clearChat('ayesha') }
  const current = STEPS.find((s) => !done.includes(s.id))
  const pct = Math.round((done.length / STEPS.length) * 100)

  return (
    <div className="page">
      <PageHead eyebrow="Step by step · safe simulation" title="Share a" accent="photo">
        Learn to attach a picture, add a caption and send it. Use your own photo or a sample, nothing leaves this device.
      </PageHead>
      <div className="photo-layout rise d1">
        <aside className="steps-panel glass">
          <div className="steps-head"><span className="eyebrow">Your guide</span><strong>{pct}% complete</strong></div>
          <div className="progress-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${pct}%` }} /></div>
          <ol className="steps">
            {STEPS.map((s, i) => {
              const ok = done.includes(s.id)
              const now = current?.id === s.id
              return (
                <li key={s.id} className={ok ? 'step ok' : now ? 'step now' : 'step'}>
                  <span className="step-ico">{ok ? <CheckCircle2 size={24} /> : <Circle size={24} />}</span>
                  <div><b>{i + 1}. {s.title}</b><span className="read-me">{s.text}</span></div>
                </li>
              )
            })}
          </ol>
          {!current && <div className="win pop"><CheckCircle2 size={22} /><div><strong>Well done!</strong><span>You shared a photo. Try again with another picture.</span></div></div>}
          <button className="btn btn-glass full" onClick={reset}><RotateCcw size={18} /> Start again</button>
          <div className="tips">
            <h3>Before you share a photo</h3>
            <p><Users size={18} /> Check who you are sending it to.</p>
            <p><Lock size={18} /> Never send ID cards or bank papers by chat.</p>
            <p><MapPinOff size={18} /> Photos can reveal where you are. Share only with people you trust.</p>
            <p><ImageIcon size={18} /> Pictures up to 8 MB, six at a time.</p>
          </div>
        </aside>
        <Conversation
          hideBack
          contact={contact}
          chat={chats.ayesha}
          onSendText={(t) => sendText('ayesha', t)}
          onSendMedia={(i, c) => sendMedia('ayesha', i, c)}
          onClear={reset}
          onBlock={() => {}}
          onCheck={() => {}}
          onEvent={mark}
          notify={notify}
        />
      </div>
    </div>
  )
}
