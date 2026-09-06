# Dorivien Data Flow — v4

## Public demo
1. Visitor types an HVAC inquiry in the browser.
2. Browser sends the latest message, recent conversation, and already-collected lead fields to `/api/respond`.
3. Server sanitizes and limits the request.
4. Server applies a server-controlled business profile. Browser-supplied business rules are not trusted.
5. If live AI is enabled, the server sends required context to the configured OpenAI model with `store: false`.
6. The deterministic guard layer re-checks safety and prevents fabricated booking/arrival certainty.
7. Structured lead fields and the customer reply return to the browser.
8. The active demo conversation remains in browser memory; this build has no application database for chat history.

## Optional production handoff
When a lead has all required intake fields, or a safety signal is detected, the server can POST a structured event to `LEAD_WEBHOOK_URL`.

The event contains:
- stable event ID
- event type (`lead_ready` or `safety_escalation`)
- timestamp/version
- intent and priority
- structured lead fields
- conversation summary
- next action

If `LEAD_WEBHOOK_SECRET` is set, the JSON body is signed with HMAC-SHA256 in the `x-dorivien-signature` header. The webhook should use the event ID for deduplication.
