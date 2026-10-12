"use client";

import { useState } from "react";
import { ArrowRight, CircleCheck, FileSearch, PhoneIncoming, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import type { CallFlow } from "@/lib/use-call-flow";
import { cn } from "@/lib/utils";

const PRINCIPLES = [
  { icon: Sparkles, title: "AI recommends", text: "Briefs you, follows the call, cites its sources" },
  { icon: ShieldCheck, title: "You decide", text: "Nothing happens without your approval" },
  { icon: FileSearch, title: "Fully audited", text: "Every step is logged with evidence" },
];

export function StartScreen({ flow }: { flow: CallFlow }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const scenarioId = selected ?? flow.scenarios[0]?.id ?? null;

  const start = async () => {
    if (!scenarioId) return;
    setStarting(true);
    await flow.actions.startCall(scenarioId);
    setStarting(false);
  };

  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto p-4 sm:p-8">
      <div className="w-full max-w-lg space-y-6">
        <Card className="gap-5 py-6 shadow-sm">
          <CardHeader className="px-6">
            <div className="mb-3 flex size-11 items-center justify-center rounded-xl border bg-surface">
              <PhoneIncoming className="size-5" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">Ready for calls</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Pick a scripted demo call. The co-pilot briefs you, follows the conversation and prepares the resolution.
            </p>
          </CardHeader>
          <CardContent className="px-6">
            <div role="radiogroup" aria-label="Demo scenario" className="space-y-2">
              {flow.scenarios.length === 0 && <Skeleton className="h-[74px] w-full rounded-lg" />}
              {flow.scenarios.map((s, i) => {
                const checked = scenarioId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    onClick={() => setSelected(s.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg border p-3.5 text-left transition-all outline-none hover:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-ring/50",
                      checked && "border-primary/60 bg-muted/40 ring-1 ring-primary/60",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
                        checked && "border-primary bg-primary text-primary-foreground",
                      )}
                    >
                      {checked && <CircleCheck className="size-4" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">
                        Scenario {String.fromCharCode(65 + i)} · {s.title}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">{s.summary}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3 px-6">
            <Button className="w-full" size="lg" disabled={!scenarioId || starting} onClick={start}>
              {starting ? <Spinner /> : null}
              Start call
              {!starting && <ArrowRight />}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              All customers, transactions and policies are fictional.
            </p>
          </CardFooter>
        </Card>

        <ul className="grid gap-3 sm:grid-cols-3">
          {PRINCIPLES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-2.5 sm:flex-col sm:gap-1.5">
              <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground sm:mt-0" />
              <div>
                <div className="text-sm font-medium">{title}</div>
                <div className="text-xs leading-relaxed text-muted-foreground">{text}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
