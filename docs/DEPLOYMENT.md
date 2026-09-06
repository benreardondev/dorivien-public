# Dorivien Deployment Runbook

## Public demo
1. Deploy the repository as a Node Web Service.
2. Build: `npm install`.
3. Start: `npm start`.
4. Leave `APP_MODE=demo` until the real AI and client profile are ready.
5. Confirm `/api/health`, `/`, `/privacy.html`, `/terms.html`, `/security.html`, `/implementation.html`, and `/widget.html`.

## Live AI cutover
1. Fund the OpenAI API account.
2. Create a project-scoped API key.
3. Add `OPENAI_API_KEY` to the host environment, never GitHub.
4. Keep `OPENAI_MODEL=gpt-5.6-terra` unless deliberately changed.
5. Redeploy and verify `/api/health` reports `live_ai: true`.
6. Run the live-model acceptance scenarios in the private operations kit before showing the live model to prospects.

## First client deployment
For the first pilot, the simplest architecture is one isolated deployment/configuration for that client.

Required:
- `APP_MODE=production`
- `BUSINESS_PROFILE_JSON=<approved client profile>`
- `ALLOWED_EMBED_ORIGINS=https://client-domain.example`
- `PUBLIC_BASE_URL=<deployment URL>`

Optional:
- `LEAD_WEBHOOK_URL=<client-approved webhook>`
- `LEAD_WEBHOOK_SECRET=<random secret>`

Before launch, verify `/api/health` reports `ready_for_production: true`, then complete the client UAT/sign-off checklist.
