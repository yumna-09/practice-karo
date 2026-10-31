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
| Repository | [yumna-09/practice-karo](https://github.com/yumna-09/practice-karo) |
| Development branch | `digital-dost-completion` |
| Deployment | Not yet verified |
| Status | Active MVP development; local QA required |

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
A fictional chat allows learners to practise writing a reply. The image attachment interaction accepts a local image (up to 5 MB), previews it in the browser, and adds it to the simulated conversation. It does not upload the image or send a real message.

### Scam Detective
A set of fictional examples teaches warning signs such as urgency, suspicious links, unexpected prizes, requests for credentials, and unusual payment requests. This is a learning exercise, not automated scam detection.

### Learning progress
Practice and review counters are stored in browser local storage. They are local to the current browser profile and are not synchronised between devices.

### Accessibility and preferences
The current settings interface includes:
- Light and dark themes.
- Standard, large, and extra-large text options.
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
| CSS | Layout, responsive styling, themes, and accessibility preferences |
| Browser Web Speech API | Device-provided speech synthesis |
| Browser FileReader | Local image preview in the practice simulator |
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

Both checks should be run after pulling the latest changes and before merging or deploying. A successful build does not replace browser-based functional, responsive, and accessibility testing.

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
