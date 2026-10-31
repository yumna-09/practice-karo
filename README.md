# Digital Dost

**Small steps. More confidence.**

Digital Dost is a friendly, interactive digital-skills learning experience designed for parents, grandparents, and anyone who wants to feel more confident using everyday technology.

The project uses simulated environments so learners can practise without connecting a real account or risking personal information.

## MVP experience

- **Learning dashboard** — welcoming home, lesson cards, and locally saved progress.
- **WhatsApp practice simulator** — a pretend chat where learners can practise sending messages. It does not connect to WhatsApp or send real messages.
- **Digital companion** — contextual, rule-based guidance that explains common actions in simple language. The current demo does not call an external AI model.
- **Scam Detective** — interactive examples that teach warning signs such as urgency, suspicious links, unexpected prizes, and requests for OTPs or passwords.
- **Language selector UI** — English, Urdu, and Roman Urdu options are shown; full translated content is a future improvement.
- **Responsive layout** — designed for desktop and smaller screens.

## Tech stack

- React 19
- Vite 8
- JavaScript
- CSS (custom responsive design)
- Browser LocalStorage for demo progress

No paid API key or backend is required for the current demo.

## Run locally

Requirements: Node.js (current LTS recommended) and npm.

\`\`\`bash
git clone https://github.com/yumna-09/practice-karo.git
cd practice-karo
npm install
npm run dev
\`\`\`

Open the local URL printed by Vite (usually http://localhost:5173).

To create a production build:

\`\`\`bash
npm run build
npm run preview
\`\`\`

## Safety and limitations

- All conversations and suspicious-message examples are simulated.
- Do not enter real passwords, PINs, OTPs, CNIC details, bank information, or private messages.
- No WhatsApp, banking, phone, or other external account is connected.
- The companion uses predefined local guidance, not a live AI model.
- Progress is stored in the browser on the current device and is not synced across devices.
- The language selector is a UI placeholder; full Urdu and Roman Urdu translations are not yet implemented.
- This prototype is an educational demo, not a security product or a substitute for official support.

## Project structure

\`\`\`
src/
  App.jsx       Main application and interactive demo flows
  App.css       Component styling and responsive layout
  index.css     Global reset and accessibility focus styles
  main.jsx      React entry point
\`\`\`

## Team

Built for the Build4Better — Codesphere 3.0 hackathon. Add the final team member names, mentor details, and demo link before submission.

## Credits

- React and Vite for the application foundation.
- Google Fonts: DM Sans and Manrope.
- No external AI API is used in this MVP.
