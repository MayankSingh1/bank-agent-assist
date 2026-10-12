# Implementation Reference

Extracted from the supplied chat. This index preserves the proposal; it is not a new technical specification or a validated implementation.

## Product principle

**AI recommends. Agents decide. Banking systems execute.**

## Screen inventory

| Screen | Purpose | Primary action |
|---|---|---|
| 01. Incoming Call | Identify caller and verification status | Verify customer |
| 02. Customer Briefing | Understand history, cards, and risk context | Review context |
| 03. Live Assistance | Match conversation intent to transactions | Select issue |
| 04. Resolution Workspace | Review evidence, eligibility, and AI suggestions | Approve workflow |
| 05. Dispute Form | Review pre-filled, editable information | Submit dispute |
| 06. Resolution & Wrap-up | Show case reference and produce accurate notes | Confirm and close |

This is the **six-screen design scope** I'd recommend for the hackathon prototype. The additional verification and exception states can be represented through overlays, alerts, or branches rather than separate primary screens.

## Exception behavior

A strong BFSI solution must show how it handles uncertainty and failure, not just a successful AI recommendation.

| Scenario | Expected behavior |
|---|---|
| Caller fails verification | Restrict sensitive data and guide the agent through an approved recovery or escalation process |
| AI identifies the wrong transaction | Let the agent correct the match; do not proceed automatically |
| Dispute already exists | Show the existing case instead of creating a duplicate |
| Transaction is ineligible | Explain the reason using applicable bank policy and offer the next permitted step |
| Potential active fraud | Prioritize risk mitigation and specialist escalation |
| Action API times out | Check transaction status before retrying; prevent duplicate submissions |
| AI cannot find a reliable answer | Surface uncertainty and allow an agent to consult policy or escalate |

For the live prototype, I would implement at least three branches: successful dispute creation, existing dispute detection, and uncertain AI recommendation.

## Success metrics

Your brief includes an under-two-minute handling-time target. In addition to that target, track leading and safety metrics.

| Metric | What to measure |
|---|---|
| Average handling time | Call duration plus after-call work |
| Time to relevant context | Time until the agent sees the correct customer and transaction |
| Task completion rate | Percentage of dispute scenarios successfully handled |
| AI suggestion acceptance | Agent-approved recommendations versus total suggestions |
| Repeat contact rate | Customers calling again about the same issue |
| Safety and compliance | Unauthorized actions, invalid recommendations, and escalation accuracy |

For a hackathon, I would prioritize **task completion, handling time, and action correctness** over broad claims about customer NPS or operational cost reduction.

## Technology responsibilities

| Technology | Responsibility | Priority |
|---|---|---|
| Google AI Studio | Prototype prompts and test Gemini responses | Essential |
| Gemini via Vertex AI | Generate customer briefings, detect intent, suggest resolution steps | Essential |
| Cloud Run | Host Node.js backend and AI orchestration | Essential |
| Firebase Hosting | Deploy frontend | Essential |
| Firestore | Store fictional banking data and cases | Essential for a persistent demo |
| Google Antigravity | AI-assisted coding and implementation | Optional development tool |
| Dialogflow CX | Configured conversation intent routing | Optional second phase |
| Cloud Speech-to-Text | Convert call audio into streaming text | Optional second phase |
| BigQuery | Analyze call data and aggregate outcomes | Later phase |

The last three are useful extensions but aren't required to prove your initial end-to-end value proposition. Speech-to-Text supports streaming recognition, while Dialogflow CX provides configurable intent and conversation flows.

## Synthetic data and scenarios

Your AI needs structured informationto reason about. Prepare the following datasets:

| Collection | Example data |
|---|---|
| `customers` | Customer ID, name, account status, verification status |
| `cards` | Card ID, last four digits, status |
| `transactions` | Transaction ID, merchant, amount, date, posting status |
| `cases` | Dispute ID, transaction reference, status, timestamps |
| `policies` | Policy version, eligibility conditions, required evidence |
| `callSessions` | Call ID, transcript events, selected intent, summary |
| `auditEvents` | Action, actor, request ID, timestamp, result |

Use entirely synthetic data and fictional policies. A demo policy can drive the workflow, but it must never be presented as a real bank's dispute policy.

Build three scenarios:

- **Scenario A:** Unrecognized charge, eligible for a simulated dispute.
- **Scenario B:** Existing open dispute; AI must avoid duplicate creation.
- **Scenario C:** Potential account compromise; recommend secure controls and escalation.

## Backend endpoints

(Day 3–4)

| Endpoint | Purpose |
|---|---|
| `GET /api/customers/:id/briefing` | Retrieve the verified customer's permitted data |
| `POST /api/calls/analyze` | Ask Gemini to classify and summarize call context |
| `POST /api/resolutions/recommend` | Generate evidence-based suggested actions |
| `POST /api/disputes/preview` | Validate eligibility and prepare a case draft |
| `POST /api/disputes` | Execute an agent-approved simulated action |
| `POST /api/calls/:id/wrap-up` | Save approved after-call notes |

Use Firebase Authentication or another appropriate identity system to authenticate agents. The Cloud Run API must verify identity and role permissions independently of the frontend.

For case submission, implement an idempotency key, duplicate-case check, transaction status validation, action logging, and explicit success/error responses.

## Validation tests

| Test | Expected result |
|---|---|
| Verified caller reports unknown charge | Gemini identifies the issue and surfaces a relevant transaction |
| Unverified caller requests sensitive information | System blocks disclosure |
| Dispute already exists | AI and backend avoid creating a duplicate |
| Gemini suggests an unsupported action | Backend rejects it |
| Agent edits the suggested resolution | Updated input is validated before submission |
| Duplicate submission request | One case created, same result returned |
| Backend action fails | Clear failure or pending status; no false success |
| AI-generated notes contain errors | Agent can edit them before saving |

For measuring improvement, test the same synthetic scenarios through the manual workflow and the assisted workflow. Report the resulting measurements as prototype findings, not real-bank operational results.
