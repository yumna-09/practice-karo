import { Ban, Camera, MapPin, MessageCircle, ScanSearch } from 'lucide-react'

export const MILESTONES = [
  { id: 'message', icon: MessageCircle, title: 'Send a message', text: 'Reply to a practice contact.', page: 'whatsapp' },
  { id: 'photo', icon: Camera, title: 'Share a photo', text: 'Attach and send a picture.', page: 'photo' },
  { id: 'location', icon: MapPin, title: 'Share a location', text: 'Send a pin from the + menu.', page: 'whatsapp' },
  { id: 'check', icon: ScanSearch, title: 'Check a message', text: 'Use the scam checker once.', page: 'scam' },
  { id: 'block', icon: Ban, title: 'Block a scammer', text: 'Block the Prize Centre chat.', page: 'whatsapp' },
]
