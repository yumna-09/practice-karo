import { useState } from 'react'
import { Search, MessageCircle } from 'lucide-react'
import { CONTACTS } from '../lib/replyEngine'
import { Avatar, PageHead } from '../components/ui'
import { fmtTime } from '../lib/format'
import Conversation from '../components/Conversation'

export default function WhatsApp({ chatApi, notify, goScam }) {
  const { chats, activeId, open, sendText, sendMedia, sendLocation, clearChat, block } = chatApi
  const [q, setQ] = useState('')
  const [mobileChat, setMobileChat] = useState(false)
  const contact = CONTACTS.find((c) => c.id === activeId)
  const list = CONTACTS.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()))
  const preview = (c) => {
    const last = [...chats[c.id].messages].reverse().find((m) => m.from !== 'coach')
    if (!last) return 'No messages yet'
    return last.kind === 'media' ? '📷 Photo' : last.kind === 'location' ? '📍 Location' : last.text
  }

  return (
    <div className="page">
      <PageHead eyebrow="Learn by doing · safe simulation" title="WhatsApp" accent="practice">
        Chat with practice contacts. They reply in real time, show typing and read ticks, and nothing is ever sent to a real person.
      </PageHead>
      <div className={mobileChat ? 'wa-layout show-chat rise d1' : 'wa-layout rise d1'}>
        <aside className="chat-list glass" aria-label="Chats">
          <div className="list-head"><h2><MessageCircle size={20} /> Chats</h2></div>
          <label className="search-box"><Search size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search contacts" aria-label="Search contacts" /></label>
          <ul>
            {list.map((c) => {
              const ch = chats[c.id]
              const last = ch.messages[ch.messages.length - 1]
              return (
                <li key={c.id}>
                  <button className={c.id === activeId ? 'chat-row active' : 'chat-row'} onClick={() => { open(c.id); setMobileChat(true) }} aria-current={c.id === activeId}>
                    <Avatar name={c.name} hue={c.hue} online={c.online} />
                    <span className="row-text">
                      <span className="row-top"><strong>{c.name}</strong><small>{last ? fmtTime(last.time) : ''}</small></span>
                      <span className="row-bottom"><span className={ch.typing ? 'typing-label' : ''}>{ch.typing ? 'typing…' : preview(c)}</span>{ch.unread > 0 && <b className="badge" aria-label={`${ch.unread} unread`}>{ch.unread}</b>}</span>
                    </span>
                  </button>
                </li>
              )
            })}
            {!list.length && <li className="no-results">No contact found.</li>}
          </ul>
        </aside>
        <Conversation
          key={contact.id}
          contact={contact}
          chat={chats[contact.id]}
          onBack={() => setMobileChat(false)}
          onSendText={(t) => sendText(contact.id, t)}
          onSendMedia={(i, c) => sendMedia(contact.id, i, c)}
          onSendLocation={(pl) => sendLocation(contact.id, pl)}
          onClear={() => clearChat(contact.id)}
          onBlock={() => block(contact.id)}
          onCheck={goScam}
          notify={notify}
        />
      </div>
    </div>
  )
}
