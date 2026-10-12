import type {
  BriefingSummary,
  Card,
  Customer,
  DisputeCase,
  ExtractedFacts,
  Policy,
  Recommendation,
  ScriptTurn,
  Transaction,
  WrapUp,
} from "../schemas";
import type { EligibilityResult } from "../domain/eligibility";

export type BriefingInput = {
  today: string;
  customer: Customer;
  card: Card;
  transactions: Transaction[];
  cases: DisputeCase[];
};

export type ExtractInput = {
  today: string;
  transcript: ScriptTurn[];
};

export type RecommendInput = {
  today: string;
  customer: Customer;
  card: Card;
  transaction: Transaction;
  facts: ExtractedFacts | null;
  eligibility: EligibilityResult;
  policy: Policy;
  transcript: ScriptTurn[];
};

export type WrapUpInput = {
  today: string;
  customer: Customer;
  card: Card;
  transaction: Transaction | null;
  transcript: ScriptTurn[];
  eligibility: EligibilityResult | null;
  createdCase: DisputeCase | null;
};

export type AiProviderName = "gemini" | "mock" | "off";

/** The four AI jobs in M0. Implementations must return data matching the schemas. */
export interface AiProvider {
  readonly name: AiProviderName;
  readonly model: string | null;
  briefing(input: BriefingInput): Promise<BriefingSummary>;
  extractFacts(input: ExtractInput): Promise<ExtractedFacts>;
  recommend(input: RecommendInput): Promise<Recommendation>;
  wrapUp(input: WrapUpInput): Promise<WrapUp>;
}
