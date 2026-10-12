import { Check } from "lucide-react";
import { STAGES, type Stage } from "@/lib/use-call-flow";
import { cn } from "@/lib/utils";

export function Stepper({ stage }: { stage: Stage }) {
  const current = stage === "done" ? STAGES.length : STAGES.findIndex((s) => s.id === stage);
  return (
    <ol className="flex items-center gap-1 text-xs">
      {STAGES.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s.id} className="flex items-center gap-1">
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium transition-colors",
                done && "text-muted-foreground",
                active && "bg-primary text-primary-foreground",
                !done && !active && "text-muted-foreground/60",
              )}
            >
              <span
                className={cn(
                  "flex size-4 items-center justify-center rounded-full border text-[10px]",
                  done && "border-success bg-success text-white",
                  active && "border-primary-foreground/40",
                )}
              >
                {done ? <Check className="size-2.5" strokeWidth={3} /> : i + 1}
              </span>
              {s.label}
            </span>
            {i < STAGES.length - 1 && <span className="h-px w-3 bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}
