"use client";

import { useEffect, useState } from "react";
import { CircleCheck, CircleX } from "lucide-react";
import type { AuditEvent, EvidenceRef } from "@baa/core";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export function AuditSheet({
  callId,
  version,
  open,
  onOpenChange,
}: {
  callId: string | null;
  version: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [data, setData] = useState<{ events: AuditEvent[]; evidence: EvidenceRef[] } | null>(null);

  useEffect(() => {
    if (!open || !callId) return;
    api.audit(callId).then(setData).catch(() => setData(null));
  }, [open, callId, version]);

  const refs = new Map(data?.evidence.map((r) => [r.id, r]));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>Audit log</SheetTitle>
          <SheetDescription>Every action on this call: who, when, and the records it relied on.</SheetDescription>
        </SheetHeader>
        <ol className="flex-1 space-y-0 overflow-y-auto p-4">
          {data?.events.map((e, i) => (
            <li key={e.id} className="relative flex gap-3 pb-5">
              {i < data.events.length - 1 && <span className="absolute top-5 left-[9px] h-full w-px bg-border" />}
              {e.result === "ok" ? (
                <CircleCheck className="relative size-[19px] shrink-0 fill-background text-success" />
              ) : (
                <CircleX className="relative size-[19px] shrink-0 fill-background text-destructive" />
              )}
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-xs font-medium">{e.type}</span>
                  <time className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">
                    {new Date(e.at).toLocaleTimeString()}
                  </time>
                </div>
                <p className="text-sm">{e.summary}</p>
                <p className="text-xs text-muted-foreground">by {e.actor}</p>
                {e.evidenceIds.length > 0 && (
                  <ul className="flex flex-wrap gap-1 pt-0.5">
                    {e.evidenceIds.map((id) => (
                      <li
                        key={id}
                        title={refs.get(id)?.label}
                        className={cn("rounded border bg-muted/60 px-1.5 py-px font-mono text-[11px] text-muted-foreground")}
                      >
                        {id}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
          {data?.events.length === 0 && <p className="text-sm text-muted-foreground">No events yet.</p>}
        </ol>
      </SheetContent>
    </Sheet>
  );
}
