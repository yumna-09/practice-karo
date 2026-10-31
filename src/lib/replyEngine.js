// Simulated contacts for the WhatsApp practice area. Replies are rule-based and local.
const mins = (n) => Date.now() - n * 60000

export const CONTACTS = [
  {
    id: 'ayesha', name: 'Ayesha', role: 'Friend · practice contact', hue: 38, online: true, kind: 'friend',
    opening: [
      { text: 'Assalam-o-alaikum! How are you today? 😊', ago: 14 },
      { text: 'Could you send me the family photo from yesterday?', ago: 13 },
    ],
  },
  {
    id: 'bilal', name: 'Cousin Bilal', role: 'Family · practice contact', hue: 170, online: false, kind: 'family',
    opening: [{ text: 'Are you coming for dinner on Friday? Mama is making biryani 🍛', ago: 95 }],
  },
  {
    id: 'coach', name: 'Dost Coach', role: 'Guide · answers how-to questions', hue: 200, online: true, kind: 'coach',
    opening: [
      { text: 'Hello! I’m your Dost Coach. Ask me how anything in WhatsApp works, like “how do I send a photo?”', ago: 3 },
    ],
  },
  {
    id: 'prize', name: 'Prize Centre', role: 'Unknown number · scam practice', hue: 8, online: true, kind: 'scam',
    opening: [
      { text: 'CONGRATULATIONS!!! You have won Rs. 50,000 in our lucky draw. Reply now with your CNIC and the code we send you to claim your prize.', ago: 22 },
    ],
  },
]

