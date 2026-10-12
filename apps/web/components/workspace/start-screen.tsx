"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, FileSearch, Headset, Phone, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import type { CallFlow } from "@/lib/use-call-flow";
import { cn } from "@/lib/utils";

const PRINCIPLES = [
  {
    icon: Sparkles,
    title: "AI recommends",
    text: "Briefs you, follows the call, cites its sources",
    gradient: "from-violet-500/20 to-purple-500/20 dark:from-violet-500/10 dark:to-purple-500/10",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    icon: ShieldCheck,
    title: "You decide",
    text: "Nothing happens without your approval",
    gradient: "from-emerald-500/20 to-teal-500/20 dark:from-emerald-500/10 dark:to-teal-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: FileSearch,
    title: "Fully audited",
    text: "Every step is logged with evidence",
    gradient: "from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
];

function GridPattern() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black_20%,transparent_100%)] bg-[size:4rem_4rem] opacity-[0.35]" />
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-primary/5 to-primary/10 blur-3xl dark:from-primary/10 dark:to-primary/20" />
      <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-gradient-to-tl from-violet-500/5 to-blue-500/10 blur-3xl dark:from-violet-500/10 dark:to-blue-500/20" />
    </div>
  );
}

function HeroIcon() {
  return (
    <div className="relative">
      <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-br from-primary/20 to-violet-500/20 blur-xl" />
      <div className="relative flex size-16 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 transition-transform duration-300 hover:scale-105 sm:size-20">
        <Headset className="size-7 sm:size-9" strokeWidth={1.5} />
      </div>
    </div>
  );
}

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
    <div className="relative flex flex-1 items-center justify-center overflow-y-auto">
      <GridPattern />

      <div className="relative z-10 w-full max-w-xl space-y-8 px-4 py-8 sm:px-8 sm:py-12">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <HeroIcon />
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready for calls</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-balance text-muted-foreground sm:text-base">
            Your AI co-pilot briefs you, follows the conversation, and prepares policy-backed resolutions.
          </p>
        </div>

        <Card className="overflow-hidden border-border/60 bg-card/80 shadow-xl shadow-black/5 backdrop-blur-sm dark:border-border/40 dark:bg-card/60 dark:shadow-black/20">
          <CardHeader className="border-b border-border/50 bg-muted/30 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:from-emerald-500/20 dark:to-teal-500/20 dark:text-emerald-400">
                <Zap className="size-5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Demo scenarios</h2>
                <p className="text-xs text-muted-foreground">Pick a scripted call to explore</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div role="radiogroup" aria-label="Demo scenario" className="space-y-3">
              {flow.scenarios.length === 0 && (
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
              )}
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
                      "group flex w-full items-start gap-4 rounded-xl border-2 border-transparent bg-muted/40 p-4 text-left transition-all duration-200 outline-none hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      checked && "border-primary/50 bg-primary/5 ring-1 ring-primary/20 dark:bg-primary/10",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
                        checked
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 group-hover:border-muted-foreground/50",
                      )}
                    >
                      {checked && <CheckCircle2 className="size-4" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-sm font-semibold">{s.title}</span>
                      </span>
                      <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">{s.summary}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4 border-t border-border/50 bg-muted/20 px-4 py-5 sm:px-6">
            <Button
              className="w-full gap-2 bg-gradient-to-r from-primary to-primary/90 text-base font-semibold shadow-lg shadow-primary/20 transition-all duration-200 hover:from-primary/95 hover:to-primary/85 hover:shadow-xl hover:shadow-primary/25 disabled:from-muted disabled:to-muted disabled:shadow-none dark:shadow-primary/10 dark:hover:shadow-primary/20"
              size="lg"
              disabled={!scenarioId || starting}
              onClick={start}
            >
              {starting ? <Spinner /> : <Phone className="size-4" />}
              <span>{starting ? "Connecting..." : "Start call"}</span>
              {!starting && (
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground/80">
              All customers, transactions, and policies are fictional.
            </p>
          </CardFooter>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          {PRINCIPLES.map(({ icon: Icon, title, text, gradient, iconColor }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/80 hover:shadow-lg dark:bg-card/30 dark:hover:bg-card/50"
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                  gradient,
                )}
              />
              <div className="relative">
                <div
                  className={cn(
                    "mb-3 flex size-10 items-center justify-center rounded-lg bg-muted/80 transition-colors duration-300 group-hover:bg-background/80",
                    iconColor,
                  )}
                >
                  <Icon className="size-5" />
                </div>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
