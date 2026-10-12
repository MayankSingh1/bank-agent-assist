import type { ExtractedFacts, Transaction } from "../schemas";

export type TransactionMatch = {
  transactionId: string;
  score: number;
  reasons: string[];
};

const MIN_SCORE = 40;
const MAX_RESULTS = 3;

export function normaliseMerchant(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function merchantMatches(spoken: string, merchant: string): boolean {
  const target = normaliseMerchant(merchant);
  const words = normaliseMerchant(spoken)
    .split(" ")
    .filter((w) => w.length > 1);
  return words.length > 0 && words.every((w) => target.includes(w));
}

/**
 * Finds the transactions the customer is most likely talking about, from the
 * facts Gemini extracted. Scoring is deterministic so the agent can see why.
 */
export function matchTransactions(facts: ExtractedFacts, transactions: Transaction[]): TransactionMatch[] {
  if (facts.merchant == null && facts.amount == null) return [];

  const matches: TransactionMatch[] = [];
  for (const t of transactions) {
    if (t.amount <= 0) continue;
    let score = 0;
    const reasons: string[] = [];

    if (facts.merchant) {
      if (merchantMatches(facts.merchant, t.merchant)) {
        score += 50;
        reasons.push("Merchant matches");
      }
    }

    if (facts.amount != null) {
      const diff = Math.abs(t.amount - facts.amount) / Math.max(facts.amount, 1);
      if (diff <= 0.05) {
        score += 35;
        reasons.push("Amount matches");
      } else if (diff <= 0.15) {
        score += 20;
        reasons.push("Amount is close");
      } else {
        score -= 20;
      }
    }

    if (facts.approxDaysAgo != null) {
      const gap = Math.abs(t.daysAgo - facts.approxDaysAgo);
      if (gap <= 3) {
        score += 15;
        reasons.push("Date matches");
      } else if (gap <= 7) {
        score += 8;
        reasons.push("Date is close");
      }
    }

    if (score >= MIN_SCORE) matches.push({ transactionId: t.id, score, reasons });
  }

  return matches.sort((a, b) => b.score - a.score).slice(0, MAX_RESULTS);
}

/** Keeps earlier facts when a later turn doesn't mention them. */
export function mergeFacts(previous: ExtractedFacts | null, next: ExtractedFacts): ExtractedFacts {
  if (!previous) return next;
  return {
    merchant: next.merchant ?? previous.merchant,
    amount: next.amount ?? previous.amount,
    approxDaysAgo: next.approxDaysAgo ?? previous.approxDaysAgo,
    customerRecognises: next.customerRecognises ?? previous.customerRecognises,
    cardInPossession: next.cardInPossession ?? previous.cardInPossession,
    suggestedIssueType: next.suggestedIssueType === "unknown" ? previous.suggestedIssueType : next.suggestedIssueType,
  };
}
