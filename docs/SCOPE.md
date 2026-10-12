# Bank Agent Assist: scope, milestones and stack

> Status: **draft for team review** (12 Oct 2026). Merges the original pitch ([pitch PDF](reference/pitch-2026-10-09.pdf)), the [brainstorm](BRAINSTORM.md) and the [ChatGPT session](reference/chatgpt-export/chat-transcript.md). Items with ❓ still need a decision.

**Product principle:** AI recommends. Agents decide. Banking systems execute.

**One-line scope:** A web workspace for a bank support agent. When a call connects, it verifies the caller, briefs the agent, follows the conversation, matches the issue to the right transaction, recommends a policy-backed resolution with evidence, and executes actions only after the agent approves. Every step is audited and wrap-up notes are drafted automatically.

**Issue types:** unrecognised charge, ending in a dispute or card block (**Must**, the hero scenario); failed transaction (**Should**); fee or billing query, ending in a fee waiver (**Should**). Each is a playbook: the facts to extract, eligibility rules, allowed actions and script lines.

**Hero scenario:** A customer calls about a card charge they don't recognise. The call ends in a dispute case, or a card block if the account looks compromised.

---

## 1. Guardrails that apply to every feature

1. **Gemini reads, code decides.** Gemini extracts facts (merchant, amount, date), matches transactions and drafts text. Eligibility, allowed actions and anything touching money are decided by deterministic backend code.
2. **Structured output only.** Every Gemini call returns JSON validated against a shared schema. If validation fails, the UI falls back to an "AI unsure" state.
3. **Evidence or it didn't happen.** Every AI claim cites record IDs (transaction, policy clause, case). The backend drops any reference that doesn't exist.
4. **The agent approves every action.** The backend checks the agent's identity, the caller's verification, the action allowlist and an idempotency key before executing.
5. **Everything is fictional.** All customers, transactions and policies are synthetic and labelled as demo data.

---

## 2. Feature buckets

IDs are stable so we can reference them in issues and PRs.

### MUST: required for submission

**Access and verification**
| ID | Item |
|---|---|
| M-01 | **Caller identity check.** Incoming-call panel shows the simulated caller ID. The agent runs a verification step (e.g. DOB + last 4 digits + simulated OTP). Sensitive data stays masked until the caller is verified. |
| M-02 | Agent sign-in, with a one-click demo login for judges. Needed so audit entries have a real actor. |

**Briefing**
| ID | Item |
|---|---|
| M-03 | Customer profile, cards, recent transactions and open cases in one view |
| M-04 | Gemini briefing summary (3–4 lines) with evidence references |
| M-05 | Risk flags computed in code: open disputes, recent card status change, unusual transactions |

**Live call**
| ID | Item |
|---|---|
| M-06 | Scripted call simulator: play/pause/step, agent and customer labelled, one script per scenario |
| M-07 | Issue type picked by the agent with one click (unrecognised charge / failed transaction / fee query). Gemini pre-selects it from the transcript, with no confidence score shown; the choice loads that issue's playbook. |
| M-08 | Transaction matching: Gemini extracts merchant/amount/date from what the customer says; the backend finds matching transactions; the agent confirms the match |

**Resolution**
| ID | Item |
|---|---|
| M-09 | **Evidence references.** The recommendation card shows steps, script lines and the transaction/policy IDs each step relies on. The backend verifies every ID exists and strips any that don't. |
| M-10 | Deterministic eligibility engine running against a fictional demo policy (e.g. within 60 days, posted transactions only, no existing case) |
| M-11 | Pre-filled dispute form; the agent can edit it and it is validated server-side |

**Actions and audit**
| ID | Item |
|---|---|
| M-12 | Approval gate: explicit confirm step, action allowlist, server-side validation. Gemini can never trigger an action. |
| M-13 | Create dispute (simulated): idempotency key + duplicate-case check, case reference returned |
| M-14 | Block card (simulated), used in scenario C |
| M-15 | Audit log: actor, action, AI suggestion ID, evidence IDs, request ID, result, timestamp; visible in the UI |

