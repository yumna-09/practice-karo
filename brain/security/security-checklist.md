# Security Checklist — Digital Dost

## Scope and status definitions

- **Assessed revision:** `main` at `bb6a3ca7b854c051800144b52ffbae420615fd30`.
- **Application:** client-side React/Vite MVP; no backend, database, authentication, file upload, or application API is evidenced in the reviewed source.
- This checklist describes current evidence and release recommendations. It does not certify the app as secure.
- No source code or configuration was changed during this assessment.

Status labels:
- **Present:** directly evidenced in current code/configuration.
- **Absent:** feature/control is not implemented in the current project.
- **Partial:** some related behaviour exists, but not a complete control.
- **Unverified:** requires runtime, provider, or external configuration access.
- **Recommended:** future control; not currently implemented.

## Findings format

Important findings use: **Severity → Evidence → Risk → Affected location → Why it matters → Recommended fix**.

## Checklist

### 1. Authentication

- [x] Current MVP does not implement login, registration, password reset, or identity-provider integration. **Absent by design.**
- [ ] If accounts are introduced, use a maintained authentication provider or secure server-side implementation.
- [ ] Require appropriate account verification and recovery protections for the future account model.
- [ ] Do not create a fake client-only login screen that implies protected accounts.

**Finding — Informational / scope:** Evidence: no authentication flow in `src/App.jsx`, `src/main.jsx`, or dependencies. Risk: no account identity exists, so per-user cloud data cannot be protected. Affected location: application architecture. Why it matters: adding private learner data requires identity. Recommended fix: design authentication before adding cloud accounts; not needed for current guest-only local demo.

### 2. Authorization / RBAC

- [x] No application roles or authorization checks are present.
- [ ] If admin or learner roles are introduced, enforce permissions server-side for every protected action.
- [ ] Do not treat hidden buttons or client route checks as authorization.

**Finding — Absent future control:** Severity: High if protected resources are later added without server enforcement. Evidence: no backend/API or role model exists. Risk: unauthorized access to future learner/admin data. Affected location: future server routes and data layer. Why it matters: browser state can be modified by users. Recommended fix: implement deny-by-default server authorization and test object-level access.

### 3. Session and token security

- [x] No session cookie, JWT, refresh token, OAuth token, or app-managed session was identified.
- [ ] If authentication is added, use secure, HttpOnly, SameSite cookies where appropriate; define expiry, rotation, logout, and revocation.
- [ ] Never store session secrets in localStorage or expose them in Vite client variables.

**Finding — Not applicable to current code:** No session mechanism exists. Reassess before login is implemented.

### 4. Input validation

- [ ] Add reasonable maximum lengths for companion and practice text.
- [ ] Validate and clamp localStorage counter values before displaying or incrementing them.
- [x] Current user text is rendered using React text interpolation, not a raw HTML sink in the reviewed message renderer.
- [ ] Add regression tests for HTML-like and unusually long input.

**Finding — Low → Evidence:** `src/App.jsx` converts localStorage strings with `Number()` without checking finite values or expected ranges → **Risk:** malformed values can display as `NaN` or corrupt demo progress → **Affected location:** initializers for `dd-completed` and `dd-scams` → **Why it matters:** local storage is user-controlled → **Recommended fix:** validate numeric, finite, non-negative values and apply sensible bounds/defaults.

### 5. Injection

- [x] No SQL/NoSQL query construction exists because no database is present.
- [x] No shell command execution or server template engine is present in the application source.
- [x] Reviewed chat message rendering uses React text nodes.
- [ ] Preserve escaping if markdown, rich text, HTML rendering, or third-party content is added.
- [ ] Test user-controlled content against all future rendering sinks.

**Finding — No confirmed current injection vulnerability:** Evidence: reviewed message renderer uses `{message.text}`; no `dangerouslySetInnerHTML` was found in `src/App.jsx`. Risk: future unsafe rendering could introduce DOM XSS. Affected location: message rendering. Why it matters: executable same-origin script could access local browser data. Recommended fix: retain React escaping and add security tests if rich text is introduced.

### 6. XSS / CSRF

- [x] Current chat text uses React's normal escaped text rendering.
- [ ] Define a Content Security Policy at the hosting layer.
- [ ] Add output-encoding tests for all future dynamic content.
- [x] No cookie-authenticated state-changing API exists, so a current application CSRF endpoint is not present.
- [ ] If cookie-authenticated APIs are added, implement CSRF protections and SameSite policy.

**Finding — Medium (deployment control unverified) → Evidence:** no CSP or response-header configuration is present in the reviewed repository → **Risk:** browser-side defence-in-depth may be missing after deployment → **Affected location:** static hosting response headers → **Why it matters:** CSP can limit the impact of some script injection paths → **Recommended fix:** configure and test a CSP compatible with the actual scripts/styles/font sources. Do not claim a current exploitable XSS solely from missing CSP.

