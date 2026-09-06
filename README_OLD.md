# Dorivien — Professional Ready Build

This is the clean Dorivien project for the `dorivien-fresh` repository and Render web service. It preserves the design direction that is currently live while completing the no-cost professional foundation around it.

## What is included
- One website source only: `public/`
- Professional homepage and mobile layout
- Interactive demo with structured lead preview
- Improved deterministic fallback conversations
- Safety escalation layer
- OpenAI Responses API integration ready for an API key
- Embeddable client widget
- About, Security, Privacy, Terms, Status, and 404 pages
- robots.txt, sitemap.xml, web manifest, Open Graph metadata, and social preview image
- Security headers and basic rate limiting
- 5,000+ deterministic QA assertions
- GitHub Actions QA workflow
- Business kit: offer, demo script, onboarding, proposal, agreement draft, follow-up templates, client config, launch checklist, brand guide
- Product/data-flow/deployment documentation

## Render
Build command: `npm install`

Start command: `npm start`

Health check: `/api/health`

Current public base URL: `https://dorivien-fresh.onrender.com`

## Environment variables
- `OPENAI_API_KEY` — add only in Render; never commit it
- `OPENAI_MODEL` — defaults to `gpt-5.6-terra`
- `CALENDLY_URL`
- `PUBLIC_BASE_URL`

## QA
Run:

```bash
npm test
```

## Important before selling
The service-agreement draft and website legal pages are working drafts, not legal advice. Have a qualified professional review the agreement/privacy setup before relying on it commercially. A real client deployment also requires client-approved business rules, integrations, testing, and sign-off.

## When dorivien.com is purchased
Replace the current `onrender.com` URLs in canonical metadata, Open Graph metadata, robots.txt, sitemap.xml, `PUBLIC_BASE_URL`, and the embed snippet.
