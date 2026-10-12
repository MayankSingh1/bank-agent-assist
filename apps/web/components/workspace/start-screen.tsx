"use client";

import { useState } from "react";
import { ArrowRight, PhoneIncoming } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CallFlow } from "@/lib/use-call-flow";
import { cn } from "@/lib/utils";

export function StartScreen({ flow }: { flow: CallFlow }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const scenarioId = selected ?? flow.scenarios[0]?.id ?? null;

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md gap-6 py-6">
        <CardHeader className="px-6">
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-muted">
            <PhoneIncoming className="size-5" />
          </div>
          <CardTitle className="text-xl">Ready for calls</CardTitle>
          <CardDescription>
            Pick a scripted demo call. The assistant briefs you, follows the conversation and prepares the resolution. You
            approve every action.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-6">
          <div className="space-y-2">
            {flow.scenarios.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelected(s.id)}
                className={cn(
                  "w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/50",
                  scenarioId === s.id && "border-primary ring-1 ring-primary",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Scenario {String.fromCharCode(65 + i)}: {s.title}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{s.summary}</p>
              </button>
            ))}
          </div>
          <Button
            className="w-full"
            size="lg"
            disabled={!scenarioId || starting}
            onClick={async () => {
              if (!scenarioId) return;
              setStarting(true);
              await flow.actions.startCall(scenarioId);
              setStarting(false);
            }}
          >
            Start call <ArrowRight />
          </Button>
          <p className="text-center text-xs text-muted-foreground">All customers, transactions and policies are fictional.</p>
        </CardContent>
      </Card>
    </div>
  );
}
