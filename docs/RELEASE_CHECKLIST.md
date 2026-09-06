# Dorivien — Release Checklist

Run before every meaningful deploy:

1. `npm test` passes.
2. Homepage loads without console-breaking errors.
3. `/api/health` returns `ok: true`.
4. Demo normal inquiry works.
5. Demo safety inquiry returns safety guidance.
6. Calendly CTA opens.
7. Widget loads in an iframe.
8. Privacy, Terms, Security, About, Status, and 404 pages load.
9. No secrets appear in repository files.
10. Version string updated for major releases.
