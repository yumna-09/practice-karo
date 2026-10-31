import { useCallback, useEffect, useRef, useState } from 'react'
import { CONTACTS, getReply, seedChats } from '../lib/replyEngine'

let uid = 0
const nid = () => `m${Date.now()}-${uid++}`

// Real-time-feeling simulated conversations: sent -> delivered -> read -> typing -> reply.
export function useChats({ onMilestone }) {
  const [chats, setChats] = useState(seedChats)
  const [activeId, setActiveId] = useState('ayesha')
  const timers = useRef([])
  const activeRef = useRef('ayesha')
  const counts = useRef({})

  useEffect(() => { activeRef.current = activeId }, [activeId])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const later = (fn, ms) => { timers.current.push(setTimeout(fn, ms)) }
  const patch = useCallback((id, fn) => setChats((all) => ({ ...all, [id]: fn(all[id]) })), [])

  const setStatus = useCallback((id, mid, status) =>
    patch(id, (c) => ({ ...c, messages: c.messages.map((m) => (m.id === mid ? { ...m, status } : m)) })), [patch])

  const open = useCallback((id) => {
    setActiveId(id)
    patch(id, (c) => ({ ...c, unread: 0 }))
  }, [patch])

  const coachNote = useCallback((id, text) => {
    patch(id, (c) => ({ ...c, messages: [...c.messages, { id: nid(), from: 'coach', kind: 'text', text, time: Date.now() }] }))
  }, [patch])

  const deliver = useCallback((id, input, msg) => {
    const contact = CONTACTS.find((c) => c.id === id)
    const count = (counts.current[id] = (counts.current[id] || 0) + 1)
    const { replies, coach } = getReply(contact, input, count - 1)
    later(() => setStatus(id, msg.id, 'delivered'), 600)
    const online = contact.online
    later(() => setStatus(id, msg.id, 'read'), online ? 1500 : 4000)
    let t = online ? 1800 : 4400
    replies.forEach((r, i) => {
      const typingFor = Math.min(3200, 900 + r.text.length * 28)
      later(() => patch(id, (c) => ({ ...c, typing: true })), t)
      t += typingFor
      later(() => patch(id, (c) => ({
        ...c,
        typing: false,
        unread: activeRef.current === id ? 0 : c.unread + 1,
        messages: [...c.messages, { id: nid(), from: 'them', kind: 'text', text: r.text, time: Date.now() }],
      })), t)
      t += i < replies.length - 1 ? 500 : 0
    })
    if (coach) later(() => coachNote(id, coach), t + 700)
  }, [patch, coachNote, setStatus])

  const sendText = useCallback((id, text) => {
    const clean = text.trim()
    if (!clean) return
    const msg = { id: nid(), from: 'me', kind: 'text', text: clean, time: Date.now(), status: 'sent' }
    patch(id, (c) => ({ ...c, messages: [...c.messages, msg] }))
    onMilestone?.('message')
    deliver(id, { text: clean }, msg)
  }, [patch, deliver, onMilestone])

  const sendMedia = useCallback((id, images, caption = '') => {
    if (!images.length) return
    const msg = { id: nid(), from: 'me', kind: 'media', images, text: caption.trim(), time: Date.now(), status: 'sent' }
    patch(id, (c) => ({ ...c, messages: [...c.messages, msg] }))
    onMilestone?.('photo')
    deliver(id, { text: caption, images }, msg)
  }, [patch, deliver, onMilestone])

  const sendLocation = useCallback((id, place) => {
    const msg = { id: nid(), from: 'me', kind: 'location', place, text: '', time: Date.now(), status: 'sent' }
    patch(id, (c) => ({ ...c, messages: [...c.messages, msg] }))
    onMilestone?.('location')
    deliver(id, { text: '📍 location', location: place }, msg)
  }, [patch, deliver, onMilestone])

  const clearChat = useCallback((id) => patch(id, (c) => ({ ...c, messages: [], typing: false })), [patch])

  const block = useCallback((id) => {
    patch(id, (c) => ({ ...c, blocked: true, typing: false }))
    coachNote(id, 'Blocked and reported. That is exactly the right move. No more messages will arrive from this number.')
    onMilestone?.('block')
  }, [patch, coachNote, onMilestone])

  return { chats, activeId, open, sendText, sendMedia, sendLocation, clearChat, block }
}
