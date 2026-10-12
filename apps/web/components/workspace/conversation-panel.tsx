"use client";

import { useEffect, useRef } from "react";
import { CircleAlert, MessagesSquare, Pause, Play, SkipForward, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CallFlow } from "@/lib/use-call-flow";
import { cn, usd } from "@/lib/utils";

export function ConversationPanel({ flow }: { flow: CallFlow }) {
  const { call, transcript, playing, analyzing, scriptDone, facts, extractError, verified } = flow;
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [transcript.length, analyzing]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold">Conversation</h2>
          <p className="text-xs text-muted-foreground">Scripted call playback</p>
        </div>
        {verified && !scriptDone && !flow.wrapUpRequested && (
          <div className="flex items-center gap-1.5">
            {playing ? (
              <Button size="sm" variant="outline" onClick={flow.actions.pause}>
                <Pause /> Pause
              </Button>
            ) : (
              <Button size="sm" onClick={flow.actions.play}>
                <Play /> {transcript.length === 0 ? "Play call" : "Resume"}
              </Button>
            )}
            <Button size="icon" variant="outline" className="size-8" onClick={flow.actions.step} disabled={playing} title="Next line">
              <SkipForward />
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {transcript.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
            <MessagesSquare className="size-6" />
            {verified ? "Press Play call to start the conversation." : "Verify the caller to begin."}
          </div>
        ) : (
          <div className="space-y-3">
            {transcript.map((t, i) => (
              <div key={i} className={cn("flex flex-col gap-1", t.speaker === "agent" ? "items-end" : "items-start")}>
                <span className="px-1 text-[11px] font-medium text-muted-foreground">
                  {t.speaker === "agent" ? "You (agent)" : "Customer"}
                </span>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed animate-in fade-in-0 slide-in-from-bottom-1",
                    t.speaker === "agent" ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm border bg-card",
                  )}
                >
                  {t.text}
                </div>
              </div>
            ))}
            {analyzing && (
              <div className="flex items-center gap-1.5 px-1 text-xs text-ai">
                <Sparkles className="size-3.5 animate-pulse" /> Listening for details…
              </div>
            )}
            {scriptDone && <p className="pt-2 text-center text-xs text-muted-foreground">End of scripted call</p>}
            <div ref={end} />
          </div>
        )}
      </div>

      {(facts || extractError) && (
        <div className="border-t bg-muted/30 px-5 py-3">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-ai">
            <Sparkles className="size-3.5" /> Details heard
          </div>
          {extractError && !facts ? (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CircleAlert className="size-3.5 text-warning" /> AI couldn't read the call. Pick the transaction from the list.
            </p>
          ) : (
            facts && (
              <dl className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
                <Fact label="Merchant" value={facts.merchant} />
                <Fact label="Amount" value={facts.amount != null ? `~${usd(facts.amount)}` : null} />
                <Fact label="When" value={facts.approxDaysAgo != null ? `~${facts.approxDaysAgo} days ago` : null} />
                <Fact label="Recognises it" value={facts.customerRecognises == null ? null : facts.customerRecognises ? "Yes" : "No"} />
                <Fact label="Has card" value={facts.cardInPossession == null ? null : facts.cardInPossession ? "Yes" : "No"} />
              </dl>
            )
          )}
        </div>
      )}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className={cn("truncate font-medium", !value && "text-muted-foreground/50")}>{value ?? "–"}</dd>
    </div>
  );
}
