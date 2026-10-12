"use client";

import { useEffect, useRef } from "react";
import { CircleAlert, CreditCard, FolderOpen } from "lucide-react";
import type { Transaction } from "@baa/core";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { CallFlow } from "@/lib/use-call-flow";
import { cn, daysAgo, initials, usd } from "@/lib/utils";
import { EvidenceChips, useEvidence } from "./evidence";
import { AiLabel, Amount } from "./kit";

export function CustomerPanel({ flow }: { flow: CallFlow }) {
  const { context, briefing } = flow;
  if (!context)
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-36 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );

  const { customer, card, transactions, cases } = context;
  const openCases = cases.filter((c) => c.status === "open");
  const utilisation = Math.round((card.balance / card.creditLimit) * 100);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="grid-cols-[auto_1fr] items-center gap-x-3">
          <Avatar className="row-span-2 size-10">
            <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
              {initials(customer.name)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-base">{customer.name}</CardTitle>
          <CardDescription>
            {customer.segment} · since {new Date(customer.customerSince).getFullYear()} · {customer.city}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 rounded-lg border bg-surface p-3">
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-background">
                <CreditCard className="size-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm leading-5 font-medium">{card.product}</div>
                <div className="text-xs text-muted-foreground tabular-nums">•••• {card.last4}</div>
              </div>
              <Badge variant={card.status === "active" ? "success" : "destructive"} className="capitalize">
                {card.status}
              </Badge>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-muted-foreground">Balance</span>
                <span className="tabular-nums">
                  <span className="font-medium">{usd(card.balance)}</span>
                  <span className="text-muted-foreground"> of {usd(card.creditLimit)}</span>
                </span>
              </div>
              <Progress value={utilisation} className="h-1.5" aria-label={`${utilisation}% of credit limit used`} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-ai/20 bg-ai-soft/50">
        <CardHeader>
          <CardTitle>
            <AiLabel className="text-sm font-semibold">Briefing</AiLabel>
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
              <ul className="space-y-2.5">
                {briefing.data.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-ai/70" />
                    <div className="min-w-0 space-y-1">
                      <p className="leading-relaxed">{h.text}</p>
                      <EvidenceChips ids={h.evidenceIds} />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="flex items-start gap-2 text-muted-foreground">
              <CircleAlert className="mt-0.5 size-4 shrink-0 text-warning" />
              AI briefing unavailable. The account details here are complete; carry on with the call as normal.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="gap-2 pb-2">
        <CardHeader>
          <CardTitle>Recent transactions</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <FolderOpen className="size-3.5" />
            {openCases.length === 0
              ? "No open cases"
              : `${openCases.length} open case${openCases.length > 1 ? "s" : ""}`}
          </CardDescription>
          <CardAction>
            <span className="text-xs text-muted-foreground tabular-nums">{transactions.length}</span>
          </CardAction>
        </CardHeader>
        <CardContent className="px-2">
          <ul className="space-y-0.5">
            {transactions.map((t) => (
              <TransactionRow
                key={t.id}
                t={t}
                flow={flow}
                hasCase={cases.some((c) => c.transactionId === t.id && c.status === "open")}
              />
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
        aria-pressed={selectable ? selected : undefined}
        onClick={() => flow.actions.selectTransaction(t.id)}
        className={cn(
          "relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-default",
          selectable && "hover:bg-muted",
          matched && !selected && "bg-ai-soft/60",
          selected && "bg-primary/[0.04] ring-1 ring-primary/25",
          isHighlighted && "bg-warning-soft ring-1 ring-warning/40",
        )}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-medium">{t.merchant}</span>
            {t.status === "pending" && (
              <Badge variant="outline" className="h-4 px-1.5 text-[10px]">
                Pending
              </Badge>
            )}
            {hasCase && (
              <Badge variant="warning" className="h-4 px-1.5 text-[10px]">
                Disputed
              </Badge>
            )}
            {matched && !hasCase && (
              <Badge variant="ai" className="h-4 px-1.5 text-[10px]">
                Match
              </Badge>
            )}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {daysAgo(t.daysAgo)} · {t.category}
            {t.channel === "online" && " · Online"}
          </div>
        </div>
        <Amount value={t.amount} className="text-sm" />
      </button>
    </li>
  );
}
