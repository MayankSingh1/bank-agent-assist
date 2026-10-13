"use client";

import { useEffect, useRef } from "react";
import { CircleAlert, MessagesSquare, Pause, Play, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Kbd } from "@/components/ui/kbd";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { CallFlow } from "@/lib/use-call-flow";
import { cn, usd } from "@/lib/utils";
import { AiLabel, PanelHeader } from "./kit";

export function ConversationPanel({ flow }: { flow: CallFlow }) {
  const { call, transcript, playing, analyzing, scriptDone, facts, extractError, verified, context } = flow;
  const end = useRef<HTMLDivElement>(null);
  const total = call?.script.length ?? 0;

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [transcript.length, analyzing]);

  const controls = verified && !scriptDone && !flow.wrapUpRequested && (
    <>
      {playing ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="xs" variant="outline" onClick={flow.actions.pause} className="gap-1">
              <Pause className="size-3" /> Pause
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Pause <Kbd>Space</Kbd>
          </TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="xs" onClick={flow.actions.play} className="gap-1">
              <Play className="size-3" /> {transcript.length === 0 ? "Play" : "Resume"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {transcript.length === 0 ? "Play call" : "Resume"} <Kbd>Space</Kbd>
          </TooltipContent>
        </Tooltip>
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon-xs"
            variant="outline"
            onClick={flow.actions.step}
            disabled={playing}
            aria-label="Next line"
          >
            <SkipForward className="size-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Next line <Kbd>→</Kbd>
        </TooltipContent>
      </Tooltip>
    </>
  );

  return (
    <>
      <PanelHeader
        icon={MessagesSquare}
        title="Transcript"
        meta={transcript.length > 0 ? `${transcript.length}/${total}` : "Playback"}
      >
        {controls}
      </PanelHeader>

      <div className="min-h-0 flex-1 overflow-y-auto bg-background px-3 py-3 lg:px-4 dark:bg-surface-sunken">
        {transcript.length === 0 ? (
          <Empty className="h-full border-0 bg-transparent">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessagesSquare className="size-5" />
              </EmptyMedia>
              <EmptyTitle className="text-[13px]">{verified ? "Ready to play" : "Awaiting verification"}</EmptyTitle>
              <EmptyDescription className="text-[12px]">
                {verified ? "Press Play. The transcript streams here." : "Verify the caller to start."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-0.5">
            {transcript.map((t, i) => {
              const agent = t.speaker === "agent";
              const customerName = context?.customer.name ?? "Customer";
              return (
                <div
                  key={i}
                  className={cn(
                    "group rounded px-2 py-1.5 transition-colors hover:bg-muted/50",
                    "animate-in duration-200 fade-in-0 slide-in-from-bottom-1",
                  )}
                >
                  <div className="flex items-baseline gap-2">
                    <span
                      className={cn(
                        "text-[10px] font-semibold tracking-wide uppercase",
                        agent ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {agent ? "Agent" : customerName.split(" ")[0]}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground/60 tabular-nums opacity-0 transition-opacity group-hover:opacity-100">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-foreground/90">{t.text}</p>
                </div>
              );
            })}
            {analyzing && (
              <div className="flex items-center gap-2 px-2 py-2">
                <div className="flex gap-1">
                  <span className="size-1.5 animate-pulse rounded-full bg-ai" />
                  <span className="size-1.5 animate-pulse rounded-full bg-ai [animation-delay:150ms]" />
                  <span className="size-1.5 animate-pulse rounded-full bg-ai [animation-delay:300ms]" />
                </div>
                <span className="text-[11px] font-medium text-ai">Listening…</span>
              </div>
            )}
            {scriptDone && (
              <div className="flex items-center gap-2 px-2 py-3 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                <span className="h-px flex-1 bg-border" />
                End
                <span className="h-px flex-1 bg-border" />
              </div>
            )}
            <div ref={end} />
          </div>
        )}
      </div>

      {(facts || extractError) && (
        <div className="shrink-0 border-t border-border bg-surface px-3 py-2 lg:px-4 dark:bg-surface-elevated">
          <div className="flex items-start gap-3">
            <AiLabel className="shrink-0 text-[10px]">Extracted</AiLabel>
            {extractError && !facts ? (
              <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <CircleAlert className="size-3 text-warning" /> Could not parse. Select manually.
              </p>
            ) : facts ? (
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                <Fact label="Merchant" value={facts.merchant} />
                <Fact label="Amount" value={facts.amount != null ? `~${usd(facts.amount)}` : null} />
                <Fact label="When" value={facts.approxDaysAgo != null ? `${facts.approxDaysAgo}d ago` : null} />
                <Fact label="Recognises" value={yesNo(facts.customerRecognises)} />
                <Fact label="Has card" value={yesNo(facts.cardInPossession)} />
              </div>
            ) : (
              <Skeleton className="h-4 w-48" />
            )}
          </div>
        </div>
      )}
    </>
  );
}

const yesNo = (v: boolean | null) => (v == null ? null : v ? "Yes" : "No");

function Fact({ label, value }: { label: string; value: string | null }) {
  return (
    <span className="inline-flex items-baseline gap-1">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium", !value && "text-muted-foreground/50")}>{value ?? "—"}</span>
    </span>
  );
}
