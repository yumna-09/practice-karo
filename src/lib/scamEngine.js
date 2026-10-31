// On-device, rule-based message checker. Nothing is sent anywhere.
// It looks for well-known warning signs; it is NOT a guarantee and is not a live AI model.

const SHORTENERS = /\b(bit\.ly|tinyurl\.com|t\.co|cutt\.ly|rb\.gy|is\.gd|shorturl\.at|goo\.gl|ow\.ly|tiny\.cc|wa\.link)\b/i
const RISKY_TLD = /\b[a-z0-9-]+\.(xyz|top|click|live|icu|buzz|cfd|sbs|work|gq|tk|ml)\b/i
const ANY_LINK = /(https?:\/\/[^\s]+|www\.[^\s]+|\b[a-z0-9-]+\.(com|net|org|pk|co|info|link|site|online)(\/[^\s]*)?\b)/i

export const RULES = [
  {
    id: 'credentials', icon: 'key', weight: 40, label: 'Asks for a secret code or private details',
    why: 'Real banks, couriers and apps never ask you to send an OTP, PIN, password, CVV or CNIC by message or phone.',
    re: /\b(send|share|give|provide|enter|confirm|verify|tell|submit|reply with)\b[^.!?\n]{0,40}\b(otp|pin|password|passcode|cvv|cnic|verification code|security code|one.?time (code|password)|card number|account number|login)\b/i,
  },
  {
    id: 'credmention', icon: 'key', weight: 18, label: 'Mentions an OTP, PIN, password or CNIC',
    why: 'Messages that bring up secret codes or ID numbers deserve extra caution, especially if you did not start the request.',
    re: /\b(otp|pin code|password|cvv|cnic|passcode|verification code)\b/i,
    skipIf: /\b(never|do not|don'?t|do ?nt|not)\s+(share|tell|give|disclose)\b/i,
  },
  {
    id: 'urgency', icon: 'clock', weight: 22, label: 'Creates urgency or a deadline',
    why: 'Scammers want you to rush so you do not stop to think or ask someone you trust.',
    re: /\b(urgent(ly)?|immediately|right now|act now|asap|hurry|last chance|final (notice|warning)|expires?( today| soon)?|today only|within \d+\s*(minutes?|mins?|hours?|hrs?)|in \d+\s*(minutes?|mins?|hours?)|abhi|foran|jaldi|fori)\b/i,
  },
  {
    id: 'threat', icon: 'alert', weight: 26, label: 'Threatens to block, close or punish',
    why: 'Threats about blocked accounts, police or legal action are a pressure tactic to make you click or pay.',
    re: /\b((will|to) be (blocked|closed|suspended|deactivated|disabled|locked|cancelled|terminated)|account (is |has been )?(blocked|suspended|locked|compromised|closed)|legal action|arrest(ed)?|\bfir\b|police case|penalty|sim (will be )?(blocked|closed)|band ho)\b/i,
  },
  {
    id: 'prize', icon: 'gift', weight: 30, label: 'Promises a prize, reward or free money',
    why: 'You cannot win a contest you never entered. Surprise prizes are one of the oldest tricks.',
    re: /\b(you (have )?won|winner|lucky draw|lottery|jackpot|congratulations|claim your|cash prize|free (gift|money|cash|recharge)|bisp|benazir|ehsaas|inam|inaam|jeet(a|e|ay)?)\b/i,
  },
  {
    id: 'money', icon: 'wallet', weight: 26, label: 'Asks for money or a payment',
    why: 'Unexpected requests for fees, transfers, gift cards or mobile-wallet payments should always be verified first.',
    re: /\b(send|transfer|pay|deposit|load|top ?up)\b[^.!?\n]{0,45}\b(rs\.?|pkr|rupees?|money|fee|amount|charges?|easypaisa|jazzcash|bitcoin|usdt|gift card|western union|\$\s?\d+|\d{3,})|\b(rs\.?|pkr)\s?\d[\d,]{2,}\b|\b(delivery|customs|clearance|processing|registration|advance) (fee|charges?|payment)\b/i,
  },
  {
    id: 'shortlink', icon: 'link', weight: 26, label: 'Uses a shortened or odd-looking link',
    why: 'Short links hide where they really go. Odd endings like .xyz or .top are often used by scammers.',
    test: (t) => { const m = t.match(SHORTENERS) || t.match(RISKY_TLD); return m ? [m.index, m[0].length] : null },
  },
  {
    id: 'link', icon: 'link', weight: 14, label: 'Contains a link to tap',
    why: 'Do not tap links in unexpected messages. Open the official app or type the website address yourself.',
    test: (t) => { const m = t.match(ANY_LINK); return m ? [m.index, m[0].length] : null },
  },
  {
    id: 'impersonation', icon: 'badge', weight: 12, label: 'Pretends to be an official organisation',
    why: 'Scammers copy the names of banks, couriers and government offices. Contact them on a number you already trust.',
    re: /\b(hbl|ubl|mcb|meezan|allied bank|bank alfalah|easypaisa|jazzcash|nadra|fbr|pta|ntn|ehsaas|bisp|tcs|leopards|pakistan post|dhl|fedex|customs|state bank|customer (care|support)|support team|security team|bank officer|official)\b/i,
  },
  {
    id: 'family', icon: 'users', weight: 20, label: 'Claims to be family or a friend in trouble',
    why: 'Messages like "new number" or "I am in an emergency" are used to ask for quick money. Call the person on their old number.',
    re: /\b(new number|changed (my )?number|lost my phone|phone (is )?(broken|stolen)|i('| a)?m in (trouble|an emergency)|emergency|accident|hospital|stuck (at|in)|dont call|don'?t call)\b/i,
  },
  {
    id: 'moneyoffer', icon: 'trend', weight: 26, label: 'Offers easy money, a job or an investment',
    why: 'Promises of daily income, doubled money or work-from-home pay with no experience are warning signs of fraud.',
    re: /\b(earn (rs\.?|pkr|\$)?\s?\d|per day|daily (income|profit)|work from home|part.?time job|guaranteed (profit|returns?)|double your|investment (plan|opportunity)|commission|crypto|forex|no experience)\b/i,
  },
  {
    id: 'secrecy', icon: 'eye', weight: 16, label: 'Asks you to keep it secret',
    why: 'Genuine requests are never secret. Scammers want to stop you from asking family or the bank.',
    re: /\b(do not tell|don'?t tell|keep (this )?(a )?secret|confidential|between us|tell no ?one)\b/i,
  },
  {
    id: 'generic', icon: 'user', weight: 10, label: 'Uses a vague greeting',
    why: 'Phrases like "Dear customer" or "Dear user" show the sender does not actually know who you are.',
    re: /\b(dear (customer|user|sir\/madam|valued|winner|client|account holder|beneficiary)|respected (customer|user))\b/i,
  },
]

const STEPS = {
  scam: [
    'Do not tap any link, call any number in the message, or reply.',
    'Never share an OTP, PIN, password, CNIC or card number.',
    'If it claims to be your bank or courier, open their official app or call the number printed on your card.',
    'Show it to someone you trust, then block and report the sender.',
  ],
  suspicious: [
    'Pause. Do not reply, pay or tap links yet.',
    'Check with the sender using a phone number or app you already trust.',
    'Look up the organisation yourself on its official website or app.',
    'If you are unsure, ask a family member or friend before acting.',
  ],
  safe: [
    'No common warning signs were found, but this check is not a guarantee.',
    'Only open attachments or links you were expecting.',
    'If anything asks for money or private details later, pause and verify.',
  ],
}

function mergeRanges(ranges) {
  const sorted = ranges.map(([s, len]) => [s, s + len]).sort((a, b) => a[0] - b[0])
  const out = []
  for (const r of sorted) {
    const last = out[out.length - 1]
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1])
    else out.push([...r])
  }
  return out
}

export function analyzeMessage(raw) {
  const text = (raw || '').trim()
  if (text.length < 8) return { ok: false, reason: 'short' }

  const hits = []
  const ranges = []
  for (const rule of RULES) {
    if (rule.skipIf && rule.skipIf.test(text)) continue
    let span = null
    if (rule.re) {
      const m = text.match(rule.re)
      if (m) span = [m.index, m[0].length]
    } else if (rule.test) span = rule.test(text)
    if (span) {
      // avoid double-counting links
      if (rule.id === 'link' && hits.some((h) => h.id === 'shortlink')) continue
      if (rule.id === 'credmention' && hits.some((h) => h.id === 'credentials')) continue
      hits.push({ id: rule.id, icon: rule.icon, label: rule.label, why: rule.why, weight: rule.weight, snippet: text.substr(span[0], span[1]) })
      ranges.push(span)
    }
  }

  const letters = text.replace(/[^A-Za-z]/g, '')
  const upper = text.replace(/[^A-Z]/g, '')
  if (letters.length > 20 && upper.length / letters.length > 0.5) {
    hits.push({ id: 'caps', icon: 'type', label: 'Uses a lot of CAPITAL LETTERS', why: 'Shouting text is meant to alarm you. Official messages are usually written calmly.', weight: 8, snippet: '' })
  }
  if (/!{3,}/.test(text)) {
    hits.push({ id: 'bang', icon: 'type', label: 'Uses many exclamation marks', why: 'Excited or alarming punctuation is often used to rush you.', weight: 6, snippet: '' })
  }

  let score = hits.reduce((n, h) => n + h.weight, 0)
  if (hits.filter((h) => h.weight >= 12).length >= 3) score += 12
  score = Math.min(100, score)

  const verdict = score >= 55 ? 'scam' : score >= 22 ? 'suspicious' : 'safe'
  const titles = {
    scam: 'Very likely a scam',
    suspicious: 'Looks suspicious',
    safe: 'No common warning signs found',
  }
  const summaries = {
    scam: 'This message has several classic scam warning signs. Treat it as dangerous.',
    suspicious: 'A few warning signs were found. Do not act on it until you have checked it another way.',
    safe: 'It does not match the usual scam patterns, but no checker can be certain.',
  }

  return {
    ok: true,
    text,
    score,
    verdict,
    title: titles[verdict],
    summary: summaries[verdict],
    hits: hits.sort((a, b) => b.weight - a.weight),
    highlights: mergeRanges(ranges),
    steps: STEPS[verdict],
  }
}

export const SAMPLE_MESSAGES = [
  { label: 'Bank warning', text: 'URGENT: Your HBL account will be blocked in 2 hours. Verify your CNIC and OTP now at http://hbl-secure.xyz/login to avoid closure.' },
  { label: 'Prize message', text: 'Congratulations! You have won Rs. 50,000 in the BISP lucky draw. Send your CNIC number and pay Rs. 500 processing fee on Easypaisa to claim.' },
  { label: 'Family message', text: 'Assalam-o-alaikum! I shared yesterday’s family photos in our family group. Have a look whenever you get time.' },
  { label: 'New number', text: 'Hi, this is my new number, I lost my phone. I am in an emergency, please send Rs. 5000 to Easypaisa right now. Don’t call, tell no one.' },
]
