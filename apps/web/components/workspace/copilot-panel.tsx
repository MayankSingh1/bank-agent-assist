"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CircleAlert,
  CircleCheck,
  CircleX,
  FolderOpen,
  Loader2,
  MessageSquareQuote,
  PhoneOff,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { DisputeForm, DisputeReason, Transaction } from "@baa/core";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { CallFlow } from "@/lib/use-call-flow";
import { cn, usd } from "@/lib/utils";
import { EvidenceChips, useEvidence } from "./evidence";

const ISSUE_TYPES = [
  { id: "unrecognised_charge", label: "Unrecognised charge", available: true },
  { id: "failed_transaction", label: "Failed transaction", available: false },
  { id: "fee_query", label: "Fee query", available: false },
] as const;

const REASONS: { id: DisputeReason; label: string }[] = [
  { id: "not_authorised", label: "Customer didn't authorise it" },
  { id: "not_recognised", label: "Customer doesn't recognise it" },
  { id: "amount_differs", label: "Amount is different from agreed" },
  { id: "other", label: "Other" },
];

export function CopilotPanel({ flow }: { flow: CallFlow }) {
  const { stage, context, matches, selectedTxnId, confirmed, scriptDone, extractError, transcript } = flow;
  const latest = useRef<HTMLDivElement>(null);

  useEffect(() => {
    latest.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [stage, flow.createdCase?.id]);

  if (!flow.verified)
    return <Empty icon={ShieldCheck} text="The co-pilot starts once the caller is verified." />;
  if (transcript.length === 0)
    return <Empty icon={Sparkles} text="Play the call. The co-pilot listens and finds the transaction the customer describes." />;

  const selected = context?.transactions.find((t) => t.id === selectedTxnId) ?? null;
  const waitingForMatch = !selected && !scriptDone && !extractError;

  return (
    <div className="space-y-4">
      {/* Step: identify the issue and the transaction */}
      {!confirmed ? (
        <div ref={stage === "confirm" ? latest : undefined} className="space-y-4">
          <IssueTypeCard />
          {waitingForMatch ? (
            <Card className="gap-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-1.5 text-sm">
                  <Sparkles className="size-4 animate-pulse text-ai" /> Listening for the transaction…
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ) : (
            <MatchCard flow={flow} selected={selected} />
          )}
        </div>
      ) : (
        <ConfirmedSummary flow={flow} />
      )}

      {/* Step: eligibility, recommendation, form, approval */}
      {confirmed && (
        <div ref={stage === "act" ? latest : undefined} className="space-y-4">
          <EligibilityCard flow={flow} />
          {confirmed.eligibility.eligible ? (
            flow.createdCase ? (
              <CaseCreatedCard flow={flow} />
            ) : (
              <>
                <RecommendationCard flow={flow} />
                <DisputeFormCard flow={flow} transaction={confirmed.transaction} />
              </>
            )
          ) : (
            <NotEligibleCard flow={flow} />
          )}
        </div>
      )}

      {/* Step: wrap-up */}
      {flow.wrapUpRequested && (
        <div ref={stage === "wrapup" || stage === "done" ? latest : undefined}>
          {flow.ended ? <DoneCard flow={flow} /> : <WrapUpCard flow={flow} />}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

function Empty({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <div className="flex h-full min-h-60 flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
      <Icon className="size-6" />
      <p className="max-w-60">{text}</p>
    </div>
  );
}

function IssueTypeCard() {
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="text-sm">Issue type</CardTitle>
        <CardDescription className="text-xs">Pre-selected from the conversation. Change it if it's wrong.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-1.5">
        {ISSUE_TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            disabled={!t.available}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              t.available ? "border-primary bg-primary text-primary-foreground" : "cursor-not-allowed text-muted-foreground/60",
            )}
            title={t.available ? undefined : "Coming after M0"}
          >
            {t.label}
            {!t.available && <span className="ml-1 text-[10px]">· soon</span>}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

function TransactionSummary({ t }: { t: Transaction }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="truncate font-medium">{t.merchant}</div>
        <div className="text-xs text-muted-foreground">
          {t.date} · {t.daysAgo} days ago · {t.channel === "online" ? "Online" : "In store"} · {t.status}
        </div>
      </div>
      <div className="font-mono text-base font-semibold tabular-nums">{usd(t.amount)}</div>
    </div>
  );
}

function MatchCard({ flow, selected }: { flow: CallFlow; selected: Transaction | null }) {
  const match = flow.matches.find((m) => m.transactionId === selected?.id);
  const others = flow.matches.filter((m) => m.transactionId !== selected?.id);
  const { highlight } = useEvidence();

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-sm">Transaction the customer means</CardTitle>
        <CardDescription className="text-xs">
          {match ? "Matched from what the customer said. Confirm it with them." : "Select the transaction from the list on the left."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {flow.extractError && flow.matches.length === 0 && (
          <Alert variant="warning">
            <CircleAlert />
            <AlertTitle>AI couldn't match a transaction</AlertTitle>
            <AlertDescription>Ask the customer for the merchant and amount, then pick it from the list.</AlertDescription>
          </Alert>
        )}
        {selected ? (
          <div
            className="rounded-lg border border-primary/30 bg-primary/[0.03] p-3"
            onMouseEnter={() => highlight(selected.id)}
            onMouseLeave={() => highlight(null)}
          >
            <TransactionSummary t={selected} />
            {match && (
              <div className="mt-2 flex flex-wrap gap-1">
                {match.reasons.map((r) => (
                  <Badge key={r} variant="ai" className="text-[11px]">
                    {r}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ) : (
          !flow.extractError && <p className="text-sm text-muted-foreground">No transaction matched what the customer said.</p>
        )}
        {others.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Other possible matches</p>
            {others.map((m) => {
              const t = flow.context?.transactions.find((x) => x.id === m.transactionId);
              if (!t) return null;
              return (
                <button
                  key={m.transactionId}
                  type="button"
                  onClick={() => flow.actions.selectTransaction(t.id)}
                  className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm hover:bg-muted"
                >
                  <span className="truncate">{t.merchant}</span>
                  <span className="font-mono tabular-nums">{usd(t.amount)}</span>
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={!selected || flow.confirming} onClick={flow.actions.confirmTransaction}>
          {flow.confirming ? <Loader2 className="animate-spin" /> : <CircleCheck />}
          Customer confirmed this charge
        </Button>
      </CardFooter>
    </Card>
  );
}

function ConfirmedSummary({ flow }: { flow: CallFlow }) {
  const t = flow.confirmed!.transaction;
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 text-sm">
      <CircleCheck className="size-4 shrink-0 text-success" />
      <div className="min-w-0 flex-1">
        <div className="text-xs text-muted-foreground">Unrecognised charge · confirmed</div>
        <div className="truncate font-medium">
          {usd(t.amount)} {t.merchant}
        </div>
      </div>
      <EvidenceChips ids={[t.id]} />
    </div>
  );
}

function EligibilityCard({ flow }: { flow: CallFlow }) {
  const { eligibility } = flow.confirmed!;
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="text-sm">Dispute eligibility</CardTitle>
        <CardDescription className="text-xs">Checked by the bank's rules, not the AI · demo policy {eligibility.policyId}</CardDescription>
        <CardAction>
          {eligibility.eligible ? <Badge variant="success">Eligible</Badge> : <Badge variant="warning">Not eligible</Badge>}
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {eligibility.checks.map((c) => (
            <li key={c.clauseId} className="flex items-start gap-2 text-sm">
              {c.passed ? (
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" />
              ) : (
                <CircleX className="mt-0.5 size-4 shrink-0 text-destructive" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span>{c.label}</span>
                  <EvidenceChips ids={[c.clauseId]} />
                </div>
                <div className="text-xs text-muted-foreground">{c.detail}</div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function AiCardHeader({ title, description }: { title: string; description?: string }) {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-1.5 text-sm text-ai">
        <Sparkles className="size-4" /> {title}
      </CardTitle>
      {description && <CardDescription className="text-xs">{description}</CardDescription>}
    </CardHeader>
  );
}

function ScriptLines({ lines }: { lines: { text: string; evidenceIds: string[] }[] }) {
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <MessageSquareQuote className="size-3.5" /> Say to the customer
      </p>
      {lines.map((l, i) => (
        <blockquote key={i} className="space-y-1.5 rounded-md border-l-2 border-ai bg-background px-3 py-2 text-sm leading-relaxed">
          <p>“{l.text}”</p>
          <EvidenceChips ids={l.evidenceIds} />
        </blockquote>
      ))}
    </div>
  );
}

function RecommendationCard({ flow }: { flow: CallFlow }) {
  const rec = flow.confirmed!.recommendation;
  if (!rec?.ok)
    return (
      <Alert variant="warning">
        <CircleAlert />
        <AlertTitle>AI recommendation unavailable</AlertTitle>
        <AlertDescription>
          Follow demo policy DSP-1: confirm the customer didn't authorise the charge, check they still have the card, then submit
          the dispute below.
        </AlertDescription>
      </Alert>
    );

  return (
    <Card className="gap-4 border-ai/20 bg-ai-soft/40">
      <AiCardHeader title="Recommended next steps" description="Each step cites the records it relies on" />
      <CardContent className="space-y-4">
        <ol className="space-y-3">
          {rec.data.steps.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-ai text-[11px] font-semibold text-white">
                {i + 1}
              </span>
              <div className="space-y-1">
                <p className="leading-relaxed">{s.text}</p>
                <EvidenceChips ids={s.evidenceIds} />
              </div>
            </li>
          ))}
        </ol>
        <ScriptLines lines={rec.data.scriptLines} />
        {rec.droppedEvidence.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {rec.droppedEvidence.length} citation(s) removed because the record doesn't exist.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function DisputeFormCard({ flow, transaction }: { flow: CallFlow; transaction: Transaction }) {
  const rec = flow.confirmed!.recommendation;
  const prefill = rec?.ok ? rec.data.formPrefill : null;
  const [form, setForm] = useState<DisputeForm>({
    transactionId: transaction.id,
    reason: prefill?.reason ?? (flow.facts?.customerRecognises === false ? "not_authorised" : "not_recognised"),
    customerStatement: prefill?.customerStatement ?? "",
    cardInPossession: flow.facts?.cardInPossession ?? true,
  });
  const [reviewing, setReviewing] = useState(false);
  const statementOk = form.customerStatement.trim().length >= 10;

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-sm">Dispute form</CardTitle>
        <CardDescription className="text-xs">
          {prefill ? "Pre-filled from the call. Check and edit before submitting." : "Fill in from the call."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted/50 p-3 text-sm">
          <TransactionSummary t={transaction} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="reason">Reason</Label>
          <select
            id="reason"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value as DisputeReason })}
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {REASONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="statement" className="justify-between">
            Customer statement
            {prefill && (
              <span className="flex items-center gap-1 text-[11px] font-normal text-ai">
                <Sparkles className="size-3" /> AI draft
              </span>
            )}
          </Label>
          <Textarea
            id="statement"
            rows={3}
            value={form.customerStatement}
            onChange={(e) => setForm({ ...form, customerStatement: e.target.value })}
            aria-invalid={!statementOk && form.customerStatement.length > 0}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Card still with the customer?</Label>
          <div className="inline-flex rounded-md border p-0.5">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                type="button"
                onClick={() => setForm({ ...form, cardInPossession: v })}
                className={cn(
                  "rounded px-4 py-1 text-sm transition-colors",
                  form.cardInPossession === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {v ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={!statementOk} onClick={() => setReviewing(true)}>
          Review and approve <ArrowRight />
        </Button>
      </CardFooter>

      <Dialog open={reviewing} onOpenChange={setReviewing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve dispute</DialogTitle>
            <DialogDescription>This opens a dispute case in the bank's system (simulated). You're approving it as the agent.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="rounded-lg border p-3">
              <TransactionSummary t={transaction} />
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              <dt className="text-muted-foreground">Reason</dt>
              <dd>{REASONS.find((r) => r.id === form.reason)?.label}</dd>
              <dt className="text-muted-foreground">Card with customer</dt>
              <dd>{form.cardInPossession ? "Yes" : "No"}</dd>
              <dt className="text-muted-foreground">Statement</dt>
              <dd className="italic">“{form.customerStatement}”</dd>
              <dt className="text-muted-foreground">Policy checks</dt>
              <dd className="flex items-center gap-1 text-success">
                <CircleCheck className="size-4" /> All passed
              </dd>
            </dl>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewing(false)}>
              Back
            </Button>
            <Button
              disabled={flow.submitting}
              onClick={async () => {
                if (await flow.actions.submitDispute(form)) setReviewing(false);
              }}
            >
              {flow.submitting ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
              Approve and create case
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function CaseCreatedCard({ flow }: { flow: CallFlow }) {
  const c = flow.createdCase!;
  return (
    <Card className="gap-4 border-success/30">
      <CardHeader>
        <CardDescription className="flex items-center gap-1.5 text-xs font-medium text-success">
          <CircleCheck className="size-4" /> Dispute created
        </CardDescription>
        <CardTitle className="font-mono text-2xl tracking-tight">{c.reference}</CardTitle>
        <CardAction>
          <EvidenceChips ids={[c.id]} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <ScriptLines
          lines={[
            {
              text: `Your dispute reference is ${c.reference}. You'll hear about a provisional credit within 10 business days, and the investigation can take up to 90 days.`,
              evidenceIds: ["DSP-1.5"],
            },
          ]}
        />
      </CardContent>
      {!flow.wrapUpRequested && (
        <CardFooter>
          <Button className="w-full" variant="outline" onClick={flow.actions.startWrapUp}>
            Wrap up call <ArrowRight />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

function NotEligibleCard({ flow }: { flow: CallFlow }) {
  const { eligibility, recommendation } = flow.confirmed!;
  const existing = eligibility.existingCase;
  return (
    <>
      <Alert variant="warning">
        <FolderOpen />
        <AlertTitle>{existing ? `Case ${existing.reference} is already open` : "A dispute can't be raised"}</AlertTitle>
        <AlertDescription>
          {existing
            ? `Opened ${new Date(existing.createdAt).toLocaleString()} for ${usd(existing.amount)} ${existing.merchant}. A second case won't be created.`
            : eligibility.checks.find((c) => !c.passed)?.detail}
        </AlertDescription>
      </Alert>
      {recommendation?.ok && (
        <Card className="gap-4 border-ai/20 bg-ai-soft/40">
          <AiCardHeader title="What to do instead" />
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm">
              {recommendation.data.steps.map((s, i) => (
                <li key={i} className="space-y-1">
                  <p>{s.text}</p>
                  <EvidenceChips ids={s.evidenceIds} />
                </li>
              ))}
            </ul>
            <ScriptLines lines={recommendation.data.scriptLines} />
          </CardContent>
        </Card>
      )}
      {!flow.wrapUpRequested && (
        <Button className="w-full" variant="outline" onClick={flow.actions.startWrapUp}>
          Wrap up call <ArrowRight />
        </Button>
      )}
    </>
  );
}

function WrapUpCard({ flow }: { flow: CallFlow }) {
  const draft = flow.wrapUp;
  const [notes, setNotes] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (draft && notes === null) setNotes(draft.ok ? draft.data.notes : "");
  }, [draft, notes]);

  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-sm">Wrap-up notes</CardTitle>
        <CardDescription className="text-xs">
          {draft?.ok ? "Drafted from the call. Edit before saving." : draft ? "AI draft unavailable. Write the notes below." : "Drafting…"}
        </CardDescription>
        {draft?.ok && (
          <CardAction>
            <Badge variant="ai">
              <Sparkles /> AI draft
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {notes === null ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <Textarea rows={7} value={notes} onChange={(e) => setNotes(e.target.value)} className="text-sm leading-relaxed" />
        )}
        {draft?.ok && draft.data.followUps.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Follow-ups</p>
            <ul className="list-disc space-y-0.5 pl-5 text-sm">
              {draft.data.followUps.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={!notes?.trim() || saving}
          onClick={async () => {
            setSaving(true);
            await flow.actions.saveWrapUp(notes!);
            setSaving(false);
          }}
        >
          {saving ? <Loader2 className="animate-spin" /> : <PhoneOff />}
          Save notes and end call
        </Button>
      </CardFooter>
    </Card>
  );
}

function DoneCard({ flow }: { flow: CallFlow }) {
  const existing = flow.confirmed?.eligibility.existingCase;
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CircleCheck className="size-5 text-success" /> Call complete
        </CardTitle>
        <CardDescription>
          {flow.createdCase
            ? `Dispute ${flow.createdCase.reference} created, notes saved and every step logged.`
            : existing
              ? `Existing case ${existing.reference} shared with the customer. No duplicate created.`
              : "Notes saved and every step logged."}
        </CardDescription>
      </CardHeader>
      <CardFooter className="gap-2">
        <Button className="flex-1" onClick={flow.actions.newCall}>
          Take next call
        </Button>
      </CardFooter>
    </Card>
  );
}
