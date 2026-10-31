# Secrets Management Assessment — Digital Dost

## Scope

Assessed repository revision: `main` at `bb6a3ca7b854c051800144b52ffbae420615fd30` (2026-10-31).

This document records where secrets are used or expected based on the current source. It does not reproduce any credential values. The current implementation is a client-side React/Vite MVP; no backend service, authentication provider, database, AI API, or application storage service is evidenced.

## Where secrets are expected

### Current implementation

| Secret type | Current expected location | Finding |
|---|---|---|
| Application API key | None identified | No API client or API key reference found in reviewed application source |
| AI provider key | None identified | README explicitly says the companion uses local predefined guidance and does not call a live AI API |
| Database credentials | None identified | No database client, ORM, schema, or database configuration found |
| Authentication secrets | None identified | No authentication or session implementation found |
| Storage credentials | None identified | No cloud storage SDK or upload service found |
| Webhook signing secret | None identified | No webhook handler or webhook integration found |
| OAuth client secret | None identified | No OAuth flow or provider configuration found |

### Future Vercel deployment

If a future release adds server-side functions or integrations, secrets should be stored in Vercel project environment variables (or the chosen server-side secret manager) with least privilege and environment separation. A value prefixed for client exposure (for example, Vite's `VITE_` convention) must be treated as public because it is embedded into client code. Do not put private credentials in browser-exposed variables.

No Vercel environment-variable inventory was accessible during this repository review, so the presence or absence of secrets in an external Vercel project is **unverified**.

## Environment and configuration handling

- `package.json` contains scripts and package declarations, not secret values.
- `vite.config.js` only registers the React plugin; it does not define environment loading or proxy routes.
- `index.html` contains public page metadata and a favicon reference.
- The reviewed app source does not reference `import.meta.env`, `process.env`, or runtime secret configuration.
- `.gitignore` excludes `*.local`, which matches common local files such as `.env.local`.
- `.gitignore` does **not** explicitly exclude `.env` or the general `.env.*` pattern. No environment file appears in the current repository tree, but a future plain `.env` file could be accidentally committed if developers rely only on the current ignore rules.

### Actual finding

**Severity: Medium (preventive configuration weakness) → Evidence:** `.gitignore` contains `*.local` but no explicit `.env` / `.env.*` exclusion; the current tree contains no `.env` file → **Risk:** a developer may add a plain environment file containing credentials and accidentally stage it → **Affected location:** repository root `.gitignore` and future root-level environment files → **Why it matters:** the GitHub repository is public, so a committed credential could be copied immediately → **Recommended fix:** add explicit environment-file ignore rules before introducing secrets; inspect staged files before every commit. No change has been made.

## Hardcoded-secret risks

- No hardcoded API key, password, access token, private key, database URI, or OAuth secret was identified in the reviewed current source files.
- Current source does not require an app secret.
- The public source repository increases the impact of any future accidental hardcoded secret.
- This conclusion is limited to the reviewed current files; it is not proof that every historical blob, issue, branch, release, or external deployment has no secret.

**Classification:** no confirmed hardcoded secret in reviewed current source; historical/external exposure requires verification.

## Client-side exposure risks

- All JavaScript delivered to the browser is public and inspectable.
- Do not place API keys or private credentials in `src/**`, HTML, CSS, or any `VITE_*` environment variable.
- The current `localStorage` entries are progress counters, not secrets.
- User-entered text is held in React component state in the current page; no app API call is present in the reviewed source.
- Browser speech synthesis receives text through the browser API. This is not a server-side secret path, but speech output may be audible to people nearby.

**Classification:** confirmed client-side code visibility; no current secret exposure identified.

## Git and history exposure risks

- GitHub repository metadata reports the repository as public.
- GitHub reports the `main` branch as unprotected.
- The visible recent history includes application and configuration commits.
- The current-tree `.gitignore` does not explicitly ignore plain `.env`.
- No secret value is reproduced in this document.

**Actual finding — Severity: High if a credential is ever committed; current state is a preventive weakness → Evidence:** public repository and no explicit `.env` ignore rule → **Risk:** a future secret committed to any reachable commit can remain accessible through Git history even after removal from the latest tree → **Affected location:** repository visibility, Git history, root `.gitignore` → **Why it matters:** deleting a leaked value in a later commit does not revoke the credential or remove prior copies → **Recommended fix:** enable repository secret scanning/push protection where available; rotate any credential found; remove exposed history only through a coordinated history rewrite after revocation. No confirmed leaked credential was found in the reviewed current files.

A complete forensic scan of every Git object and external fork/cache was not performed. The commit list was reviewed for context, but this is not a certified history-wide secret scan.

## Logging and error exposure risks

- No application logging framework, telemetry SDK, server logs, or API error handler is implemented in the reviewed source.
- The application does not send companion messages to a backend.
- Browser console, browser extensions, operating-system diagnostics, and hosting-provider build/runtime logs are outside the app source and were not inspected.
- No actual secret logging was identified.

**Potential risk requiring verification:** if future server functions or AI integrations are added, ensure request bodies, authorization headers, environment values, and full provider errors are not logged.

## Secret rotation requirements

There are no active application secrets identified in the current code, so no current application credential rotation is indicated by this source review.

If a credential is introduced or discovered:
1. Revoke/rotate it at the issuing provider immediately if exposure is suspected.
2. Update the server-side secret store (never the client bundle).
3. Redeploy affected environments.
4. Review access logs and provider usage for unexpected activity.
5. Remove the exposed value from repository history if appropriate, only after rotation.
6. Never rely on deleting a commit or changing a variable name as a substitute for revocation.

Rotate future secrets after suspected disclosure, contributor offboarding where access was shared, or provider policy requirements. Use separate development, preview, and production credentials.

## Verification checklist

| Check | Result from repository review |
|---|---|
| Current source contains an app API key | Not identified |
| Current source calls a live AI provider | No |
| Database credentials configured in source | No |
| Authentication/session secret configured in source | No |
| Cloud storage credentials configured in source | No |
| Webhook signing secret configured in source | No |
| `import.meta.env` used by app | Not identified |
| `.env` file present in current tree | No |
| `.env` explicitly ignored | No |
| `*.local` ignored | Yes |
| Repository is public | Yes |
| GitHub `main` branch protection | Disabled |
| Vercel environment variables inspected | No; external settings unavailable |
| Complete historical secret scan | Not performed |

## Recommendations (not implemented)

- Add explicit ignore rules for `.env`, `.env.*`, and local secret files, while deliberately allowing only safe example templates such as `.env.example`.
- Keep private values in Vercel server-side environment variables or a secret manager; do not expose them through Vite client variables.
- Enable GitHub secret scanning and push protection where available.
- Add a secret-scanning check to pull requests/CI.
- Review repository history and all branches before making the repository a public production project.
- Use separate least-privilege credentials per environment if backend services are introduced.
- Redact credentials and sensitive user content from logs and error reports.
- Document ownership, expiry, rotation, and revocation procedures for each future secret.

**No code or configuration was changed during this assessment.**
