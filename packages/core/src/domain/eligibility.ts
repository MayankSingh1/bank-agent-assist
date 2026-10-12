import type { DisputeCase, Policy, Transaction } from "../schemas";

export type EligibilityCheck = {
  clauseId: string;
  label: string;
  passed: boolean;
  detail: string;
};

export type EligibilityResult = {
  eligible: boolean;
  policyId: string;
  checks: EligibilityCheck[];
  existingCase: DisputeCase | null;
};

/**
 * Dispute eligibility under the fictional demo policy (DSP-1).
 * Deterministic on purpose: the model never decides this.
 */
export function checkDisputeEligibility(input: {
  transaction: Transaction;
  openCase: DisputeCase | undefined;
  policy: Policy;
}): EligibilityResult {
  const { transaction: t, openCase, policy } = input;

  const checks: EligibilityCheck[] = [
    {
      clauseId: "DSP-1.1",
      label: "Transaction has posted",
      passed: t.status === "posted" && t.amount > 0,
      detail:
        t.amount <= 0
          ? "Payments and refunds can't be disputed"
          : t.status === "posted"
            ? `Posted ${t.date}`
            : "Still pending; it must post before a dispute can be raised",
    },
    {
      clauseId: "DSP-1.2",
      label: `Reported within ${policy.windowDays} days`,
      passed: t.daysAgo <= policy.windowDays,
      detail: `${t.daysAgo} of ${policy.windowDays} days used`,
    },
    {
      clauseId: "DSP-1.3",
      label: "No open dispute on this transaction",
      passed: !openCase,
      detail: openCase ? `Case ${openCase.reference} is already open` : "None found",
    },
  ];

  return {
    eligible: checks.every((c) => c.passed),
    policyId: policy.id,
    checks,
    existingCase: openCase ?? null,
  };
}
