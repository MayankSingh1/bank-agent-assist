# Original Implementation Prompt

Extracted from Turn 8. Technical configuration and competition details were not reverified for this export.

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

