# Attack Surface — Digital Dost

## Assessment scope

Repository: `yumna-09/practice-karo`  
Revision: `main` at `bb6a3ca7b854c051800144b52ffbae420615fd30`  
Review date: 2026-10-31

The current project is a static client-side React/Vite application. The inspected repository contains no backend source, API route directory, database integration, authentication provider, file-upload service, webhook, or server-side admin interface. The README describes these as absent from the current MVP.

## Architecture at a glance

- **Entry document:** `index.html`
- **Application bootstrap:** `src/main.jsx`
- **Main UI and interaction logic:** `src/App.jsx`
- **Application styles:** `src/App.css`, `src/index.css`
- **Build configuration:** `vite.config.js`
- **Dependencies and scripts:** `package.json`, `package-lock.json`
- **Repository:** public GitHub repository
- **Deployment:** no deployment configuration is present in the inspected repository; actual external hosting is unverified.

## Public endpoints

### Application endpoints

The source tree does not define application server endpoints or API routes.

When deployed as a static website, the host will expose the configured website URL and static assets. The actual hostname, route fallback behaviour, caching, response headers, TLS configuration, and hosting access rules cannot be determined from this repository.

### External browser request

- **Google Fonts:** `src/App.css` imports DM Sans and Manrope from `fonts.googleapis.com`. This is a confirmed third-party browser request.

## Internal endpoints

- No internal HTTP endpoints, server-to-server routes, RPC endpoints, or service mesh endpoints are defined in the reviewed project.
- Vite's development server is a local development tool, not an application backend endpoint.
- `vite.config.js` registers the React plugin and does not configure a proxy or API server.

## Authentication and authorization surfaces

- No login, registration, password reset, OAuth, session cookie, JWT, or identity-provider flow is implemented in the reviewed source.
- No roles, permissions, RBAC, or admin authorization checks exist in the current application.
- The profile-like sidebar block is a static UI element labelled as a learning space; it is not an authenticated profile.
- Since the current application has no server-side protected resources, there is no evidenced server authorization boundary.

**Potential future risk:** adding user accounts, cloud progress, or admin tools without a server-side authorization design would create a new attack surface. Browser-side route hiding is not authorization.

## User inputs

### Companion input

- Location: companion composer in `src/App.jsx`.
- Input: arbitrary text in a React-controlled input.
- Handling: submitted text is appended to React component state; a local keyword matcher chooses predefined guidance.
- Network: no app API call is made by the reviewed handler.
- Rendering: message text is interpolated as React text content.

### WhatsApp practice input

- Location: simulated chat composer in `src/App.jsx`.
- Input: arbitrary text.
- Handling: text is appended to in-memory React state and a toast is shown.
- Network: no WhatsApp integration or app backend submission is implemented.
- Rendering: current practice conversation is a fixed mock-up; typed reply is added to the companion's in-memory message list, not transmitted to WhatsApp.

### Scam Detective

- Location: answer buttons in `src/App.jsx`.
- Input: fixed `safe` or `scam` choice.
- Handling: local state compares the selected choice to a static expected answer.
- No free-form message upload or live scanning is performed.

### Storage-derived input

- Location: `dd-completed` and `dd-scams` keys in browser localStorage.
- Handling: read as strings and converted with `Number()`.
- Trust: values are under the visitor's control and must not be treated as authoritative.

## File uploads

- No file input, attachment picker, upload endpoint, object storage SDK, or upload validation is present in the reviewed current source.
- The companion's photo guidance explicitly says no personal photo is uploaded.
- Any future photo-sending simulator must be assessed separately. A local-only preview using browser object URLs has a different risk profile from server upload. If uploads are added, validate size/type, avoid trusting file extensions or browser MIME claims alone, define retention/deletion, and prevent public exposure of private files.

## Database access

- No database client, ORM, SQL query, schema, migration, or database connection string was found in the reviewed repository.
- The current app stores only two simple progress counters in browser localStorage.
- No server-side database access control can be assessed because no database is present in this implementation.

## Storage

### Browser storage

- `localStorage` keys: `dd-completed`, `dd-scams`.
- Values represent demo progress counters.
- Data is local to the browser origin/profile; it is not synchronized with a server.
- Local storage is readable and writable by same-origin JavaScript and the user through browser developer tools. Do not store passwords, tokens, or sensitive personal data here.

### Other storage

- No IndexedDB, Cache API application data store, cloud object storage, or server file storage integration was identified in the reviewed source.

## Webhooks

- No webhook endpoint, subscription callback, webhook secret, or webhook provider integration was found.

## Third-party integrations

