"use client";

import { useEffect, useState } from "react";
import { Headset, History, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { CallFlow } from "@/lib/use-call-flow";
import { Stepper } from "./stepper";

function useElapsed(startedAt: number | null, stopped: boolean) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!startedAt || stopped) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [startedAt, stopped]);
  if (!startedAt) return null;
  const s = Math.max(0, Math.floor((now - startedAt) / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function AiBadge({ info }: { info: CallFlow["aiInfo"] }) {
  if (!info) return null;
  if (info.provider === "gemini")
    return (
      <Badge variant="ai" title={info.model ?? undefined}>
        <Sparkles /> Gemini
      </Badge>
    );
  if (info.provider === "mock")
    return (
      <Badge variant="warning" title="No Gemini credentials found. Using offline rules so the flow still works.">
        <Sparkles /> Mock AI
      </Badge>
    );
  return <Badge variant="outline">AI off</Badge>;
}

export function Header({ flow, onOpenAudit }: { flow: CallFlow; onOpenAudit: () => void }) {
  const elapsed = useElapsed(flow.startedAt, flow.ended);
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-5">
      <div className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Headset className="size-4" />
        </div>
        <span className="font-semibold tracking-tight">Bank Agent Assist</span>
      </div>

      {flow.call && flow.stage && (
        <>
          <Separator orientation="vertical" className="h-6!" />
          <div className="flex items-center gap-2 text-sm">
            {flow.ended ? (
              <Badge variant="secondary">Call ended</Badge>
            ) : (
              <Badge variant="outline" className="gap-1.5">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-success" />
                </span>
                On call
              </Badge>
            )}
            <span className="font-mono text-muted-foreground tabular-nums">{elapsed}</span>
            {flow.verified && (
              <Badge variant="success">
                <ShieldCheck /> Verified
              </Badge>
            )}
          </div>
          <div className="mx-auto hidden xl:block">
            <Stepper stage={flow.stage} />
          </div>
        </>
      )}

      <div className="ml-auto flex items-center gap-2">
        <AiBadge info={flow.aiInfo} />
        {flow.call && (
          <Button variant="ghost" size="sm" onClick={onOpenAudit}>
            <History /> Audit log
          </Button>
        )}
        <Button variant="ghost" size="sm" onClick={flow.actions.resetDemo} title="Clear all cases, calls and audit events">
          <RotateCcw /> Reset demo
        </Button>
      </div>
    </header>
  );
}
