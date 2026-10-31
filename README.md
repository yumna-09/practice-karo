# Digital Dost

**Team:** Shadowblades  
**Members:** Yumna Kashif, Fatima Ali, Fatima Ashraf  
**Event:** Build4Better, Codesphere 3.0 — NED University of Engineering and Technology  
**Build date:** Saturday, 31 October 2026 (9:00 AM to 5:00 PM PKT)  
**Project type:** Responsive web app for digital-literacy practice  
**Built with:** React 19, Vite, CSS, lucide-react

> A calm, safe place where parents and grandparents can practise everyday technology, spot scams and build confidence, instead of calling their children every time they get stuck.

---

## Submission details

| Item | Details |
|---|---|
| **GitHub repository** | [github.com/yumna-09/digital-dost](https://github.com/yumna-09/digital-dost) |
| **Demo video (max 2 min)** | [Watch the demo](https://drive.google.com/file/d/1R6a5J5DRRDAoKnSuZ6k6sBMAA3wkRipi/view?usp=sharing) |
| **Pitch deck** | [View the pitch deck](https://docs.google.com/presentation/d/1sb7Dtim4ye80ItaxpeiSt_TMjyO6z-EC/edit?usp=drivesdk&ouid=111669070603267105976&rtpof=true&sd=true) |

---

## The problem

**Who it is for:** Parents, grandparents and other adults who did not grow up with technology and feel unsure about smartphones, messaging, photos, links and online safety.

Many people get stuck on everyday digital tasks that feel simple to younger generations. They may struggle to use a chat app, send a photo or recognise a scam message. When they get stuck, they often call family members for help. Some avoid useful digital tools altogether because they are afraid of making mistakes.

The issue is not intelligence. Technology is often built for people who already speak its language.

## Our solution

Digital Dost is a practice space where learners can try common digital tasks in a clearly labelled simulation, one step at a time, with plain language and no risk.

The app explains what an action does **before** asking the learner to do it, then provides friendly feedback afterwards.

It brings people closer to technology instead of doing things for them.

### Product principles

- **Teach one task at a time.**
- **Explain first, then practise.** No judgement; repetition is welcome.
- **Safe by design.** Nothing connects to real accounts, banks or contacts.
- **Honest.** The app always says what is local, predefined or simulated.

## Core features

| Feature | What the learner does |
|---|---|
| **Learning home** | Picks a task from a clear start page and sees their progress. |
| **WhatsApp practice** | Chats with four practice contacts (a friend, a cousin, a guide and a scam sender). Sees typing indicators, sent / delivered / read ticks, unread badges and an emoji picker. |
| **Share a photo** | Follows a four-step lesson, then adds pictures from the gallery, the camera, drag and drop or sample pictures, writes a caption and sends. |
| **Share a location** | Opens the `+` menu, chooses **Location**, follows four steps and sends a map-pin card (a sample place, or the real position if the browser is allowed). |
| **Spot a scam** | Pastes any message and gets a risk score, highlighted warning phrases, plain reasons and safe next steps. A practice tab has fictional examples. |
| **Block a scammer** | Blocks and reports the "Prize Centre" practice contact and learns why. |
| **My progress** | Sees skill milestones, a progress ring and charts (activity, skills split, skill by skill). |
| **Settings** | Sets text size (90% to 125%), higher contrast, reduced motion and read-aloud (voice, language, speed). |

## What is real and what is simulated

| Area | Status |
|---|---|
| Scam checker | **Works for real.** Rule-based, runs entirely in the browser. |
| Photo picking and previews | **Works for real.** Gallery, camera and drag and drop use real files, kept in the browser. |
| Location in the chat | **Works for real** when the learner allows the browser to share their position. Otherwise a sample place is used. |
| Read-aloud | **Works for real** through the browser Web Speech API. Available voices depend on the device. |
| Settings and progress | **Works for real.** Saved in this browser with `localStorage`. |
| Chat contacts and replies | **Simulated.** Replies come from a local rule-based engine, not real people and not live AI. |
| Delivery and read ticks | **Simulated.** Timed to feel realistic. |
| Sending a photo or location | **Simulated.** Nothing is uploaded or sent to anyone. |
| WhatsApp, banking, accounts | **Not connected.** No real integration of any kind. |
| Guided companion | **Predefined.** Keyword matching on written guidance, not an AI model. |

## Setup and run

### Requirements

- [Node.js](https://nodejs.org/) LTS (version 18 or newer) with npm
- [Git](https://git-scm.com/)

### Install and start

```bash
git clone https://github.com/yumna-09/digital-dost.git
cd digital-dost
npm install
npm run dev
```

Open the address Vite prints, usually `http://localhost:5173`.

### Other scripts

| Command | Description |
|---|---|
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

### Trying the main flow (about 2 minutes)

1. Open **WhatsApp practice** and send Ayesha a message.
2. Tap `+` and try **Photos** and **Location**.
3. Open the **Prize Centre** chat, tap **Check this message**, then block the sender.
4. Open **My progress** to see skills unlock and the charts fill in.

No login or test account is needed.

## Technology stack and dependencies

| Technology | Purpose |
|---|---|
| React 19 | User interface |
| Vite | Dev server and build |
| JavaScript (ES modules) | Application logic |
| CSS | Design system and responsive layout |
| lucide-react | Icons |
| `@fontsource-variable/inter` | Interface font (self-hosted) |
| `@fontsource-variable/plus-jakarta-sans` | Headings and brand font (self-hosted) |
| `@fontsource-variable/lora` | Accent font (self-hosted) |
| Web Speech API | Optional read-aloud |
| Geolocation API | Optional real location in the location lesson |
| `localStorage` | Preferences and progress |

There is no backend, database or external API. Exact versions are in `package.json`.

## Project structure

```text
digital-dost/
├── brain/security/        # Security notes and checklists used during development
├── public/                # Favicon, icons, manifest, robots.txt, sitemap.xml
├── src/
│   ├── components/        # Conversation, MediaSheet, LocationSheet, shared UI
│   ├── hooks/             # useChats (simulated chats), useSpeech (read-aloud)
│   ├── lib/               # replyEngine, scamEngine, samples, milestones, format
│   ├── pages/             # Home, WhatsApp, Photo, Scam, Progress, Settings
│   ├── styles/            # base.css (tokens, glass), app.css (layout, pages)
│   ├── App.jsx            # App shell, navigation, preferences, milestones
│   └── main.jsx           # Entry point and font imports
├── index.html             # Meta tags, Open Graph, JSON-LD
├── DESIGN.md              # Visual and interaction rules
├── PRODUCT.md             # Audience, scope and principles
└── README.md
```

## Design and accessibility

A cream **liquid-glass** interface with three core colours.

| Token | Hex | Use |
|---|---|---|
| Cream | `#F5EFE4` | Background |
| Mushroom | `#B8A99A` | Neutrals, tints, icon chips, borders |
| Dark Root | `#3A2D25` | Text, primary buttons, active navigation |

### Accessibility choices

- Text size control from 90% to 125% with no clipped controls
- Higher-contrast mode, and reduced motion (also follows the OS setting)
- Visible keyboard focus, a skip link and labelled controls
- Touch targets of about 44px or larger
- Safety status is always written in words and icons, never by colour alone
- Optional read-aloud with pause and stop

Full rules are in [`DESIGN.md`](DESIGN.md) and [`PRODUCT.md`](PRODUCT.md).

## Privacy and safety

- Everything runs in the browser. Photos, locations, messages and settings are never uploaded.
- The app never asks for real OTPs, PINs, passwords or banking details, and tells learners not to type them.
- Scam examples are fictional. The scam checker is a helper, not a verification service, and cannot promise a message is safe.
- The app never implies that a real message, payment or account action happened.

## Known limitations

- All chat contacts, replies, delivery ticks and sent items are **simulated**. Chats reset when the page reloads.
- The companion and contacts use rule-based replies, not a live AI model.
- The scam checker uses fixed rules. It can miss new tricks and can flag harmless messages.
- Progress and settings live in one browser profile. There is no login or sync across devices.
- Roman Urdu read-aloud uses a small phrase list and does not translate arbitrary text.
- Voices and pronunciation depend on the operating system and browser.
- The real-location option needs browser permission and a secure origin (`localhost` or HTTPS).
- The location card shows a drawn pin, not a live map. Opening it launches an external map in a new tab.
- Automated tests and wider device and accessibility testing are still to do.
- The app is **not deployed**. It runs locally with `npm run dev`. The site address in `index.html`, `robots.txt` and `sitemap.xml` is a placeholder.

## AI tools and third-party credits

### AI tools used

| Tool | Role |
|---|---|
| Claude (Anthropic) | Coding assistance, debugging, interface and colour refinement, and drafting documentation. |
| ChatGPT (OpenAI) | Additional coding assistance, reviewing implementation ideas and refining documentation. |

The team chose the direction and features, reviewed and tested the work, and can explain and demonstrate every part of the submitted implementation.

### Third-party resources

- [React](https://react.dev/) and [Vite](https://vite.dev/)
- [Lucide](https://lucide.dev/) icons
- [Fontsource](https://fontsource.org/) packages for Inter, Plus Jakarta Sans and Lora
- [MDN Web Docs](https://developer.mozilla.org/) for Web Speech and Geolocation API references

Libraries support our own implementation. No existing complete project was used as the base.

## Team

**Team Shadowblades**

- Yumna Kashif
- Fatima Ali
- Fatima Ashraf

Built for **Build4Better, Codesphere 3.0**, organised by the Department of Software Engineering, NED University of Engineering and Technology.

---

**Digital Dost: small steps, more confidence.**