### 7. API security

- [x] No application API routes or API client are present in the reviewed code.
- [ ] If APIs are added, validate schemas, authenticate protected operations, authorize objects, use TLS, and return minimal data.
- [ ] Avoid exposing internal stack traces or secrets in API errors.

**Finding — Not applicable to current implementation:** no app API exists. Reassess when server functions or external APIs are introduced.

### 8. Rate limiting and abuse

- [x] No server endpoint or account creation endpoint exists.
- [ ] If a backend, AI API, or account flow is added, implement per-IP/account limits, quotas, abuse detection, and cost controls.
- [ ] Add client-side length/interaction limits for usability, but do not rely on client limits as abuse prevention.

**Finding — Future recommendation:** current local-only keyword responder has no server-side billable AI endpoint to abuse.

### 9. File uploads

- [x] No file input, attachment picker, upload route, or storage service was found.
- [ ] Before adding photos, decide whether preview is local-only or uploaded.
- [ ] Validate file size and actual content type; do not trust filename extension alone.
- [ ] Define allowed formats, safe image processing, metadata handling, retention, deletion, and access rules.
- [ ] If server upload is introduced, isolate storage and scan files according to the threat model.

**Finding — Not applicable currently:** no upload surface exists. Do not describe photo attachment support as implemented.

### 10. Database security

- [x] No database, ORM, schema, migration, or database credential is present in the reviewed tree.
- [ ] If a database is introduced, use least-privilege credentials, parameterized queries, access policies, encryption, backups, and tested restore procedures.
- [ ] Keep database credentials server-side only.

**Finding — Not applicable currently:** there is no database to secure.

### 11. Secrets

- [x] No current application API key or private credential was identified in the reviewed source.
- [x] No app environment variable reference was identified in current application code.
- [ ] Explicitly ignore `.env` and `.env.*` files before introducing secrets.
- [ ] Enable GitHub secret scanning and push protection where available.
- [ ] Keep future secrets server-side; never use Vite client-exposed variables for private credentials.
- [ ] Define rotation and revocation procedures.

**Finding — Medium → Evidence:** `.gitignore` excludes `*.local` but not plain `.env`; repository is public → **Risk:** a future plain environment file could be committed → **Affected location:** root `.gitignore` → **Why it matters:** committed credentials in a public repository can be copied and remain in history → **Recommended fix:** explicitly ignore environment files and enable secret scanning before adding credentials.

### 12. Encryption

- [ ] HTTPS/TLS at the deployed site: **Unverified**; no live deployment or host settings reviewed.
- [x] No app-managed database or cloud data store exists to assess at rest.
- [ ] If sensitive server-side data is introduced, use provider-managed encryption at rest and appropriate key management.
- [ ] Never implement custom cryptography for passwords or tokens.

**Finding — Unverified:** Severity: Medium. Evidence: no deployment configuration or live URL in repository. Risk: transport policy cannot be confirmed. Affected location: hosting/domain. Why it matters: public web traffic should be protected in transit. Recommended fix: verify HTTPS and redirect behaviour on the deployed domain.

### 13. CORS

- [x] No app API exists and no CORS configuration is present.
- [ ] If APIs are added, allow only required origins and methods; avoid wildcard origins with credentials.
- [ ] Test preflight and credential behaviour.

**Finding — Not a current vulnerability:** CORS is an API response policy; no application API boundary exists to configure. Hosting CORS for static assets is external and unverified.

### 14. Dependency security

- [x] `package-lock.json` is committed and pins resolved dependency versions.
- [ ] Run `npm audit` against the current lockfile and review each advisory before upgrading.
- [ ] Add automated dependency/security update checks.
- [ ] Review direct and transitive dependencies, maintainer changes, and release provenance.
- [ ] Do not apply blind force upgrades.

**Finding — Unverified → Evidence:** `package.json` and `package-lock.json` declare React/Vite and development dependencies; no automated security workflow appears in the reviewed tree → **Risk:** known advisories or supply-chain compromise may go unnoticed → **Affected location:** dependency graph and repository automation → **Why it matters:** compromised dependencies can affect build output or developer machines → **Recommended fix:** run and review npm audit/advisory checks and add dependency monitoring. No vulnerable dependency is asserted by this source-only assessment.

### 15. Logging and monitoring

- [x] No application logging/analytics SDK or server telemetry integration was found.
- [ ] Review hosting build/runtime logs when a deployment is configured.
- [ ] Do not log secrets, authorization headers, OTPs, passwords, or full private messages.
- [ ] If monitoring is added, minimize collected data and document retention.

