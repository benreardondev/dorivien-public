# Dorivien — Public Prelaunch v4

Deployable Dorivien web app for Render. This repository is intentionally limited to public/deployable source. Internal pricing, proposals, client notes, contracts, and operating documents belong in the separate private operations kit and should not be committed to a public repository.

## Local run
```bash
npm install
npm start
```
Open `http://localhost:10000`.

## Render
- Build command: `npm install`
- Start command: `npm start`
- Root directory: blank
- Health path: `/api/health`

## Current demo behavior
Without `OPENAI_API_KEY`, Dorivien runs the deterministic demo/fallback intake engine. The public demo does not create appointments or dispatch technicians.

## Production environment variables
Copy `.env.example` into your hosting environment and configure only what is needed.

Important production controls:
- `OPENAI_API_KEY` — server-side only.
- `OPENAI_MODEL` — defaults to `gpt-5.6-terra`.
- `BUSINESS_PROFILE_JSON` — server-controlled business rules. Do not trust browser-supplied business rules.
- `LEAD_WEBHOOK_URL` — optional structured lead handoff.
- `LEAD_WEBHOOK_SECRET` — optional HMAC signature secret for the handoff.
- `ALLOWED_EMBED_ORIGINS` — restrict the iframe to approved client origins in production.
- `APP_MODE=production` — marks the deployment as a client/production configuration.

## Production-readiness signal
`GET /api/health` returns `ready_for_production: true` only when both a live OpenAI API key and a server-side business profile are configured. This does not replace client testing/sign-off.

## Security posture
- API key stays server-side.
- Customer-supplied profile data is ignored; business rules are server-controlled.
- Request and message limits are enforced.
- Active browser conversation is not written to an application database by this build.
- Safety detection is enforced outside the model response.
- The model cannot confirm invented availability/appointments.
- Optional webhook handoff is signed when `LEAD_WEBHOOK_SECRET` is configured.
- The production client iframe can be restricted with `ALLOWED_EMBED_ORIGINS`.

See `docs/` for deployment, data-flow, client embed, and release guidance.
