"use client";

import { useEffect, useRef } from "react";
import { CircleAlert, CreditCard, Sparkles } from "lucide-react";
import type { Transaction } from "@baa/core";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CallFlow } from "@/lib/use-call-flow";
import { cn, usd } from "@/lib/utils";
import { EvidenceChips, useEvidence } from "./evidence";

export function CustomerPanel({ flow }: { flow: CallFlow }) {
  const { context, briefing } = flow;
  if (!context) return <Skeleton className="h-64 w-full rounded-xl" />;
  const { customer, card, transactions, cases } = context;
  const openCases = cases.filter((c) => c.status === "open");

  return (
    <div className="space-y-4">
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-lg">{customer.name}</CardTitle>
          <CardDescription>
            {customer.segment} · customer since {new Date(customer.customerSince).getFullYear()} · {customer.city}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
            <CreditCard className="size-5 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{card.product}</div>
              <div className="text-xs text-muted-foreground">
                •• {card.last4} · balance {usd(card.balance)} of {usd(card.creditLimit)}
              </div>
            </div>
            <Badge variant={card.status === "active" ? "success" : "destructive"} className="capitalize">
              {card.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="gap-3 border-ai/20 bg-ai-soft/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-1.5 text-sm text-ai">
            <Sparkles className="size-4" /> Briefing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {!briefing ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-ai/10" />
              <Skeleton className="h-4 w-4/5 bg-ai/10" />
              <Skeleton className="h-4 w-3/5 bg-ai/10" />
            </div>
          ) : briefing.ok ? (
            <>
              <p className="leading-relaxed">{briefing.data.summary}</p>
              <ul className="space-y-2">
                {briefing.data.highlights.map((h, i) => (
                  <li key={i} className="flex flex-col gap-1">
                    <span className="flex gap-2">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-ai" />
                      {h.text}
                    </span>
                    <EvidenceChips ids={h.evidenceIds} className="pl-3" />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="flex items-start gap-2 text-muted-foreground">
              <CircleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
              AI briefing unavailable. The account details below are complete; continue the call as normal.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="gap-2 pb-2">
        <CardHeader>
          <CardTitle className="text-sm">Recent transactions</CardTitle>
          <CardDescription className="text-xs">
            {openCases.length === 0 ? "No open cases" : `${openCases.length} open case${openCases.length > 1 ? "s" : ""}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ul>
            {transactions.map((t) => (
              <TransactionRow key={t.id} t={t} flow={flow} hasCase={cases.some((c) => c.transactionId === t.id && c.status === "open")} />
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function TransactionRow({ t, flow, hasCase }: { t: Transaction; flow: CallFlow; hasCase: boolean }) {
  const { highlighted } = useEvidence();
  const ref = useRef<HTMLLIElement>(null);
  const isHighlighted = highlighted === t.id;
  const selected = flow.selectedTxnId === t.id;
  const matched = flow.matches.some((m) => m.transactionId === t.id);
  const selectable = flow.transcript.length > 0 && !flow.confirmed && t.amount > 0;

  useEffect(() => {
    if (isHighlighted) ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [isHighlighted]);

  return (
    <li ref={ref}>
      <button
        type="button"
        disabled={!selectable}
        onClick={() => flow.actions.selectTransaction(t.id)}
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
          selectable && "hover:bg-muted",
          matched && "bg-ai-soft/60",
          selected && "bg-primary/5 ring-1 ring-primary/30",
          isHighlighted && "bg-warning-soft ring-1 ring-warning/40",
        )}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate font-medium">{t.merchant}</span>
            {t.status === "pending" && <Badge variant="outline" className="h-4 px-1 text-[10px]">Pending</Badge>}
            {hasCase && <Badge variant="warning" className="h-4 px-1 text-[10px]">Disputed</Badge>}
          </div>
          <div className="text-xs text-muted-foreground">
            {t.daysAgo === 0 ? "Today" : `${t.daysAgo}d ago`} · {t.category}
            {t.channel === "online" && " · online"}
          </div>
        </div>
        <span className={cn("font-mono text-sm tabular-nums", t.amount < 0 && "text-success")}>
          {t.amount < 0 ? `+${usd(-t.amount)}` : usd(t.amount)}
        </span>
      </button>
    </li>
  );
}