| Integration | Evidence | Data / exposure |
|---|---|---|
| Google Fonts | CSS `@import` in `src/App.css` | Browser requests font resources from Google; no learner text is embedded in the font URL |
| Browser Web Speech API | `window.speechSynthesis`, `SpeechSynthesisUtterance` in `src/App.jsx` | Selected text is passed to browser/OS speech synthesis |
| GitHub | Repository and Git history | Public source and commit metadata are accessible |
| npm package ecosystem | `package.json`, `package-lock.json` | Dependencies are downloaded at install/build time |
| Live AI service | None | README and source indicate predefined local companion guidance |
| WhatsApp | None | UI simulator only; no real account, contact, or messaging integration |

## Admin surfaces

- No admin dashboard, admin API, moderation queue, support console, or role-gated settings screen was found.
- Repository maintainer access is a GitHub account/repository governance matter, not an application admin feature.
- GitHub reports the repository as public and the `main` branch as unprotected in the metadata reviewed.

## Network and deployment exposure

- Static web delivery is expected for the React/Vite app, but the deployment provider and live URL were not confirmed by repository configuration.
- No `vercel.json`, `netlify.toml`, Dockerfile, reverse-proxy configuration, server runtime, or CI workflow appeared in the reviewed current repository tree.
- HTTPS, HSTS, CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CORS behaviour, preview deployment access, cache policy, and provider logging cannot be verified from source alone.
- No CORS policy is configured in the app source; because no application API exists, there is no app API CORS boundary to evaluate. Do not label this as a confirmed CORS vulnerability.
- GitHub branch metadata reports `main` protection disabled.

## Dependencies and externally reachable surfaces

### Direct dependencies

- Runtime: `react`, `react-dom`.
- Development/build/lint: `vite`, `@vitejs/plugin-react`, ESLint packages and related tooling.
- Exact resolved versions are recorded in `package-lock.json`.

The lockfile is evidence of dependency versions, not evidence that packages are vulnerability-free. No current advisory matching or full npm audit was performed for this document.

### Externally reachable surfaces

- Public website/static files once deployed.
- Google Fonts browser requests.
- Public GitHub repository and Git history.
- npm registry/package distribution during dependency installation.

## Key findings

### F1 — Public source repository

**Severity: Low for source disclosure; potentially High if secrets are committed → Evidence:** GitHub repository metadata reports `private: false` → **Risk:** attackers can inspect implementation and any accidentally committed credentials → **Affected location:** GitHub repository and commit history → **Why it matters:** source and historical commits are public → **Recommended fix:** keep secrets out of source, enable secret scanning/push protection, and review history before production.

### F2 — No environment-file exclusion for plain .env

**Severity: Medium → Evidence:** `.gitignore` ignores `*.local` but does not explicitly ignore `.env` → **Risk:** a future root `.env` file may be staged and committed → **Affected location:** root `.gitignore` → **Why it matters:** repository is public → **Recommended fix:** explicitly ignore environment files before adding credentials. No file was changed.

### F3 — Local progress is untrusted

**Severity: Low → Evidence:** `src/App.jsx` reads and writes progress counters via localStorage → **Risk:** progress can be altered or corrupted by the browser user or same-origin script → **Affected location:** `dd-completed`, `dd-scams` storage values → **Why it matters:** local browser state is not an authoritative record → **Recommended fix:** validate values and keep them non-authoritative; use server-side persistence and authorization only if real accounts are later introduced.

### F4 — External font dependency

**Severity: Low–Medium → Evidence:** Google Fonts CSS import in `src/App.css` → **Risk:** visitor browser metadata is sent to the third-party font provider; font loading depends on external availability → **Affected location:** global stylesheet import → **Why it matters:** this is a third-party network boundary → **Recommended fix:** document the request or consider self-hosting fonts after licensing review.

### F5 — Hosting configuration is not verifiable

**Severity: Medium (unverified) → Evidence:** no hosting config or deployment workflow found in repository tree → **Risk:** deployed security headers, preview protection, and environment settings may be absent or misconfigured → **Affected location:** external hosting project and deployment settings → **Why it matters:** browser security controls often depend on host response headers → **Recommended fix:** inspect actual Vercel project settings and deployed response headers before public release.

## Explicitly absent in the reviewed implementation

- Application API endpoints
- Authentication and session handling
- Authorization/RBAC
- Backend or database
- Server-side file uploads or cloud storage
- Webhooks
- Live AI provider integration
- WhatsApp, banking, or messaging integrations
- Application admin surface

These absences are current scope facts, not automatically vulnerabilities. Reassess if the architecture changes.
