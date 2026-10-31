# Digital Dost

**Small steps. More confidence.**

Digital Dost is a friendly, safe, interactive digital-skills learning platform designed for parents, grandparents, and anyone who wants to feel more confident using everyday technology.

Instead of asking learners to experiment in real apps, Digital Dost provides guided simulations where they can practise familiar digital tasks, learn at their own pace, and recognise common online-safety risks.

> Learn everyday digital skills in a patient, low-pressure environment — one small step at a time.

---

## Project Information

| Field | Details |
|---|---|
| **Project** | Digital Dost |
| **Project Category** | Digital literacy and online safety |
| **Event** | Build4Better — Codesphere 3.0 |
| **Team** | Yumna Kashif, Fatima Ali, Fatima Ashraf |
| **Application Type** | Interactive web application |
| **Status** | Hackathon MVP — in progress |
| **Repository** | [github.com/yumna-09/practice-karo](https://github.com/yumna-09/practice-karo) |
| **Live Demo** | To be added after deployment |
| **Demo Video** | To be added before final submission |

---

## Table of Contents

- [The Problem](#the-problem)
- [Our Solution](#our-solution)
- [Core Experience](#core-experience)
- [MVP Features](#mvp-features)
- [User Journey](#user-journey)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Safety, Privacy and Responsible Design](#safety-privacy-and-responsible-design)
- [Current Scope and Limitations](#current-scope-and-limitations)
- [Team](#team)
- [Acknowledgements and Credits](#acknowledgements-and-credits)
- [AI-Assisted Development Transparency](#ai-assisted-development-transparency)

---

## The Problem

Everyday digital tasks can feel confusing or intimidating for people who have limited experience with smartphones and online services. A small mistake — such as trusting an unexpected message, tapping an unfamiliar link, or sharing a one-time password — can create unnecessary stress or expose someone to fraud.

Many people need a place where they can ask basic questions, practise common actions, and build confidence without fear of making a real-world mistake.

Digital Dost is designed around that need: patient explanations, practical learning, and safer digital habits.

## Our Solution

Digital Dost turns digital-skills learning into a guided, hands-on experience.

Learners can explore simulated everyday interactions, practise simple actions, and review examples of suspicious messages. A friendly digital companion provides contextual guidance in clear, approachable language.

The experience is designed to be:

- **Approachable** — clear language and a calm, welcoming interface.
- **Practical** — learn by trying actions in simulated environments.
- **Patient** — move at your own pace, repeat exercises, and ask for help.
- **Safety-first** — practise without connecting real personal accounts.
- **Confidence-building** — celebrate small steps rather than expecting prior technical knowledge.

---

## Core Experience

### 1. Learning Dashboard

The dashboard introduces the learning space, highlights available practice activities, and displays a simple progress overview.

### 2. WhatsApp Practice Simulator

A simulated chat lets learners practise replying to a conversation and understand the basic messaging flow.

The simulator is a demonstration environment. It does not connect to WhatsApp, access contacts, or send real messages.

### 3. Digital Companion

A friendly on-screen guide offers contextual help, quick suggestions, and simple explanations when a learner feels unsure.

**Current implementation:** the companion uses predefined, local guidance. It does not currently call a live AI model or external AI API.

### 4. Scam Detective

Learners review sample messages and decide whether each looks safe or suspicious. After submitting an answer, they receive an explanation of the warning signs.

Examples cover patterns such as:
- Urgent threats and pressure to act immediately.
- Suspicious or unexpected links.
- Unexpected prize claims.
- Requests for OTPs, PINs, passwords, or sensitive details.

The examples are educational simulations, not live scam detection.

---

## MVP Features

| Feature | Purpose | Current state |
|---|---|---|
| Learning dashboard | Welcome learners and show practice activities | Implemented |
| WhatsApp practice | Practise a simulated conversation | Implemented |
| Contextual digital guide | Explain common actions with predefined help | Implemented |
| Scam Detective | Identify warning signs in sample messages | Implemented |
| Basic progress tracking | Save simple progress in the current browser | Implemented |
| Language selector | Display English, Urdu, and Roman Urdu choices | UI available; translations incomplete |
| Responsive interface | Support desktop and smaller screens | Responsive styling included |

---

## User Journey

The intended first-time experience is:

1. **Arrive at the dashboard** and choose a learning activity.
2. **Open WhatsApp practice** and read a simulated incoming message.
3. **Try replying** in the practice chat.
4. **Ask the digital companion for help** if a step is confusing.
5. **Complete the practice activity** and see the progress feedback.
6. **Try Scam Detective** and learn how to recognise suspicious messages.

The journey is designed to demonstrate how practice, patient guidance, and online-safety awareness can work together.

---

## Technology Stack

| Category | Technology | Role |
|---|---|---|
| Frontend framework | React | Component-based user interface |
| Build tool | Vite | Local development and production builds |
| Language | JavaScript (ES modules) | Application logic |
| Styling | CSS3 | Layout, visual system, and responsive behaviour |
| State and effects | React Hooks | Interactive application state |
| Browser storage | LocalStorage | Local demo progress persistence |
| Typography | Google Fonts — DM Sans and Manrope | Interface typography |
| Version control | Git and GitHub | Source control and collaboration |

The current MVP does not require a backend, paid API key, or external AI service.

---

## Getting Started

### Prerequisites

Install the following before running the project:

- [Node.js](https://nodejs.org/) (a current LTS release is recommended)
- npm (included with Node.js)
- [Git](https://git-scm.com/) (optional if downloading the repository ZIP)

### 1. Clone the repository

```bash
git clone https://github.com/yumna-09/practice-karo.git
```

### 2. Open the project folder

```bash
cd practice-karo
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local address printed in the terminal. Vite commonly uses:

```text
http://localhost:5173
```

### 5. Create a production build

```bash
npm run build
```

### 6. Preview the production build locally

```bash
npm run preview
```

---

## Project Structure

```text
practice-karo/
├── public/                 # Static public assets
├── src/
│   ├── assets/             # Application assets
│   ├── data/               # Supporting local data
│   ├── App.jsx              # Main application and learning flows
│   ├── App.css              # Application components and responsive styles
│   ├── index.css            # Global styles and focus states
│   ├── i18n.js              # Language-related helper module
│   └── main.jsx             # React application entry point
├── index.html               # HTML document and metadata
├── package.json             # Dependencies and npm scripts
├── package-lock.json        # Dependency lockfile
├── vite.config.js           # Vite configuration
└── README.md                # Project documentation
```

*Note: This is a high-level guide to the repository structure. Files may evolve as the MVP develops.*

---

## Safety, Privacy and Responsible Design

Digital Dost is a learning prototype. Its practice activities are intentionally separated from real-world accounts and services.

- The chat is simulated; no WhatsApp account or contact list is accessed.
- The sample scam messages are static educational examples; the application does not inspect a user's real messages.
- The digital companion currently provides predefined local guidance; no conversation is sent to an external AI service.
- Progress is stored locally in the browser and is not synchronised to a server.
- The current MVP does not process banking transactions or connect to financial services.
- Learners should never enter real passwords, PINs, OTPs, CNIC details, banking information, or private messages into a practice environment.

Digital Dost is not a cybersecurity product, a fraud-detection guarantee, or a replacement for official service-provider support.

---

## Current Scope and Limitations

This repository represents an evolving hackathon MVP. The following items are not represented as completed functionality:

- Live AI-powered conversation or voice assistance.
- Complete Urdu and Roman Urdu translations.
- Real WhatsApp, phone, banking, or identity-service integrations.
- Banking and video-call practice simulators.
- Cloud accounts, learner profiles, or cross-device progress synchronisation.
- Automated analysis of real messages, links, or attachments.
- Production-grade authentication, backend services, or analytics.

These items may be considered for future development, subject to time, feasibility, and privacy and safety requirements.

---

## Team

Digital Dost is being developed by:

| Team member | Role |
|---|---|
| **Yumna Kashif** | Team member |
| **Fatima Ali** | Team member |
| **Fatima Ashraf** | Team member |

*Roles and individual contributions can be updated as the final work is confirmed.*

---

## Acknowledgements and Credits

- [React](https://react.dev/) — user interface library.
- [Vite](https://vite.dev/) — development server and build tooling.
- [DM Sans](https://fonts.google.com/specimen/DM+Sans) and [Manrope](https://fonts.google.com/specimen/Manrope) — typography.
- [GitHub](https://github.com/) — source control and project hosting.

---

## AI-Assisted Development Transparency

AI-assisted tools may be used during ideation, implementation, debugging, and documentation.

The team remains responsible for understanding the code, reviewing generated changes, testing the application, verifying claims in this README, and being able to explain the implementation during evaluation.

The current Digital Companion is rule-based and uses predefined guidance. This README does not claim that a live AI model is integrated.

---

## Project Status

**Hackathon MVP — in progress.**

The repository and feature descriptions will be updated as implementation, testing, deployment, and the final demo are completed.

---

*Digital Dost — learn at your own pace, practise with confidence.*