**Finding — Unverified external controls:** provider logs and settings are outside repository evidence. Review them after deployment.

### 16. Admin security

- [x] No application admin surface exists.
- [ ] Protect GitHub maintainer access with MFA and least privilege.
- [ ] Enable branch protection/rulesets and required checks before production collaboration.
- [ ] If an app admin interface is introduced, require strong authentication and server-side role checks.

**Finding — Medium (repository governance weakness) → Evidence:** GitHub branch metadata reports `main` as unprotected → **Risk:** changes can reach the default branch without required review/status checks → **Affected location:** GitHub repository branch settings → **Why it matters:** malicious or accidental source changes can be merged more easily → **Recommended fix:** configure branch protection/rulesets, required reviews/checks, and MFA for maintainers. No repository setting was changed.

### 17. Deployment and infrastructure

- [ ] Confirm hosting provider and production domain.
- [ ] Verify HTTPS, redirects, security headers, CSP, cache policy, and preview deployment access.
- [ ] Keep production and preview environment values separate if any are introduced.
- [ ] Restrict deployment permissions and review build logs.
- [x] No host-specific config or deployment workflow was found in the reviewed tree.

**Finding — Medium (unverified) → Evidence:** no `vercel.json`, `netlify.toml`, server config, or CI workflow appears in the current repository tree → **Risk:** deployment controls cannot be evaluated from source → **Affected location:** external Vercel/hosting project → **Why it matters:** secure defaults and response headers depend partly on hosting configuration → **Recommended fix:** inspect actual Vercel project settings and test deployed headers before public release.

### 18. Data privacy

- [x] README states the app does not connect to real WhatsApp accounts or banking services.
- [x] Companion guidance is local and predefined; no live AI provider call is implemented.
- [x] Progress is browser-local and not synchronized to a server.
- [ ] Keep a clear warning not to enter real personal messages, OTPs, PINs, passwords, CNIC, or banking details.
- [ ] Document third-party font loading and browser speech behaviour in a privacy notice.
- [ ] If user accounts or cloud storage are added, define purpose, retention, deletion, consent, and access rights.

**Finding — Medium → Evidence:** arbitrary text fields exist in `src/App.jsx`; warnings are present in composer copy and README, but no full privacy notice is evidenced → **Risk:** learners may paste sensitive real-world content into a practice tool → **Affected location:** companion and simulated chat input surfaces → **Why it matters:** users may mistake a safe simulator for a confidential messaging service → **Recommended fix:** place clear, accessible warnings near inputs and explain local processing and third-party browser services.

### 19. Error handling

- [x] Current app has no server/API error surface.
- [ ] Validate browser storage and handle unsupported speech APIs gracefully.
- [ ] For future APIs, return generic user-facing errors and keep detailed diagnostics server-side with redaction.
- [ ] Avoid exposing provider stack traces or secrets.

**Finding — Low → Evidence:** localStorage values are converted with `Number()` without finite/range validation → **Risk:** corrupted values can display incorrectly; no secret disclosure is evidenced → **Affected location:** `src/App.jsx` progress initialization → **Why it matters:** untrusted browser state should not be assumed valid → **Recommended fix:** validate and fall back safely.

### 20. Backup and recovery

- [x] Application source is version-controlled in GitHub.
- [x] Progress is local to the browser; no server backup or account recovery is implemented.
- [ ] Explain that clearing browser data or changing devices may remove progress.
- [ ] If cloud data is introduced, configure encrypted backups and regularly test restore.
- [ ] Document recovery ownership and retention.

**Finding — Informational:** Severity: Low for current demo. Evidence: progress stored only in localStorage and README says no cloud sync. Risk: local progress can be lost with browser data/device. Affected location: browser profile. Why it matters: there is no central backup. Recommended fix: disclose the limitation; add backup only if product requirements justify it.

## Prioritized recommendations

1. **Before adding any secret:** explicitly ignore `.env` and related local environment files; enable secret scanning/push protection.
2. **Before public production deployment:** inspect Vercel settings and verify HTTPS, security headers, CSP, preview access, and deployment permissions.
3. **Before accepting real personal content:** add clear privacy/safety warnings and data handling documentation.
4. **Before adding accounts or cloud progress:** design authentication, authorization, session lifecycle, database policies, retention, deletion, backups, and rate limiting.
5. **Before adding photo attachments:** define local-only versus server upload and implement file validation and privacy controls.
6. **Ongoing:** run dependency advisory checks and add automated checks/branch protection.

## Assessment boundary

This checklist is based on the repository state and metadata inspected. It is not a penetration-test certificate, a Vercel configuration audit, a complete Git-history secret scan, or a live dependency advisory report. Items marked Unverified must be checked in the actual runtime/provider before making production-security claims.
