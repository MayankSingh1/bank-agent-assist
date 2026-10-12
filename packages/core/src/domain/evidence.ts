import type { Card, Customer, DisputeCase, EvidencedText, Policy, Transaction } from "../schemas";

export type EvidenceRef = {
  id: string;
  kind: "customer" | "card" | "transaction" | "case" | "policy";
  label: string;
};

export type EvidenceIndex = Map<string, EvidenceRef>;

const money = (n: number) => `$${Math.abs(n).toFixed(2)}`;

/** Every record the AI is allowed to cite for this call. */
export function buildEvidenceIndex(ctx: {
  customer: Customer;
  cards: Card[];
  transactions: Transaction[];
  cases: DisputeCase[];
  policies: Policy[];
}): EvidenceIndex {
  const index: EvidenceIndex = new Map();
  const add = (ref: EvidenceRef) => index.set(ref.id, ref);

  add({ id: ctx.customer.id, kind: "customer", label: `Customer profile: ${ctx.customer.name}` });
  for (const c of ctx.cards) add({ id: c.id, kind: "card", label: `${c.product} •• ${c.last4} (${c.status})` });
  for (const t of ctx.transactions)
    add({ id: t.id, kind: "transaction", label: `${money(t.amount)} ${t.merchant}, ${t.date} (${t.status})` });
  for (const c of ctx.cases) add({ id: c.id, kind: "case", label: `Case ${c.reference} (${c.status})` });
  for (const p of ctx.policies)
    for (const clause of p.clauses)
      add({ id: clause.id, kind: "policy", label: `Policy ${clause.id}: ${clause.text}` });

  return index;
}

/**
 * Drops any evidence ID that doesn't exist for this call. Returns how many were
 * removed so the UI and audit log can show it.
 */
export function verifyEvidence<T extends EvidencedText>(
  items: T[],
  index: EvidenceIndex,
): { items: T[]; dropped: string[] } {
  const dropped: string[] = [];
  const cleaned = items.map((item) => {
    const kept = [...new Set(item.evidenceIds)].filter((id) => {
      if (index.has(id)) return true;
      dropped.push(id);
      return false;
    });
    return { ...item, evidenceIds: kept };
  });
  return { items: cleaned, dropped };
}

export function resolveEvidence(ids: Iterable<string>, index: EvidenceIndex): EvidenceRef[] {
  return [...new Set(ids)].flatMap((id) => {
    const ref = index.get(id);
    return ref ? [ref] : [];
  });
}
