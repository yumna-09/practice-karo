# Threat Model — Digital Dost

## Assessment scope and method

- **Repository:** `yumna-09/practice-karo`
- **Assessed revision:** `main` at `bb6a3ca7b854c051800144b52ffbae420615fd30` (reviewed 2026-10-31).
- **Application type:** client-side React 19 application built with Vite 8.
- **Evidence reviewed:** repository tree, `src/App.jsx`, `src/App.css`, `src/index.css`, `src/main.jsx`, `index.html`, `package.json`, `package-lock.json`, `vite.config.js`, `eslint.config.js`, `.gitignore`, `README.md`, visible branch metadata and recent commit history.
- **Important limitation:** this is a source/configuration review of the repository state, not a penetration test, runtime browser test, host configuration review, exhaustive secret-history scan, or third-party vulnerability scan. No live deployment or backend configuration was available in the repository evidence.

The README describes the current MVP as frontend-only and says it has no backend, database, production authentication, live AI service, or cloud account system. The inspected source supports that description. Do not interpret future-state recommendations below as controls already implemented.

## System overview and data flow

1. A browser loads the static Vite-built React application.
2. React renders the dashboard, simulated WhatsApp practice, Scam Detective, and progress view.
3. A learner may enter text into the companion or practice-chat fields. The companion chooses from local, predefined responses; user and assistant messages are held in React component state.
4. Progress counters are read from and written to browser `localStorage` under `dd-completed` and `dd-scams`.
5. Read-aloud uses the browser's Web Speech API (`window.speechSynthesis` and `SpeechSynthesisUtterance`) and locally available browser/device voices.
6. CSS imports DM Sans and Manrope from Google Fonts. This creates an external browser request to Google Fonts.
7. The current code does not implement a server API, database, authentication provider, file upload, webhook, cloud storage, or AI API call.

## Assets

| Asset | Location / mechanism | Security relevance |
|---|---|---|
| Application source and build output | Repository; browser-delivered static bundle | Public source and client code can be inspected by any visitor |
| Simulated chat content | `src/App.jsx` React state and constants | No real chat account or contact data is accessed |
| User-entered practice/companion text | React state in `src/App.jsx` | Remains in the active page state; no app backend submission is implemented |
| Progress counters | Browser `localStorage` keys `dd-completed`, `dd-scams` | User-controlled, browser-local, not confidential or authoritative |
| Static scam examples and explanations | `scamExamples` in `src/App.jsx` | Educational content; not a live fraud-detection asset |
| Browser speech output | Web Speech API | Text is passed to browser speech synthesis; voice availability depends on device |
| Dependency supply chain | `package.json`, `package-lock.json` | Build/runtime integrity and dependency compromise matter |
| Repository and Git history | Public GitHub repository | Source, configuration, and committed history are publicly readable |

## Trust boundaries

1. **Visitor/browser boundary:** all React logic and browser storage execute on a visitor-controlled device. A user can inspect or alter local state and JavaScript.
2. **Static hosting boundary:** the built assets are served by a hosting provider when deployed. The repository contains no host-specific configuration, so deployed headers, TLS policy, access rules, logs, and build settings are not verified here.
3. **External font boundary:** `src/App.css` imports Google Fonts. A browser may contact Google's font infrastructure; this is a third-party network request.
4. **GitHub repository boundary:** the repository is public. Anyone can read source and visible commit history. Branch protection for `main` is reported disabled by GitHub.
5. **Browser API boundary:** speech synthesis is provided by the browser/OS and may use installed voices. The app does not provide its own speech backend.

There is no evidenced application server, database boundary, identity provider, file storage boundary, or AI-provider boundary in the current revision.

## Actors

- **Learner / visitor:** uses public practice activities and enters optional practice text.
- **Curious or malicious visitor:** can inspect public source, modify browser state, submit arbitrary text, or automate page interactions.
- **Repository contributor / maintainer:** can modify source and dependency declarations if they have repository write access.
- **GitHub and package registry infrastructure:** hosts source and supplies npm dependencies.
- **Static hosting provider (if configured outside this repository):** serves built files; provider identity and settings are not evidenced.
- **Google Fonts:** receives browser requests for externally hosted font resources.
- **Browser / operating system:** runs the application and speech synthesis.

No authenticated learner, admin role, moderator, API consumer, or webhook caller is implemented in the inspected source.

## Entry points and attack surface

- Public web page and JavaScript bundle.
- Companion text input and submit handler.
- WhatsApp practice reply input and submit handler.
- Scam Detective answer buttons (fixed choices).
- Navigation and read-aloud controls.
- Browser storage values read during component initialization.
- Browser speech synthesis integration.
- Google Fonts stylesheet request.
- Public GitHub repository, branches, commits, and dependency files.

There are no application HTTP API routes or upload endpoints in the inspected repository.

## Threats and attack scenarios

Risk ratings are qualitative and reflect the current MVP, not a formal likelihood model.

### T1 — Browser-local progress tampering