const INTENTS = [
  ['howru', /how are you|how r u|kaise ho|kese ho|kya haal|how('s| is) it going|how have you been/i],
  ['fine', /\b(i am|i'm|im) (fine|good|well|great|okay|ok|doing well)|alhamdulillah|theek|thik hun|\bfine\b/i],
  ['greet', /\b(assalam|salam|salaam|hello|hi|hey|good (morning|evening|afternoon))\b/i],
  ['thanks', /thank|shukriya|jazak|thx|appreciate/i],
  ['photo', /\b(photo|photos|picture|pictures|pic|pics|image|tasveer|snap)\b/i],
  ['bye', /\b(bye|allah hafiz|khuda hafiz|see you|good night|goodnight|take care)\b/i],
  ['food', /dinner|lunch|breakfast|food|eat|khana|biryani|chai|tea|cook/i],
  ['time', /\b(when|what time|kab|tomorrow|kal|tonight|friday|saturday|sunday|weekend)\b/i],
  ['love', /love|miss you|❤|😍|🥰|♥/i],
  ['laugh', /haha|hehe|lol|😂|🤣/i],
  ['yes', /^(yes|yeah|yep|sure|ok|okay|haan|han|ji|of course|definitely)\b/i],
  ['no', /^(no|nope|nahi|nahin|can'?t|cannot)\b/i],
]

const POOLS = {
  ayesha: {
    greet: ['Wa-alaikum-assalam! So lovely to hear from you 😊', 'Assalam-o-alaikum! I was just thinking of you.'],
    howru: ['I’m good, Alhamdulillah! Busy with the kids today. And you?', 'Doing well, thank you for asking! How about you?'],
    fine: ['Alhamdulillah, glad to hear that! 😊', 'That’s wonderful. So, did you get a chance to look for that photo?'],
    thanks: ['You’re always welcome! 💛', 'Anytime, dear!'],
    photo: ['Yes please! Tap the + button, choose the photo and press send 😊', 'I’m excited to see it! Send it whenever it’s ready.'],
    bye: ['Allah Hafiz! Talk soon 💛', 'Take care! Message me anytime.'],
    food: ['Now I’m hungry! We should plan a lunch together soon 😄', 'Chai and samosas sound perfect right now ☕'],
    time: ['Saturday works for me! Shall we say 5 o’clock?', 'Tomorrow is fine. I’ll message you in the morning.'],
    love: ['Aww, that made my day! 🥰', 'Love you too! Take care 💛'],
    laugh: ['Hehe 😄 you always make me laugh!', 'Haha! Stop it, I’m smiling at my phone 😂'],
    yes: ['Perfect! 👍', 'Great, thank you!'],
    no: ['No problem at all, we can do it another time.', 'That’s okay! No rush.'],
    fallback: ['Hmm, tell me more! 😊', 'I see! And how did that go?', 'That sounds nice. Anything else new with you?'],
    image: ['Received! 😍 What a lovely picture. Thank you so much!', 'Oh wow, it came through perfectly! Thank you 💛', 'Beautiful! I’ll show it to everyone at home 🥰'],
  },
  bilal: {
    greet: ['Wa-alaikum-assalam bhai/api! Kaise hain aap?', 'Salam! Long time no see 😄'],
    howru: ['Alhamdulillah, all good here. Family sends salaam!', 'Mazay mein! Busy week though.'],
    fine: ['Great to hear! So, will you join us on Friday?', 'Alhamdulillah! Mama was asking about you.'],
    thanks: ['No mention! That’s what family is for.', 'Welcome welcome!'],
    photo: ['Send it in the family group so everyone can see 😄', 'Sure, share it here, I’d love to see!'],
    bye: ['Allah Hafiz! See you Friday 👋', 'Khuda Hafiz!'],
    food: ['Mama is making biryani and kheer 🍛 Don’t be late!', 'Bring your appetite, there’s a lot of food!'],
    time: ['Friday at 7 in the evening. Does that work?', 'Come around 7. I’ll keep your seat ready 😄'],
    love: ['Aww, same here! ❤️', 'Love you too, cousin!'],
    laugh: ['😂😂 classic!', 'Haha okay okay!'],
    yes: ['Wonderful! I’ll tell Mama 🎉', 'Great, see you then!'],
    no: ['Oh, that’s a pity. Maybe next weekend then?', 'No worries, we’ll miss you!'],
    fallback: ['Okay! Let me know if you need anything.', 'Noted 👍', 'Sure, we can talk about it on Friday.'],
    image: ['Nice picture! Post it in the family group too 😄', 'Got it, thanks! Looks great 👌'],
  },
}

const COACH_TOPICS = [
  [/send.*(message|text)|how.*(reply|write)|type/i, 'To send a message: tap the box at the bottom, type your words, then press the round send button. Two ticks (✓✓) mean it was delivered.'],
  [/photo|picture|image|attach|media|gallery|camera/i, 'To send a photo: tap the + button, choose Gallery or Camera, pick your photo, add a caption if you like, then press Send. You can also try “Use a sample picture” here.'],
  [/tick|read|seen|blue|double/i, 'One tick (✓) means sent. Two ticks (✓✓) mean delivered. When the ticks turn bright, the person has read your message.'],
  [/scam|safe|otp|fraud|suspicious|link|password/i, 'Pause before you tap. Never share an OTP, PIN or password. If a message feels urgent or offers a prize, check it in the Spot a scam section.'],
  [/block|report|spam/i, 'To block a number: open the chat, tap the ⋯ menu and choose Block. You can try it safely with the Prize Centre chat.'],
  [/emoji|smiley|sticker/i, 'Tap the smiley face next to the message box to pick an emoji. Emojis are small pictures that show how you feel 😊'],
  [/delete|undo|mistake|wrong/i, 'If you sent something by mistake, press and hold the message, then choose Delete. In practice chats you can’t break anything!'],
]

const SCAM_STAGES = [
  'Thank you for replying! To claim your prize we must verify you. Please send your full CNIC number now.',
  'Almost done! A code will arrive on your phone. Send us that OTP code immediately or the prize will be cancelled!!!',
  'Why are you delaying? This is your last chance. Pay Rs. 500 processing fee on Easypaisa within 10 minutes!',
  'Our officer is waiting. Do not tell anyone. Reply with the code NOW!!!',
]

const memory = {}
function pick(key, list) {
  const used = (memory[key] = memory[key] || [])
  let choices = list.map((_, i) => i).filter((i) => !used.includes(i))
  if (!choices.length) { memory[key] = []; choices = list.map((_, i) => i) }
  const i = choices[Math.floor(Math.random() * choices.length)]
  memory[key].push(i)
  return list[i]
}

const SENSITIVE = /\b(otp|pin|password|cnic|cvv|card)\b|\b\d{4,}\b/i

// Returns { replies: [{text}], coach?: string }
export function getReply(contact, input, count = 0) {
  if (input.location) return contact.kind === 'scam' ? { replies: [{ text: 'Thanks! Where exactly do you live? Send your full address.' }], coach: 'Be careful: never share your location with someone you do not know.' } : { replies: [{ text: 'Got your location pin 📍 Thank you, that makes it easy to find you!' }] }
  const text = (input.text || '').trim()
  if (contact.kind === 'coach') {
    if (input.images?.length) return { replies: [{ text: 'Lovely, that photo shared nicely! You now know the key steps: + → choose → caption → send 🎉' }] }
    const t = COACH_TOPICS.find(([re]) => re.test(text))
    if (t) return { replies: [{ text: t[1] }] }
    if (/\b(hi|hello|salam|assalam)/i.test(text)) return { replies: [{ text: 'Wa-alaikum-assalam! What would you like to learn? Try “how do I send a photo?”' }] }
    return { replies: [{ text: 'Good question! I can explain sending messages, sharing photos, blue ticks, blocking numbers and staying safe. Which one would you like?' }] }
  }

  if (contact.kind === 'scam') {
    if (input.images?.length) return { replies: [{ text: 'Thank you for the picture. Now send your CNIC and OTP to finish!' }], coach: 'Be careful: scammers collect photos and ID pictures too. Only share them with people you know.' }
    if (SENSITIVE.test(text)) {
      return {
        replies: [{ text: 'Thank you! Processing… Send the second code that arrives on your phone as well!!!' }],
        coach: 'STOP — in real life, never share a CNIC, OTP, PIN or password with anyone who contacts you first. Use “Block and report” from the ⋯ menu.',
      }
    }
    if (/who|scam|fake|real|police|report|block|stop/i.test(text)) {
      return {
        replies: [{ text: 'This is 100% official!! Do not delay or your prize will be given to someone else.' }],
        coach: 'Well done for questioning it. Genuine organisations do not panic you. The safest move is to stop replying, block and report.',
      }
    }
    return { replies: [{ text: SCAM_STAGES[Math.min(count, SCAM_STAGES.length - 1)] }] }
  }

  const pool = POOLS[contact.id]
  if (input.images?.length) return { replies: [{ text: pick(contact.id + 'img', pool.image) }] }
  const found = INTENTS.filter(([, re]) => re.test(text)).map(([name]) => name)
  const replies = []
  const primary = found[0]
  if (primary) replies.push({ text: pick(contact.id + primary, pool[primary]) })
  if (found.length > 1 && found[1] !== primary && replies.length < 2 && found[1] !== 'greet') replies.push({ text: pick(contact.id + found[1], pool[found[1]]) })
  if (!replies.length) replies.push({ text: pick(contact.id + 'fb', pool.fallback) })
  return { replies }
}

export function seedChats() {
  const out = {}
  for (const c of CONTACTS) {
    out[c.id] = {
      typing: false,
      unread: c.id === 'ayesha' ? 0 : c.opening.length,
      msgCount: 0,
      messages: c.opening.map((m, i) => ({ id: `${c.id}-o${i}`, from: 'them', kind: 'text', text: m.text, time: mins(m.ago) })),
    }
  }
  return out
}
