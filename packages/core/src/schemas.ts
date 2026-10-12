import { z } from "zod";

// ---------------------------------------------------------------------------
// Banking records (fictional demo data)
// ---------------------------------------------------------------------------

export type Customer = {
  id: string;
  name: string;
  dob: string;
  phone: string;
  email: string;
  customerSince: string;
  segment: string;
  city: string;
};

export type Card = {
  id: string;
  customerId: string;
  product: string;
  last4: string;
  status: "active" | "blocked";
  creditLimit: number;
  balance: number;
  currency: string;
};

export type Transaction = {
  id: string;
  cardId: string;
  merchant: string;
  category: string;
  /** Positive = charge, negative = payment or refund. */
  amount: number;
  status: "posted" | "pending";
  channel: "online" | "in_store";
  /** ISO date the transaction posted (or was authorised, if pending). */
  date: string;
  daysAgo: number;
};

export type DisputeReason = z.infer<typeof DisputeReason>;
export const DisputeReason = z.enum(["not_authorised", "not_recognised", "amount_differs", "other"]);

export type DisputeCase = {
  id: string;
  reference: string;
  customerId: string;
  cardId: string;
  transactionId: string;
  amount: number;
  merchant: string;
  reason: DisputeReason;
  customerStatement: string;
  cardInPossession: boolean;
  status: "open" | "closed";
  createdAt: string;
  createdBy: string;
  callId: string | null;
};

export type PolicyClause = { id: string; text: string };

export type Policy = {
  id: string;
  title: string;
  version: string;
  fictional: boolean;
  windowDays: number;
  clauses: PolicyClause[];
};

export type ScriptTurn = { speaker: "agent" | "customer"; text: string };

export type Scenario = {
  id: string;
  title: string;
  summary: string;
  customerId: string;
  callerPhone: string;
  verification: { dob: string; last4: string };
  turns: ScriptTurn[];
};

// ---------------------------------------------------------------------------
// Issue types (playbooks)
// ---------------------------------------------------------------------------

export const IssueType = z.enum(["unrecognised_charge", "failed_transaction", "fee_query", "unknown"]);
export type IssueType = z.infer<typeof IssueType>;

// ---------------------------------------------------------------------------
// Gemini response contracts. Every call returns JSON validated against these.
// ---------------------------------------------------------------------------

const evidenceIds = z
  .array(z.string())
  .describe("IDs of the records this statement relies on, e.g. txn_1042, card_4242, DSP-1.2");

export const EvidencedText = z.object({
  text: z.string(),
  evidenceIds,
});
export type EvidencedText = z.infer<typeof EvidencedText>;

export const BriefingSummary = z.object({
  summary: z.string().describe("2-3 sentences for the agent: who the customer is and what stands out"),
  highlights: z.array(EvidencedText).max(4),
});
export type BriefingSummary = z.infer<typeof BriefingSummary>;

export const ExtractedFacts = z.object({
  merchant: z.string().nullable().describe("Merchant name of the charge the customer is calling about"),
  amount: z.number().nullable().describe("Approximate amount of that charge in dollars"),
  approxDaysAgo: z.number().nullable().describe("Roughly how many days ago the charge happened"),
  customerRecognises: z.boolean().nullable().describe("false if the customer says they did not make or recognise it"),
  cardInPossession: z.boolean().nullable().describe("Whether the customer says they still have the card"),
  suggestedIssueType: IssueType,
});
export type ExtractedFacts = z.infer<typeof ExtractedFacts>;

export const Recommendation = z.object({
  steps: z.array(EvidencedText).min(1).max(5).describe("What the agent should do next, in order"),
  scriptLines: z.array(EvidencedText).min(1).max(3).describe("Sentences the agent can say to the customer"),
  formPrefill: z.object({
    reason: DisputeReason,
    customerStatement: z.string().describe("The customer's account of the issue, first person, 1-2 sentences"),
  }),
});
export type Recommendation = z.infer<typeof Recommendation>;

export const WrapUp = z.object({
  notes: z.string().describe("Call notes for the case file, 3-6 short lines"),
  followUps: z.array(z.string()).max(3),
});
export type WrapUp = z.infer<typeof WrapUp>;

// ---------------------------------------------------------------------------
// API requests
// ---------------------------------------------------------------------------

export const StartCallRequest = z.object({ scenarioId: z.string() });

export const VerifyRequest = z.object({
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  last4: z.string().regex(/^\d{4}$/, "Enter 4 digits"),
});

export const TurnRequest = z.object({
  speaker: z.enum(["agent", "customer"]),
  text: z.string().min(1).max(2000),
});

export const ConfirmRequest = z.object({
  transactionId: z.string(),
  issueType: IssueType,
});

export const DisputeForm = z.object({
  transactionId: z.string(),
  reason: DisputeReason,
  customerStatement: z.string().trim().min(10, "Add at least a short statement").max(1000),
  cardInPossession: z.boolean(),
});
export type DisputeForm = z.infer<typeof DisputeForm>;

export const CreateDisputeRequest = z.object({
  callId: z.string(),
  idempotencyKey: z.string().min(8),
  form: DisputeForm,
});

export const SaveWrapUpRequest = z.object({
  notes: z.string().trim().min(1).max(4000),
});
