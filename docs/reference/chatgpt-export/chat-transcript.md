# Bank Agent Assist — Chat Transcript

Exported: 12 October 2026

Scope: The Bank Agent Assist conversation supplied in this thread, followed by the current export request. The original problem-statement attachment is not present in the supplied messages. This is a readable Markdown transcription: headings, tables, code, and speaker order are preserved; interface widgets, image-search placeholders, and unresolved citation tokens are replaced with editorial notes. No resource links, prior file creation claims, board changes, technical guidance, or competition dates have been independently verified for this export. The original PDF bytes and FigJam contents are not included.

## Turn 1 — User

[$whiteboard-challenge-solver](app://plugin_c957e1b268c881919abe493d7c959305)

Okay, now that I have given my problem statement around it, can you help me understand how I can solve it and how I can go forward with it? Also, just create a Figjam file so that we can understand and be elaborate in each flow. Create a flow as well and everything.

## Turn 2 — Assistant

# Bank Agent Assist — Product Strategy & UX Solution

(Google AI Builder Cup 2026)

Based on your problem statement, I'd recommend designing **an AI-powered banking support workspace that helps agents understand, investigate, and resolve customer issues during a live call.**

The key design principle is:

**AI recommends. Agents decide. Banking systems execute.**

Your brief identifies four major challenges: agents switching between 4–6 systems, manually reconstructing customer history, remembering compliance procedures, and spending additional time on after-call documentation.

The proposal targets a reduction in average handling time from 6–10 minutes to under 2 minutes. We should treat that as an ambitious target to validate, not a guaranteed outcome.

[Original response cited an unavailable problem-statement attachment, lines 21–25 and 120–132.]

## 1. Problem — Define what we're solving

**Primary user**

Bank customer support agent

Needs accurate customer context, clear procedural guidance, and fast resolution tools.

**Business stakeholder**

Bank operations team

Needs efficient support operations, auditable decisions, and consistent customer service.

### Jobs to be Done

> When a customer calls about an unexpected transaction, help me quickly establish what happened, follow the correct banking procedure, and take the appropriate action without navigating multiple disconnected systems.

### How might we

- How might we surface the right customer and transaction context automatically?
- How might we guide agents through unfamiliar or complex financial procedures?
- How might we reduce repetitive documentation without sacrificing accuracy?
- How might we make AI recommendations transparent and safe enough for banking operations?

## 2. Approach — Evaluate solution directions

| Direction | Value | Complexity | Decision |
|---|---|---|---|
| Unified customer workspace | High | Medium | MVP foundation |
| AI live-call copilot | High | Medium–High | MVP, focused scope |
| Fully autonomous resolution agent | Potentially high | Very high | Later phase |

**Recommended MVP:** A unified workspace with AI-assisted dispute resolution. Use one compelling scenario—an unrecognized card transaction—to demonstrate the experience from call connection to case creation.

This gives you the strongest end-to-end product story without requiring full automation of every banking workflow.

## Feature priority matrix

HIGH IMPACT · LOWER EFFORT

**Build first**

Customer briefing, transaction context, suggested workflows, draft case notes

HIGH IMPACT · HIGHER EFFORT

**Validate next**

Real-time intent detection, verified API actions, policy-grounded guidance

LOWER IMPACT · LOWER EFFORT

**Consider later**

Agent preferences, layout customization, productivity shortcuts

UNCERTAIN VALUE · HIGH EFFORT

**Defer**

Autonomous fee waivers, complex multi-product financial decisions

## 3. Result — Your FigJam board

**Bank Agent Assist — UX Flows & Architecture**

Editable FigJam board · Four interconnected areas of exploration

[Original response contained an illustrative FigJam image-search widget.]

[Open FigJam board](https://www.figma.com/board/ZWMQbI9GK61fXLFcXTfrXT)

I've created four detailed diagrams in the same board:

1. **End-to-end product flow:** Current journey, future-state journey, architectural dependencies, and outcomes.
2. **Detailed screen flow:** Verification, customer briefing, AI assistance, case submission, and call wrap-up.
3. **Fraud and exception handling:** Duplicate cases, identity failure, eligibility checks, human authorization, and failed transactions.
4. **Google Cloud architecture:** Agent interface, Gemini, Dialogflow CX, Cloud Run, bank APIs, and the approval/audit boundary.

You can rearrange and annotate the flows directly in FigJam.

## 4. The proposed agent experience

A good product structure would center the live call, not the AI chatbot. The agent needs context and actions, with AI assisting in the background.

## Agent Assist

Active call · Customer verified

(Live call)

CUSTOMER

Alex Morgan

Card •• 4242

Recent activity

Unknown charge · $129

Previous cases: 1

Card status: Active

LIVE CONVERSATION

Customer

"I don't recognize a charge on my card."

Detected intent

(Card dispute)

Suggested transaction: $129

AI ASSISTANCE

Recommended next step

Review disputed transaction

Confirm transaction and check dispute eligibility.

Review dispute

Agent approval required

Conceptual low-fidelity workspace using fictional customer data. This is a layout proposal, not an implemented banking interface.

### Screen inventory

| Screen | Purpose | Primary action |
|---|---|---|
| 01. Incoming Call | Identify caller and verification status | Verify customer |
| 02. Customer Briefing | Understand history, cards, and risk context | Review context |
| 03. Live Assistance | Match conversation intent to transactions | Select issue |
| 04. Resolution Workspace | Review evidence, eligibility, and AI suggestions | Approve workflow |
| 05. Dispute Form | Review pre-filled, editable information | Submit dispute |
| 06. Resolution & Wrap-up | Show case reference and produce accurate notes | Confirm and close |

This is the **six-screen design scope** I'd recommend for the hackathon prototype. The additional verification and exception states can be represented through overlays, alerts, or branches rather than separate primary screens.

## 5. What happens when something goes wrong?

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

## 6. How to move forward

1. **Define the MVP scenario**

   Write one detailed dispute-call script. Include a fictional customer, three recent transactions, one unfamiliar charge, and an eligible dispute outcome.

   Deliverable: demo scenario, required data, and success criteria.

2. **Map information architecture and user interactions**

   Use the FigJam flows to establish the customer information hierarchy, primary call actions, AI suggestions, and contextual decision states.

   Deliverable: six annotated low-fidelity wireframes.

3. **Prototype the AI-assisted experience**

   Connect fictional customer data to the dashboard, simulate incoming conversation events, generate contextual recommendations, and require agent approval before submitting a dispute.

   Deliverable: clickable or functional end-to-end prototype.

4. **Build the Google Cloud demo**

   Use the proposed Gemini, Dialogflow CX, BigQuery, Cloud Run, and Firebase stack where each service meaningfully contributes. Connect mocked bank APIs rather than real banking operations.

   Deliverable: working demo with observable AI reasoning inputs, validated actions, and audit events.

5. **Test and demonstrate impact**

   Compare agents completing the same scenario using a simulated legacy workflow versus the assisted workflow. Capture handling time, manual steps, error rates, and perceived usability.

   Deliverable: evidence-backed results, limitations, and next-step roadmap.

## 7. Define measurable outcomes

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

## 8. Product positioning and 60-second pitch

> Bank support agents shouldn't spend most of a customer call searching for information across disconnected systems.
>
> Bank Agent Assist brings customer context, live conversation understanding, and recommended next steps into a single workspace.
>
> When a customer reports an unrecognized transaction, the assistant identifies relevant information, retrieves the applicable procedure, and prepares the resolution for the agent to review.
>
> The agent remains responsible for approving sensitive actions, while the system handles information retrieval and repetitive documentation.
>
> Our goal is to reduce handling time, improve resolution accuracy, and create a more consistent, auditable banking support experience.

For the hackathon, the biggest differentiator will be demonstrating **how AI converts an unstructured customer conversation into a safe, reviewable banking action**, not simply displaying a summary generated by an LLM.

**Next design activity:** Use the FigJam board to turn the six-screen journey into low-fidelity wireframes, beginning with the **Live Assistance Workspace**, where the customer briefing, conversation context, and resolution recommendation come together.

The core flows are now in FigJam. The wireframes and tested prototype are the next deliverables.

## Turn 3 — User

document all things in pdf

## Turn 4 — Assistant

**Bank Agent Assist — UX Solution Blueprint**

8-page PDF · Google AI Builder Cup 2026

I've compiled the solution into a structured PDF covering:

- Problem statement, user personas, and Jobs to be Done
- Current and proposed agent journeys
- MVP scope and feature prioritization
- Six-screen UX breakdown and interactions
- Dispute, fraud, and exception-handling workflows
- AI safeguards and Google Cloud architecture
- Success metrics, validation strategy, and implementation roadmap
- Product positioning and presentation pitch
- Link to the editable FigJam board

**Your PDF document** (Ready)

[Download Bank Agent Assist — Complete UX Solution (PDF)](sandbox:/mnt/data/Bank_Agent_Assist_UX_Solution_Blueprint.pdf)

The document distinguishes information from your original problem statement from the proposed product-design recommendations, making it suitable for team discussions, design planning, and hackathon preparation.

[Export note: The PDF link belongs to the earlier conversation; the file itself was not supplied with this transcript.]

## Turn 5 — User

[https://www.figma.com/board/ZWMQbI9GK61fXLFcXTfrXT/Bank-Agent-Assist---End-to-End-UX--Decisions-and-Architecture?node-id=0-1&p=f&t=GKDpzBdNJlYJh0YA-0](https://www.figma.com/board/ZWMQbI9GK61fXLFcXTfrXT/Bank-Agent-Assist---End-to-End-UX--Decisions-and-Architecture?node-id=0-1&p=f&t=GKDpzBdNJlYJh0YA-0)

here is the Figjam and all the flows that you have designed, but I need them to be properly categorized and connected to each frame based on the problem we are solving together. Right now, there are certain broken points and broken flows. Can you fix it and reiterate in the same file?

## Turn 6 — Assistant

I've reworked your **Bank Agent Assist FigJam in the same file**, replacing the disconnected diagrams with a more structured UX journey.

**Bank Agent Assist — Revised UX Flows**

(Updated in FigJam)

[Open Updated FigJam](https://www.figma.com/board/ZWMQbI9GK61fXLFcXTfrXT)

## What I changed

| Section | Improvements |
|---|---|
| 01. Problem & Current Journey | Organized the existing agent pain points into a sequential flow |
| 02. Canonical MVP Journey | Established one main journey, from incoming call to case resolution and wrap-up |
| 03. Fraud & Exception Handling | Added branches for verification, fraud, eligibility, and escalation |
| 04. AI & Banking Architecture | Separated system processes from user interactions |
| 05. Success Metrics | Grouped measurable product and operational outcomes |

### Broken flows addressed

- Replaced the overlapping and disconnected older diagrams.
- Added explicit paths for uncertain AI recommendations and existing disputes.
- Connected agent approval to authorized API execution.
- Added failure-handling paths for API timeouts.
- Connected exception handling back to the resolution journey.
- Added labeled references between the UX journey, architecture, and metrics.

The revised board contains **five categorized sections**, with directional connectors and labeled decision branches.

### Recommended review order

Start with Section 01 to establish the problem, then follow Section 02 as the primary end-to-end user journey. Use Sections 03–05 to explore exceptions, technical dependencies, and validation.

**One important distinction:** This is now a reorganized flow architecture, not yet a complete set of screen-level UX wireframes. The next design iteration should translate each numbered step into an actual agent dashboard screen, with interaction states and annotations for engineering handoff.

## Turn 7 — User

This is an AI Builder Cup Hackathon 2026, and this should be integrated by these tools. Can you help me step by step? How can I implement all these things?

All prototype submissions must integrate AI models such as the family of Gemini or Gemma models or built using agentic platforms like Agent Platform, Antigravity, AI Studio and prototypes must be deployed on Google Cloud Platform using Cloud Run or Firebase.

## Turn 8 — Assistant

# Bank Agent Assist — AI Builder Cup 2026 Implementation Roadmap

(Google Cloud + Gemini · Hackathon MVP)

Your Bank Agent Assist concept is a strong fit for the BFSI theme. The next step is to turn the FigJam journeys into a **working AI-powered banking support prototype that runs on Google Cloud**, rather than just a clickable UI.

I recommend building it with **React + Gemini on Vertex AI + Cloud Run + Firebase**, starting with a simulated incoming customer call about an unauthorized card transaction.

Based on the technical requirements you provided, a Gemini-powered app deployed on Cloud Run or Firebase satisfies the stated technology categories. You don't need to use every Google AI product. A live Gemini integration and a functioning cloud deployment are more valuable than several loosely connected integrations.

## 1. Choose the implementation stack

RECOMMENDED ARCHITECTURE

**React + TypeScript + Tailwind CSS**

Agent dashboard and interaction layer

**Firebase Hosting**

Hosts the web interface

**Cloud Run**

Runs the secure backend API

**Gemini via Vertex AI**

Intent detection, reasoning, summaries

**Firestore**

Demo customers, transactions, cases and audit events

[Original response contained logo image-search widgets for Firebase, Cloud Run, Gemini, and Firestore.]

The frontend calls the Cloud Run backend, which retrieves scoped data, requests Gemini analysis, and executes simulated actions after agent approval. Firebase Hosting can route API requests to Cloud Run.

### What each Google tool does

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

## 2. Define exactly what your prototype must demonstrate

Your core demo scenario:

> A customer calls because they don't recognize a $129 transaction. The agent receives an AI-generated customer briefing, confirms the transaction, reviews a policy-grounded recommendation, creates a simulated dispute case, and saves AI-generated call notes.

## Six functional milestones

Implementation checklist of 6

[The supplied text names this checklist but does not contain its six items.]

**A working demo means** the AI returns actual model-generated analysis, the agent can take an action, the backend changes case state, and the UI displays the updated result. Screens with hardcoded AI responses alone won't sufficiently demonstrate that behavior.

## 3. Step-by-step build plan

### Phase 1 — Set up Google Cloud

(Day 1)

Goal: Your development environment can call Gemini and deploy an API.

1. Open [Google Cloud Console](https://console.cloud.google.com/) and create a project named `bank-agent-assist-2026`.
2. Link a billing account and configure a budget alert.
3. Enable the Vertex AI, Cloud Run, Cloud Build, Artifact Registry and Secret Manager APIs.
4. Open [Firebase Console](https://console.firebase.google.com/) and register a web app using the same Google Cloud project.
5. Install Node.js, Git, Google Cloud CLI and Firebase CLI.
6. Set up Google Cloud Application Default Credentials for local development.

For a Windows terminal, these are the initial commands:

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud auth application-default login

gcloud services enable aiplatform.googleapis.com run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com

npm install -g firebase-tools
firebase login
```

Google documents the Vertex AI setup, API enablement and SDK authentication in its [Gemini on Vertex AI quickstart](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/start/quickstart).

Definition of done: You can authenticate successfully, access your project, and make a test Gemini request.

### Phase 2 — Create the functional frontend

(Day 1–2)

Use your FigJam as the interaction blueprint.

Recommended application structure

```text
bank-agent-assist/
  frontend/ — React application
    src/components/
    src/screens/
    src/services/
    src/types/
  backend/ — Node.js + Express API
    src/routes/
    src/services/
    src/policies/
    src/data/
  docs/ — Architecture, setup and demo evidence
```

Main workspace layout

Bank Agent Assist

Call active

Customer

Verified profile

Account

Transactions

Past cases

Conversation

Call transcript

Detected issue

Transaction match

Agent notes

AI Copilot

Recommendation

Policy evidence

Next-best action

Review action →

Call duration · 02:14 End call · Save notes

Start with UI states driven by fictional records. Build the full interaction journey before integrating multiple cloud services.

### Phase 3 — Prepare realistic fictional banking data

(Day 2)

Your AI needs structured information to reason about. Prepare the following datasets:

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

### Phase 4 — Integrate Gemini

(Day 3)

This is the most important technical milestone.

Use the official Google Gen AI SDK to call Gemini from your backend, never by placing privileged credentials inside the React app.

```bash
cd backend
npm install express cors dotenv @google/genai
```

A minimal example:

```javascript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: process.env.GOOGLE_CLOUD_LOCATION || "global"
});

export async function analyzeCall(context) {
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: [{
      role: "user",
      parts: [{
        text: JSON.stringify({
          task: "Analyze this bank support call",
          context
        })
      }]
    }],
    config: {
      systemInstruction: `
You assist a human bank support agent.

Use only the supplied customer facts and policy excerpts.
Do not invent transactions, policies, or case outcomes.
Distinguish observations from recommendations.
If evidence is insufficient, request clarification.
Never claim an action was completed.
All account-changing actions require server-side
validation, role authorization and agent approval.
      `
    }
  });

  return response.text;
}
```

Configure `GEMINI_MODEL` with a currently available Gemini model in your selected Vertex AI region. Google provides this SDK and Vertex AI authentication approach in its quickstart.

For your product, the AI should produce structured data, not just paragraphs. The backend should require JSON output validated against a schema, such as:

```json
{
  "intent": "CARD_DISPUTE",
  "transactionId": "txn_1007",
  "summary": "Customer reports an unfamiliar charge.",
  "evidenceIds": ["txn_1007", "policy_demo_03"],
  "missingInformation": [],
  "recommendedAction": "REVIEW_DISPUTE",
  "requiresHumanApproval": true
}
```

This is an **example of the desired response contract**, not an actual Gemini result.

The application should validate this response, confirm that the referenced transaction and policy exist, and calculate dispute eligibility through deterministic backend rules. The model must not independently decide eligibility or authorize money-moving operations.

### Phase 5 — Build the backend endpoints

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

### Phase 6 — Add the call simulation

(Day 4)

Implement two modes:

**Mode A — Scripted demo (required):** A Start Call button plays a sequence of predefined customer statements as transcript events. Gemini analyzes the evolving transcript and suggests next steps.

**Mode B — Real microphone transcription (optional):** Stream audio into Cloud Speech-to-Text, then send finalized transcript segments into your analysis pipeline. See Google's [streaming transcription documentation](https://docs.cloud.google.com/speech-to-text/docs/v1/transcribe-streaming-audio).

For a hackathon, scripted playback is far more predictable and still lets you demonstrate live AI analysis. Be transparent that the audio and banking systems are simulated.

### Phase 7 — Deploy on Google Cloud

(Day 5)

For the backend, deploy from your `backend` directory:

```bash
gcloud run deploy bank-agent-assist-api --source . --region us-central1 --no-allow-unauthenticated
```

This assumes you're inside the backend directory, the necessary APIs and permissions are configured, and the service account has access to the required Google Cloud services.

Configure your backend's runtime environment variables, service account, and authentication before testing. Keep production credentials in Secret Manager or use managed identity rather than committing them to source control.

For the frontend, build the React application and deploy its static assets:

```bash
npm run build
firebase init hosting
firebase deploy --only hosting
```

Configure Firebase Hosting rewrites and an authenticated request path to Cloud Run. A protected Cloud Run service needs a valid identity mechanism; a public Firebase webpage alone cannot invoke it directly without authentication. Google documents [Firebase Hosting and Cloud Run integration](https://firebase.google.com/docs/hosting/cloud-run).

Definition of done: A reviewer can open your hosted application, sign in or use an approved demo access method, complete the dispute scenario, and see the resulting case and audit event.

## 4. Implementation order and timeline

## Suggested seven-day build schedule

Assuming a small team, reusable UI components, and limited banking integrations.

[The supplied text names a schedule but does not contain a complete seven-day schedule.]

An independently published competition listing indicates a **prototype submission deadline of October 18, 2026**. Confirm it against your official organizer portal before planning around it.

[The original response's citation for this deadline was an unresolved search reference, without a source URL.]

Because the deadline is close, prioritize the deployed happy path, one meaningful exception, and a reliable Gemini integration before adding optional speech services.

## 5. Test cases you should demonstrate

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

## 6. A build prompt for Google Antigravity

Since you already have the user journeys in FigJam, you can use an AI coding tool to accelerate implementation. Here's a scoped prompt that establishes the architecture and end-to-end experience.

### Build prompt (original writing block)

Build a working hackathon prototype called **Bank Agent Assist** for Google AI Builder Cup 2026.

**Product objective:** An AI-powered customer support copilot for bank agents that consolidates customer context, analyzes simulated live calls, recommends compliant resolution workflows, and requires human approval before executing sensitive actions.

**Technology stack:**

- React, TypeScript, Vite and Tailwind CSS frontend
- Node.js, TypeScript and Express backend
- Google Gen AI SDK with Gemini through Vertex AI
- Firebase Authentication, Firestore and Firebase Hosting
- Google Cloud Run for backend deployment

**Primary end-to-end demo:** A verified customer calls about a fictional unauthorized card transaction. The application surfaces their profile, transactions and previous disputes. Gemini analyzes the call transcript, recommends a dispute workflow grounded in supplied demo policy, and prepares a dispute draft. The agent reviews and confirms it. The backend validates and creates a simulated case, shows its reference, and prepares editable call notes.

**Required screens:**

1. Incoming Call and Identity Verification
2. Customer Briefing
3. Live Conversation Workspace
4. AI Resolution Recommendation
5. Dispute Form Review and Submission
6. Confirmation and Call Wrap-up

**Core implementation requirements:**

- Seed Firestore with fictional customer, card, transaction, policy and dispute data.
- Use real Gemini calls for AI summaries, issue classification and recommendations.
- Return schema-validated structured model responses with evidence references.
- Keep policy eligibility checks in deterministic backend logic.
- Never execute account-changing actions from an LLM response alone.
- Verify agent identity, permissions and explicit approval server-side.
- Provide duplicate-case protection, idempotent API actions, and audit events.
- Handle uncertainty, API failure, existing disputes, unverified identity, and potential fraud.
- Provide a scripted call simulator as the primary demo mode.
- Separate development mocks from backend production configuration.
- Keep secrets server-side.
- Deploy frontend to Firebase Hosting and backend to Cloud Run.

**Deliverables:**

- Running end-to-end app
- Working Gemini integration
- Three synthetic customer scenarios
- Functional dispute creation with persistent case status
- Validation and error-handling tests
- Google Cloud deployment configuration
- Setup README, architecture diagram and demo instructions

**Implementation approach:**

Implement incrementally. First create the frontend and fictional data. Then wire up Gemini. Next implement the approval and dispute actions. Finally configure authentication, deploy and validate the hosted scenario. Do not add features beyond this MVP until the entire core flow is working.

## 7. Submission readiness

From the requirements you've quoted, your submission needs a Google AI integration and Google Cloud deployment. The competition information I found also describes a proposal deck, functional prototype and documentation. Confirm the precise submission format and evidence requirements in the official portal.

[The original response's citation for submission requirements was an unresolved search reference, without a source URL.]

Use this as the final readiness check:

**Submission checklist** /

[No checklist items were present in the supplied text.]

## Where I would start

Begin by building the **Agent Workspace with fictional customer data and a scripted incoming call**. Once that flow works from beginning to end, integrate Gemini for live analysis and recommendations. The server-controlled dispute action should be your next milestone.

For the upcoming hackathon, that's the most compelling product demonstration: *a real AI recommendation becoming a verified, human-approved banking workflow.*

Your existing [Bank Agent Assist FigJam](https://www.figma.com/board/ZWMQbI9GK61fXLFcXTfrXT) can serve as the interaction specification for implementation.

## Turn 9 — User (current export request)

Can you give me a document md transcription and resources directory of this chat

## Citation provenance

The imported conversation used citation handles that cannot be resolved from the supplied text. They are retained here as provenance labels, not as verified sources:

| Original handle | Associated material |
|---|---|
| turn0file0, lines 21–25 and 120–132 | Original problem statement and handling-time target |
| turn695705search0 | Vertex AI quickstart, SDK and authentication |
| turn695705search1, turn695705search3 | Frontend/backend hosting and Cloud Run integration |
| turn695705search6 | Streaming Speech-to-Text |
| turn695705search12, turn695705search14 | Conversation/intent services |
| turn695705search9 | Claimed October 18, 2026 deadline |
| turn695705search11 | Claimed submission materials |

Explicit web URLs appear in the transcript and in [resources/links.md](resources/links.md). No missing source URLs have been invented.
