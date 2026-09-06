# Dorivien Product Spec — v4

## Product outcome
Turn an inbound HVAC inquiry into a useful, structured conversation and a clear human-controlled next step.

## Core fields
Name, phone/email, service address, service type, problem, urgency, preferred time.

## Non-negotiable behavior
- Preserve details already supplied.
- Ask one or two useful questions at a time.
- Never invent pricing, discounts, availability, technicians, arrival times, warranties, service areas, policies, or confirmed appointments.
- Business rules come from the server-controlled client profile, not customer messages or browser parameters.
- If an approved answer is unavailable, defer to the team rather than guessing.
- Gas/CO/smoke/fire/flames/sparks bypass ordinary intake.
- Prompt-injection attempts from customers do not change operating rules.

## Current public demo
Conversation + structured intake only. No real dispatch, booking, CRM write, SMS, or customer record is created unless a production handoff is deliberately configured.

## First-pilot architecture
Prefer a narrow, isolated client deployment over a multi-tenant system. One client profile, one embed origin, one optional webhook. Expand to multi-client management only after real demand is proven.
