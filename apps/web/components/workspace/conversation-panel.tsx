"use client";

import { useEffect, useRef } from "react";
import { CircleAlert, Headset, MessagesSquare, Pause, Play, SkipForward } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { CallFlow } from "@/lib/use-call-flow";
import { cn, initials, usd } from "@/lib/utils";
import { AiLabel, PanelHeader } from "./kit";

export function ConversationPanel({ flow }: { flow: CallFlow }) {
  const { call, transcript, playing, analyzing, scriptDone, facts, extractError, verified, context } = flow;
  const end = useRef<HTMLDivElement>(null);
  const total = call?.script.length ?? 0;
  const customerInitials = context ? initials(context.customer.name) : "C";

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [transcript.length, analyzing]);

  const controls = verified && !scriptDone && !flow.wrapUpRequested && (
    <>
      {playing ? (
        <Button size="sm" variant="outline" onClick={flow.actions.pause}>
          <Pause /> Pause
        </Button>
      ) : (
        <Button size="sm" onClick={flow.actions.play}>
          <Play /> {transcript.length === 0 ? "Play call" : "Resume"}
        </Button>
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="size-8"
            onClick={flow.actions.step}
            disabled={playing}
            aria-label="Next line"
          >
            <SkipForward />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Next line</TooltipContent>
      </Tooltip>
    </>
  );

  return (
    <>
      <PanelHeader
        icon={MessagesSquare}
        title="Conversation"
        meta={transcript.length > 0 ? `${transcript.length} of ${total} lines` : "Scripted playback"}
      >
        {controls}
      </PanelHeader>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        {transcript.length === 0 ? (
          <Empty className="h-full">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessagesSquare />
              </EmptyMedia>
              <EmptyTitle className="text-base">
                {verified ? "Ready to play the call" : "Waiting for verification"}
              </EmptyTitle>
              <EmptyDescription>
                {verified
                  ? "Press Play call. The transcript streams in here and the co-pilot listens for the charge."
                  : "Verify the caller first. The conversation starts once their identity is confirmed."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="mx-auto max-w-2xl space-y-4">
            {transcript.map((t, i) => {
              const agent = t.speaker === "agent";
              return (
                <div
                  key={i}
                  className={cn(
                    "flex animate-in items-end gap-2.5 duration-300 fade-in-0 slide-in-from-bottom-1",
                    agent && "flex-row-reverse",
                  )}
                >
                  <Avatar className="size-7">
                    <AvatarFallback
                      className={cn(
                        "text-[10px] font-medium",
                        agent ? "bg-primary text-primary-foreground" : "border bg-background",
                      )}
                    >
                      {agent ? <Headset className="size-3.5" /> : customerInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn("flex max-w-[80%] flex-col gap-1", agent ? "items-end" : "items-start")}>
                    <span className="px-1 text-[11px] font-medium text-muted-foreground">
                      {agent ? "You" : (context?.customer.name ?? "Customer")}
                    </span>
                    <div
                      className={cn(
                        "rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                        agent
                          ? "rounded-br-md bg-primary text-primary-foreground"
                          : "rounded-bl-md border bg-card shadow-xs",
                      )}
                    >
                      {t.text}
                    </div>
                  </div>
                </div>
              );
            })}
            {analyzing && (
              <div className="flex items-center gap-2 pl-10">
                <AiLabel className="animate-pulse">Listening for details…</AiLabel>
              </div>
            )}
            {scriptDone && (
              <div className="flex items-center gap-3 pt-2 text-[11px] text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                End of scripted call
                <span className="h-px flex-1 bg-border" />
              </div>
            )}
            <div ref={end} />
          </div>
        )}
      </div>

      {(facts || extractError) && (
        <div className="shrink-0 border-t bg-surface px-4 py-3 sm:px-6">
          <div className="mx-auto max-w-2xl">
            <AiLabel className="mb-2">Details heard</AiLabel>
            {extractError && !facts ? (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CircleAlert className="size-3.5 text-warning" /> AI couldn’t read the call. Pick the transaction from
                the list.
              </p>
            ) : (
              facts && (
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-5">
                  <Fact label="Merchant" value={facts.merchant} />
                  <Fact label="Amount" value={facts.amount != null ? `~${usd(facts.amount)}` : null} />
                  <Fact label="When" value={facts.approxDaysAgo != null ? `~${facts.approxDaysAgo} days ago` : null} />
                  <Fact label="Recognises it" value={yesNo(facts.customerRecognises)} />
                  <Fact label="Has card" value={yesNo(facts.cardInPossession)} />
                </dl>
              )
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
    <div className="min-w-0">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className={cn("truncate text-sm font-medium", !value && "text-muted-foreground/50")}>{value ?? "—"}</dd>
    </div>
  );
}
