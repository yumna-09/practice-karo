# Digital Dost

**Learn everyday technology. Practise safely. Build confidence.**

Digital Dost is a guided digital-literacy experience for parents, grandparents, and adults who want to feel more confident using everyday technology. It combines simulated practice, clear task instructions, and online-safety education in an accessible interface.

> Learn at your own pace, with practical guidance and a safe place to practise.

## Project overview

| Item | Details |
|---|---|
| Product | Digital Dost |
| Category | Digital literacy and online safety |
| Event | Build4Better — Codesphere 3.0 |
| Team | Yumna Kashif, Fatima Ali, Fatima Ashraf |
| Application | Responsive React web application |
| Repository | [fatimaashraf3/digital-dost](https://github.com/fatimaashraf3/digital-dost) |
| Development branch | Local working copy; changes have not been pushed |
| Deployment | Not yet verified |
| Status | Glass UI, live practice chat, scam checker and media sharing implemented; lint and build pass, desktop and mobile layouts checked in headless Chromium |

## Product principles

- **Learn by doing:** practise common tasks in clearly labelled simulations.
- **Patient guidance:** break unfamiliar tasks into manageable steps.
- **Safety first:** never connect practice flows to real accounts or financial services.
- **Accessible by default:** prioritise legible type, clear contrast, keyboard focus, reduced motion, and forgiving interactions.
- **Honest assistance:** distinguish guided, predefined content from live AI services.

## Current learning areas

### Learning home and guided companion
The home screen provides a task-oriented starting point and suggested topics. The companion currently uses local, predefined guidance and keyword matching. It is not connected to a live AI model or external AI API.

### WhatsApp practice
Four simulated contacts (Ayesha, Cousin Bilal, Dost Coach and a scam-practice "Prize Centre") reply in real time with typing indicators, sent/delivered/read ticks, unread badges and an emoji picker. Replies come from a local rule-based engine (`src/lib/replyEngine.js`), not a live AI and not real people. Learners can attach photos, block and report the scam contact, and tap "Check this message" to send a suspicious message to the scam checker. Chats live in memory and reset on reload.

### Share a photo
A guided four-step lesson beside a live practice chat. The **Add media** sheet supports gallery selection (multiple), camera capture on phones, drag and drop, built-in sample pictures, captions, up to six pictures at a time (8 MB each) and an enlarged preview. Images stay in the browser; nothing is uploaded.

### Spot a scam
Paste any message and get a risk score, a verdict (very likely a scam / suspicious / no common warning signs), highlighted phrases, plain-language reasons and safe next steps. It is a **rules-based, on-device helper** (`src/lib/scamEngine.js`) covering urgency, threats, prizes, OTP/PIN/CNIC requests, money requests, shortened links, impersonation, "new number" tricks and investment promises, including common Pakistani context (Easypaisa, JazzCash, BISP, HBL, CNIC). It cannot guarantee a message is safe and is not a live AI service. A second tab keeps the fictional practice quiz.

### Learning progress
Practice and review counters are stored in browser local storage. They are local to the current browser profile and are not synchronised between devices.

### Accessibility and preferences
The settings interface includes:
- A draggable 90%-125% text-size control.
- A higher-contrast preference.
- A reduced-motion preference.
- Read-aloud on/off, pause/resume, and stop controls.
- Speech-rate options and selection from voices exposed by the current browser/device.

Speech is provided by the browser Web Speech API. Available voices and pronunciation vary by operating system and browser. Roman Urdu support currently uses a small curated phrase map; it does **not** translate arbitrary English content. A complete translation experience requires a separately selected and tested translation solution.

## Technology

| Technology | Purpose |
|---|---|
| React 19 | Component-based user interface |
| JavaScript (ES modules) | Application logic |
| Vite | Development server and production build |
| CSS | Responsive teal glassmorphism design system and accessibility preferences |
| lucide-react | Icon set |
| @fontsource (Manrope, DM Sans) | Self-hosted fonts |
| Browser Web Speech API | Device-provided speech synthesis |
| Browser object URLs and file inputs | Local image preview, gallery, camera and drag-and-drop |
| Local storage | Guest preferences and demo progress |
| Git and GitHub | Version control and collaboration |

Node.js provides the JavaScript runtime used by npm and the Vite development/build tooling. Three.js is not currently part of the application; 3D should only be introduced if it materially improves a learning task.

## Getting started

### Requirements
- Node.js LTS (npm is included)
- Git (for cloning and version control)

### Install and run

```bash
git clone https://github.com/yumna-09/practice-karo.git
cd practice-karo
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

### Quality checks

```bash
npm run lint
npm run build
```

Both checks should be run after pulling the latest changes and before merging or deploying. A successful build does not replace browser-based functional, responsive, and accessibility testing. The visual refresh in this working copy has not yet been verified in a browser or deployed.

## Repository structure

```text
practice-karo/
├── public/                 # Static assets
├── src/
│   ├── App.jsx             # Main application and learning flows
│   ├── App.css             # Component styling and design system
│   ├── index.css           # Global styles
│   └── main.jsx            # React entry point
├── index.html              # Document metadata and app mount
├── package.json            # Dependencies and scripts
├── package-lock.json       # Dependency lockfile
├── vite.config.js          # Vite configuration
├── DESIGN.md               # Product visual and interaction rules
├── PRODUCT.md              # Product principles and audience
└── README.md               # Project documentation
```

## Safety, privacy, and limitations

Digital Dost is an educational prototype. Its practice interfaces are simulated and do not connect to WhatsApp, contacts, banking, payment, or identity services.

- Do not enter real passwords, PINs, OTPs, banking details, or private messages.
- The companion uses predefined local responses; it does not provide professional or emergency support.
- Scam examples are fictional and are not a live detection or verification service.
- Local image attachments are previewed in the browser only; they are not uploaded to a server.
- Settings and progress are stored locally. Clearing browser data or changing devices may remove or make this information unavailable.
- No login, cloud sync, backend, or production account system is currently implemented.
- Device voice availability and speech pronunciation are not guaranteed.
- Roman Urdu speech coverage is limited to curated phrases; arbitrary text is not translated.

## Development workflow

1. Create a focused feature branch from `main`.
2. Read `DESIGN.md` and `PRODUCT.md` before changing product UI or behaviour.
3. Implement a cohesive, testable change.
4. Update this README whenever features, dependencies, setup, limitations, or workflows change.
5. Run lint and production build checks, then test the affected flows in a browser.
6. Open a pull request with a concise summary, testing evidence, and known limitations.
7. Merge only after review and explicit team approval.

## Team

- **Yumna Kashif**
- **Fatima Ali**
- **Fatima Ashraf**

## Acknowledgements

- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [MDN Web Docs — Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [GitHub](https://github.com/)

## AI-assisted development

AI-assisted tools may support planning, implementation, debugging, and documentation. The team is responsible for reviewing generated code, validating behaviour, testing the product, and accurately representing implemented capabilities.

---

**Digital Dost — small steps, more confidence.**
