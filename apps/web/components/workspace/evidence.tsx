"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { CreditCard, FileText, FolderOpen, Receipt, User } from "lucide-react";
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
  const value = useMemo(
    () => ({ refs: new Map(refs.map((r) => [r.id, r])), highlighted, highlight }),
    [refs, highlighted],
  );
  return <EvidenceContext.Provider value={value}>{children}</EvidenceContext.Provider>;
}

export const useEvidence = () => useContext(EvidenceContext);

const ICONS = { transaction: Receipt, policy: FileText, card: CreditCard, customer: User, case: FolderOpen } as const;

/**
 * Chips showing which records a statement relies on. Hover or focus one to see the record and
 * highlight it in the customer panel. `refs` overrides the call's evidence index (the audit log
 * resolves its own).
 */
export function EvidenceChips({
  ids,
  refs: override,
  className,
}: {
  ids: string[];
  refs?: Map<string, EvidenceRef>;
  className?: string;
}) {
  const ctx = useEvidence();
  const refs = override ?? ctx.refs;
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
                aria-label={ref ? `${id}: ${ref.label}` : id}
                onMouseEnter={() => ctx.highlight(id)}
                onMouseLeave={() => ctx.highlight(null)}
                onFocus={() => ctx.highlight(id)}
                onBlur={() => ctx.highlight(null)}
                className="inline-flex h-5 items-center gap-1 rounded-md border bg-background px-1.5 font-mono text-[11px] text-muted-foreground transition-colors outline-none hover:border-foreground/20 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
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