- **Threat category:** integrity / repudiation.
- **Scenario:** a visitor or script with access to the browser profile changes `dd-completed` or `dd-scams` in developer tools or via same-origin JavaScript.
- **Impact:** displayed learning progress can be falsified or corrupted. It does not grant server privileges because no server-side authorization or account data exists.
- **Likelihood:** High (the storage is directly user-controlled).
- **Severity:** Low for the current demo; could become High if later treated as authoritative assessment or linked to accounts.
- **Existing mitigations:** progress is explicitly described in UI/README as local demo progress; no privileged server action is tied to the counters.
- **Missing mitigations:** schema/range validation when reading localStorage; a trusted server-side source if progress later has material value.
- **Classification:** confirmed design limitation / missing validation, not a server-side privilege vulnerability.
- **Evidence:** `src/App.jsx` initializes counters with `Number(localStorage.getItem(...))` and writes them with `localStorage.setItem(...)`.

### T2 — Sensitive text entered into practice fields

- **Threat category:** privacy / unintended disclosure.
- **Scenario:** a learner pastes real private messages, OTPs, passwords, identity details, or financial information into the companion or simulated chat. The current code keeps messages in component state, but the browser, extensions, screenshots, clipboard, or later modifications may expose the content.
- **Impact:** sensitive data may be visible on the device or to browser extensions/other local users. The app has no backend submission in the current code, but the user may misunderstand a simulator as a private vault.
- **Likelihood:** Medium (the input fields accept arbitrary text and the UI explicitly invites free-form questions).
- **Severity:** Medium; potentially High for credentials or financial information.
- **Existing mitigations:** the composer footer warns users not to enter passwords or OTPs; README safety section gives similar warnings; the chat is simulated and not connected to WhatsApp.
- **Missing mitigations:** client-side warning/confirmation for sensitive-looking strings is not evidenced; privacy notice near every input; automated clearing policy is not implemented.
- **Classification:** potential privacy risk requiring user-behaviour awareness; no confirmed exfiltration path found.
- **Evidence:** companion and WhatsApp forms in `src/App.jsx`; safety copy in `README.md`.

### T3 — Public source and configuration reconnaissance

- **Threat category:** information disclosure / supply-chain reconnaissance.
- **Scenario:** an attacker reads the public repository and uses its source, dependencies, file paths, and commit history to prepare targeted attacks or identify future deployment weaknesses.
- **Impact:** implementation details are public. No secret value was identified in the current source review, but the public repository makes any accidentally committed credential immediately exposed.
- **Likelihood:** High (repository visibility is public).
- **Severity:** Low for intended source disclosure; High if an actual credential is committed.
- **Existing mitigations:** `.gitignore` excludes `*.local`, including common `.env.local` naming; no environment variable or credential use is visible in current application code.
- **Missing mitigations:** `.env` itself is not explicitly ignored; no repository secret-scanning configuration was found in the inspected tree; full history scanning and GitHub secret-scanning settings are unverified.
- **Classification:** confirmed exposure of source by design; missing preventive control for accidental secret commits; no confirmed leaked secret.
- **Evidence:** repository metadata reports `private: false`; `.gitignore`; absence of environment-file references in the inspected source/configuration.

### T4 — Third-party font request

- **Threat category:** third-party data disclosure / availability dependency.
- **Scenario:** a browser loads the imported Google Fonts stylesheet and makes requests to Google-controlled infrastructure. Font availability or network filtering can affect typography.
- **Impact:** visitor network metadata such as IP address and request metadata is exposed to the font provider; the app relies on an external service for those fonts.
- **Likelihood:** High when the page is loaded and the CSS import is active.
- **Severity:** Low to Medium depending on privacy expectations and deployment jurisdiction.
- **Existing mitigations:** no learner message or progress data is passed in the font URL in the inspected CSS.
- **Missing mitigations:** self-hosting or documented third-party font disclosure; restrictive Content Security Policy is not evidenced.
- **Classification:** confirmed third-party request / privacy consideration, not a confirmed exploit.
- **Evidence:** Google Fonts `@import` at the start of `src/App.css`.

### T5 — Browser-side script execution through user content

- **Threat category:** XSS.
- **Scenario:** a user submits HTML/script-like text into the companion or practice chat. If rendered as executable HTML, this could execute in the page.
- **Impact:** a successful same-origin script execution could read or modify browser-local progress and manipulate the page.
- **Likelihood:** Low based on the current rendering path.
- **Severity:** High if executable injection were possible.
- **Existing mitigations:** the inspected UI renders user messages through normal React text interpolation (`{message.text}`) rather than `dangerouslySetInnerHTML`; no direct HTML injection sink was found in `src/App.jsx`.
- **Missing mitigations:** no dedicated input length limits or explicit security tests are evidenced; future rich-text rendering must preserve safe escaping.
- **Classification:** no confirmed XSS vulnerability in the reviewed render path; potential regression risk.
- **Evidence:** message list JSX in `src/App.jsx`; no `dangerouslySetInnerHTML` found in reviewed application source.

### T6 — Malformed localStorage value breaks progress display

