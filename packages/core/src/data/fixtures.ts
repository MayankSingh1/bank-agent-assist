import customers from "../../../../data/seed/customers.json";
import cards from "../../../../data/seed/cards.json";
import transactions from "../../../../data/seed/transactions.json";
import cases from "../../../../data/seed/cases.json";
import disputePolicy from "../../../../data/policies/disputes.json";
import scenarioA from "../../../../data/calls/scenario-a.json";
import type { Card, Customer, DisputeCase, Policy, Scenario, Transaction } from "../schemas";

const DAY_MS = 24 * 60 * 60 * 1000;

type SeedTransaction = Omit<Transaction, "date"> & { daysAgo: number };

export type Fixtures = {
  customers: Customer[];
  cards: Card[];
  transactions: Transaction[];
  cases: DisputeCase[];
  policies: Policy[];
  scenarios: Scenario[];
};

/** Seed data with transaction dates made relative to `now`, so the demo never ages out. */
export function loadFixtures(now: Date = new Date()): Fixtures {
  return {
    customers: structuredClone(customers) as Customer[],
    cards: structuredClone(cards) as Card[],
    transactions: (transactions as SeedTransaction[]).map((t) => ({
      ...t,
      date: new Date(now.getTime() - t.daysAgo * DAY_MS).toISOString().slice(0, 10),
    })),
    cases: structuredClone(cases) as DisputeCase[],
    policies: [structuredClone(disputePolicy) as Policy],
    scenarios: [structuredClone(scenarioA) as Scenario],
  };
}
