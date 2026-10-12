"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { FileText, Receipt, CreditCard, User, FolderOpen } from "lucide-react";
import type { EvidenceRef } from "@baa/core";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type EvidenceState = {
  refs: Map<string, EvidenceRef>;
  highlighted: string | null;
  highlight: (id: string | null) => void;
};

const EvidenceContext = createContext<EvidenceState>({ refs: new Map(), highlighted: null, highlight: () => {} });

export function EvidenceProvider({ refs, children }: { refs: EvidenceRef[]; children: React.ReactNode }) {
  const [highlighted, highlight] = useState<string | null>(null);
  const value = useMemo(() => ({ refs: new Map(refs.map((r) => [r.id, r])), highlighted, highlight }), [refs, highlighted]);
  return <EvidenceContext.Provider value={value}>{children}</EvidenceContext.Provider>;
}

export const useEvidence = () => useContext(EvidenceContext);

const ICONS = { transaction: Receipt, policy: FileText, card: CreditCard, customer: User, case: FolderOpen } as const;

/** Small chips showing which records an AI statement relies on. Hover for the record, click to highlight it. */
export function EvidenceChips({ ids, className }: { ids: string[]; className?: string }) {
  const { refs, highlight } = useEvidence();
  if (ids.length === 0) return null;
  return (
    <span className={cn("inline-flex flex-wrap gap-1", className)}>
      {ids.map((id) => {
        const ref = refs.get(id);
        const Icon = ref ? ICONS[ref.kind] : FileText;
        return (
          <Tooltip key={id}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onMouseEnter={() => highlight(id)}
                onMouseLeave={() => highlight(null)}
                onFocus={() => highlight(id)}
                onBlur={() => highlight(null)}
                className="inline-flex items-center gap-1 rounded border border-border bg-muted/60 px-1.5 py-px font-mono text-[11px] leading-4 text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
              >
                <Icon className="size-3" />
                {id}
              </button>
            </TooltipTrigger>
            <TooltipContent>{ref?.label ?? "Record"}</TooltipContent>
          </Tooltip>
        );
      })}
    </span>
  );
}