- **Threat category:** availability / integrity.
- **Scenario:** malformed or non-numeric values are stored under the two progress keys. `Number(...)` may produce `NaN`, which can then be displayed and persisted.
- **Impact:** progress display becomes inaccurate or confusing; no server-side impact.
- **Likelihood:** Medium for a user who edits storage or if stored values become corrupted.
- **Severity:** Low.
- **Existing mitigations:** values are numeric counters and bounded on the practice-completion increment path.
- **Missing mitigations:** validation, finite-number checks, and fallback defaults on initial read.
- **Classification:** confirmed robustness weakness, not a security boundary bypass.
- **Evidence:** `useState` initializers and localStorage effects in `src/App.jsx`.

### T7 — Dependency compromise or vulnerable transitive package

- **Threat category:** supply chain.
- **Scenario:** a direct or transitive npm dependency contains a vulnerability or is compromised, affecting build output or development tooling.
- **Impact:** malicious code could enter build artifacts or developer environment.
- **Likelihood:** Unknown; cannot be assigned from lockfile alone.
- **Severity:** Potentially High depending on affected package and exploitability.
- **Existing mitigations:** lockfile pins resolved versions; dependency graph is relatively small and React/Vite-based.
- **Missing mitigations:** no automated dependency update or audit workflow was found in the repository tree; npm audit results and advisory matching were not run as part of this source-only review.
- **Classification:** potential risk requiring verification; no confirmed vulnerable package asserted.
- **Evidence:** `package.json` and `package-lock.json`; repository tree contains no visible workflow files.

### T8 — Unverified hosting controls

- **Threat category:** transport / deployment misconfiguration.
- **Scenario:** the static site is deployed with missing or weak security headers, overly permissive content sources, or unreviewed preview access.
- **Impact:** reduced browser-side protections or unintended preview exposure.
- **Likelihood:** Unknown because hosting configuration is outside the inspected repository.
- **Severity:** Medium to High depending on actual deployed headers and exposure.
- **Existing mitigations:** no host-level mitigation can be confirmed from this repository.
- **Missing mitigations:** no Vercel configuration, response-header policy, CSP, or deployment workflow is present in the reviewed tree.
- **Classification:** potential risk requiring deployment verification, not a confirmed live misconfiguration.
- **Evidence:** repository tree has no `vercel.json`, `netlify.toml`, server config, or CI workflow; hosting settings are not available here.

## Existing security mechanisms

- Simulated WhatsApp chat; no real WhatsApp connection or contact access is implemented.
- Static fictional scam examples; no real-message scanning or external link opening is implemented in the reviewed app.
- Local predefined companion guidance; no live AI request is implemented.
- Progress is stored locally rather than transmitted to an app backend.
- React text interpolation is used for chat message content.
- Visible warnings advise users not to enter passwords or OTPs.
- Keyboard focus styling exists for buttons and inputs.
- CSS includes a reduced-motion media query.
- `.gitignore` excludes dependencies, build output, logs, and `*.local` files.

## Missing controls and recommendations

These are recommendations only; no changes have been made.

1. Explicitly ignore all local environment files (including `.env`) before introducing any environment configuration.
2. Enable GitHub secret scanning / push protection where available and periodically scan Git history.
3. Add a project-appropriate Content Security Policy and other security headers at the eventual hosting layer; validate font and script sources before enforcing CSP.
4. Run `npm audit` and review advisories; add automated dependency update/security checks.
5. Validate and clamp localStorage values; treat them as untrusted, non-authoritative input.
6. Keep sensitive-data warnings visible at every free-text entry point.
7. If accounts or cloud progress are introduced, design authentication, authorization, session management, database access policies, rate limits, retention, and deletion before implementation.
8. If file attachments are introduced, define allowed formats, size limits, local-only versus server upload behaviour, metadata handling, malware scanning requirements, and retention before release.
9. Review deployed Vercel settings, HTTPS, response headers, preview access, environment variables, build logs, and domain configuration after deployment.
10. Add security regression tests for input rendering, storage parsing, and any future API boundary.

## Risk summary

| Finding | Classification | Likelihood | Severity |
|---|---|---:|---:|
| Browser-local progress can be edited | Confirmed design limitation | High | Low |
| Sensitive text may be entered by mistake | Potential privacy risk | Medium | Medium |
| Public source can aid reconnaissance | Confirmed exposure by design | High | Low; High if secrets are committed |
| Google Fonts external request | Confirmed third-party request | High | Low–Medium |
| XSS through current chat interpolation | No confirmed vulnerability; regression risk | Low | High if introduced |
| Malformed localStorage values | Confirmed robustness weakness | Medium | Low |
| Dependency advisory/compromise | Requires verification | Unknown | Potentially High |
| Hosting header/preview configuration | Requires verification | Unknown | Medium–High |

## Verification limitations

- No authenticated access to Vercel project settings, deployment logs, domain settings, or environment-variable inventory was available.
- No running production URL was supplied or confirmed in repository metadata.
- No runtime penetration testing, browser-extension testing, npm advisory database check, or complete historical secret scan was performed.
- No server-side code, database schema, API routes, webhook handlers, or upload service exists in the inspected current tree.