**Wrap-up**
| ID | Item |
|---|---|
| M-16 | AI-drafted call notes and disposition; agent edits before saving |

**Exception paths**
| ID | Trigger | Expected behaviour |
|---|---|---|
| X-01 | Caller fails verification | Data stays restricted; guided recovery or escalation |
| X-02 | Dispute already exists | Show the existing case; no duplicate is created |
| X-03 | Ambiguous transaction (two similar charges) | More than one transaction matches, so both are shown side by side; the agent picks; nothing proceeds automatically |
| X-04 | Transaction ineligible | Explain the policy reason and offer the next allowed step |
| X-05 | Possible account compromise | Prioritise card block + escalation over dispute |
| X-06 | Gemini error, timeout or invalid JSON | "AI unsure" state with manual policy lookup; the call continues |
| X-07 | Action fails or times out | Pending/failed state, status re-checked before retry, never a false success |

**Demo data and platform**
| ID | Item |
|---|---|
| D-01 | Seed data: 3 customers (one per scenario), cards, ~90 days of transactions, existing cases, fictional policy |
| D-02 | Three scripted calls: **A** eligible dispute (includes X-03), **B** existing dispute (X-02), **C** possible compromise (X-05) |
| P-01 | Deployed: dashboard on Firebase Hosting, API on Cloud Run, `/api` rewrite |
| P-02 | Secrets server-side only; Gemini via Vertex AI with the Cloud Run service account |
| P-03 | Tests for the 8 validation cases in the [implementation reference](reference/chatgpt-export/resources/implementation-reference.md#validation-tests) |
| P-04 | README with setup, architecture diagram and demo script |

### SHOULD: build if time allows

| ID | Item |
|---|---|
| S-01 | Past interactions (last 3 calls/cases) in the briefing |
| S-02 | Timed before/after comparison: mock "legacy" workflow vs. assisted, same scenario |
| S-03 | Metrics panel: time to relevant context, suggestion acceptance rate, handle time |
| S-04 | Card-number masking (pattern + checksum) before text reaches Gemini or logs |
| S-05 | Live microphone mode via streaming Speech-to-Text |
| S-06 | Policy excerpt shown inline next to each evidence reference |
| S-07 | "Ask the copilot" free-text question, answered only from policy and customer data |
| S-08 | Agent accept/reject feedback on each suggestion (feeds S-03) |
| S-09 | "Likely reason for call" predicted before the customer speaks |
| S-10 | **Failed-transaction playbook:** debited but the merchant says unpaid. Check settlement status, explain the reversal timeline, raise a reversal/trace request (simulated). Adds a scripted call D. |
| S-11 | **Fee-waiver playbook:** fee or billing query. Explain the fee from transaction data; waiver eligibility decided in code (e.g. first waiver in 12 months, under a set amount); waive-fee action (simulated). Adds a scripted call E. |

### COULD: stretch goals

| ID | Item |
|---|---|
| C-01 | More issue types, e.g. limit increase (one playbook each) |
| C-02 | Sentiment / frustration indicator |
| C-03 | Multiple issues in one call (e.g. a dispute, then a fee question) |
| C-04 | Outcome analytics in BigQuery (Firestore export) |
| C-05 | Policy grounding at scale via Vertex AI Search |
| C-06 | Scripted-call audio generated with Text-to-Speech |
| C-07 | Gemini Live API as an alternative audio path |
| C-08 | Sensitive Data Protection API instead of the home-made masking in S-04 |
| C-09 | Model Armor screening of transcript text (prompt-injection defence) |
| C-10 | Multi-language calls (e.g. Hindi/English) |

### WON'T (this hackathon)

Real telephony, real bank systems, real money movement, autonomous actions without approval, Dialogflow CX.

---

## 3. Milestones

### M0: walking skeleton (local)

**Goal:** Scenario A runs end to end on a laptop with real Gemini calls. It proves the core loop: *unstructured conversation → verified, human-approved banking action.*

| In M0 | Not in M0 |
|---|---|
| M-01 caller verification (simple form) | M-02 real sign-in (stub agent `demo-agent`) |
| M-03 briefing data, M-04 Gemini summary | M-05 risk flags |
| M-06 scripted simulator (scenario A only) | Scenarios B and C |
| M-07 issue type (unrecognised charge only), M-08 transaction match | |
| M-09 evidence refs + backend check | |
| M-10 eligibility engine (one policy) | |
| M-11 dispute form, M-12 approval, M-13 create dispute | M-14 block card |
| M-15 audit log (written + simple list) | |
| M-16 wrap-up notes | |
| X-01 unverified, X-02 duplicate, X-06 AI fallback | X-03, X-04, X-05, X-07 |
| Firestore emulator + seed script | P-01 deployment |

**Done when:** a teammate can clone the repo, run one command, and complete scenario A. Running it twice shows the duplicate-case path.

### M1: submission-ready
All MUST items, scenarios A/B/C, deployed on Cloud Run + Firebase Hosting, tests and README.

### M2: polish
SHOULD items in order of demo value: S-02 timed comparison → S-04 masking → S-06 policy excerpts → S-05 mic mode.

---

## 4. Google services by feature

| Service | Used for | Features | Bucket |
|---|---|---|---|
| **Gemini on Vertex AI** (`@google/genai`) | Briefing, fact extraction and transaction match, issue-type pre-selection, recommendation, wrap-up, all with JSON schema output. Model set via `GEMINI_MODEL`: a Flash-class model for per-turn calls (latency), optionally Pro-class for briefing/wrap-up. | M-04, M-07, M-08, M-09, M-16 | Must |
| **Google AI Studio** | Prototyping and tuning prompts and schemas before wiring them in | All AI features | Must (dev tool) |
| **Cloud Firestore** | Customers, cards, transactions, cases, policies, call sessions, audit events | D-01, M-03, M-13, M-15 | Must |
| **Firebase Authentication** | Agent sign-in; the API verifies ID tokens | M-02, M-15 | Must |
| **Firebase Hosting** | Dashboard hosting; `/api/**` rewrite to Cloud Run | P-01 | Must |
| **Cloud Run** | Express API: orchestration, eligibility, actions | P-01, M-10–M-14 | Must |
| **Cloud Build + Artifact Registry** | Container builds for `gcloud run deploy --source` | P-01 | Must |
| **Secret Manager** | Any non-ADC secrets (none expected with Vertex + service account) | P-02 | Must |
| **Cloud Logging** | Structured request/AI logs; useful for the demo's "show your work" moment | X-06, X-07 | Must (free) |
| **Firebase Emulator Suite** | Local Firestore + Auth for development and tests | M0, P-03 | Must (dev tool) |
| **Cloud Speech-to-Text (Chirp, streaming)** | Live microphone transcription | S-05 | Should |
| **Sensitive Data Protection (DLP)** | Managed PII/card-number masking | C-08 | Could |
| **Text-to-Speech** | Audio for scripted demo calls | C-06 | Could |
| **Vertex AI Search** | Policy retrieval when the policy set grows | C-05 | Could |
| **BigQuery** | Outcome analytics | C-04 | Could |
| **Gemini Live API** | Single-connection audio understanding | C-07 | Could |
| **Model Armor** | Prompt-injection / unsafe-content screening | C-09 | Could |
| **Google Antigravity** | AI-assisted coding (optional; counts toward "agentic platform" criteria) | – | Optional |
| ~~Dialogflow CX~~ | Dropped: built for bot-led conversations, not two humans talking | – | Won't |

---

## 5. Starter repo structure

TypeScript everywhere, npm workspaces. Shared [Zod](https://zod.dev) schemas are the single source of truth for Gemini response formats *and* API request validation.

```
bank-agent-assist/
├── apps/
│   ├── web/                     React + Vite + Tailwind agent workspace
│   │   └── src/
│   │       ├── workspace/       single-page workspace; panels by call stage
│   │       │   ├── IncomingCallPanel.tsx      M-01 verification
│   │       │   ├── BriefingPanel.tsx          M-03..05
│   │       │   ├── TranscriptPanel.tsx        M-06
│   │       │   ├── CopilotPanel.tsx           M-07..09 issue type, match, recommendation
│   │       │   ├── DisputeForm.tsx            M-11
│   │       │   ├── ApprovalDialog.tsx         M-12
│   │       │   ├── WrapUpPanel.tsx            M-16
│   │       │   └── AuditDrawer.tsx            M-15
│   │       ├── simulator/       scripted call player (reads data/calls/*.json)
│   │       ├── api/             typed client for apps/api
│   │       └── auth/            Firebase Auth + demo login
│   └── api/                     Node + Express on Cloud Run
│       └── src/
│           ├── routes/          customers, calls, resolutions, disputes, cards, audit
│           ├── ai/              Gemini client, prompts/, response validation, fallback
│           ├── domain/
│           │   ├── eligibility.ts   M-10 deterministic policy checks
│           │   ├── evidence.ts      M-09 reference verification
│           │   ├── riskFlags.ts     M-05
│           │   └── actions.ts       M-12..14 allowlist, idempotency, duplicate check
│           ├── data/            repository interfaces + Firestore implementation
│           ├── audit/           M-15 audit writer
│           └── middleware/      auth (ID token), verification gate, request IDs
├── packages/
│   └── shared/                  Zod schemas + types: AI responses, API DTOs, enums
├── data/
│   ├── seed/                    customers, cards, transactions, cases (JSON)
│   ├── policies/                fictional demo policy (structured + text)
│   └── calls/                   scenario-a.json, scenario-b.json, scenario-c.json
├── scripts/
│   ├── seed.ts                  load data/ into Firestore (emulator or cloud)
│   └── deploy.sh                Cloud Run + Firebase Hosting
├── tests/                       P-03 validation cases (API-level, emulator-backed)
├── docs/                        SCOPE, BRAINSTORM, architecture, demo script, reference/
├── firebase.json                hosting rewrite /api/** → Cloud Run, emulator config
├── .env.example                 GOOGLE_CLOUD_PROJECT, GOOGLE_CLOUD_LOCATION, GEMINI_MODEL, …
└── package.json                 workspaces; `npm run dev` starts emulators + api + web
```

### API surface (initial)

| Endpoint | Purpose | Features |
|---|---|---|
| `POST /api/calls` | Start a call session for a caller ID | M-01 |
| `POST /api/calls/:id/verify` | Verify the caller; unlocks customer data | M-01, X-01 |
| `GET /api/calls/:id/briefing` | Profile, transactions, cases, flags + AI summary | M-03..05 |
| `POST /api/calls/:id/turns` | Append a transcript turn → extracted facts, matching transactions, suggested issue type | M-06..08 |
| `POST /api/calls/:id/recommendation` | Recommendation + eligibility + evidence (validated) | M-09, M-10 |
| `POST /api/disputes/preview` | Pre-filled, validated dispute draft | M-11 |
| `POST /api/disputes` | Approved create, with idempotency key | M-12, M-13, X-02 |
| `POST /api/cards/:id/block` | Approved card block | M-14 |
| `POST /api/calls/:id/wrap-up` | Draft notes (GET) / save edited notes (POST) | M-16 |
| `GET /api/calls/:id/audit` | Audit trail for the call | M-15 |

---

## 6. Open decisions

| # | Question | Proposed default |
|---|---|---|
| 1 | ❓ Submission deadline: is **18 Oct 2026** confirmed? (from the ChatGPT session, unverified) | Plan as if it is |
| 2 | ❓ Team size and owners (web / api+AI / data+demo) | – |
| 3 | ❓ Layout: one workspace with stages vs. 6 separate screens | One workspace; the 6 screens become stages |
| 4 | ❓ FigJam board export (PNG/PDF), so the UI follows the agreed flows | – |
| 5 | Update the pitch's stack: Firestore instead of BigQuery, drop Dialogflow CX | Yes |
| 6 | Region/regulation | Not needed: fictional demo policy |
