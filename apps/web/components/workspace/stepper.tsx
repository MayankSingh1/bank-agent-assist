import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { STAGES, type Stage } from "@/lib/use-call-flow";
import { cn } from "@/lib/utils";

const indexOf = (stage: Stage) => (stage === "done" ? STAGES.length : STAGES.findIndex((s) => s.id === stage));

/** Full stepper for wide screens. */
export function Stepper({ stage }: { stage: Stage }) {
  const current = indexOf(stage);
  return (
    <ol className="flex items-center gap-1 text-xs" aria-label="Call progress">
      {STAGES.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s.id} className="flex items-center gap-1" aria-current={active ? "step" : undefined}>
            <span
              className={cn(
                "flex h-7 items-center gap-1.5 rounded-full px-2.5 font-medium transition-colors",
                done && "text-foreground",
                active && "bg-primary text-primary-foreground shadow-xs",
                !done && !active && "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-4 items-center justify-center rounded-full border text-[10px] tabular-nums",
                  done && "border-success bg-success text-background",
                  active && "border-primary-foreground/40",
                )}
              >
                {done ? <Check className="size-2.5" strokeWidth={3} /> : i + 1}
              </span>
              {s.label}
            </span>
            {i < STAGES.length - 1 && <span className={cn("h-px w-4", i < current ? "bg-success/50" : "bg-border")} />}
          </li>
        );
      })}
    </ol>
  );
}

/** Compact progress bar for narrower screens. */
export function CompactStepper({ stage }: { stage: Stage }) {
  const current = indexOf(stage);
  const label = stage === "done" ? "Complete" : STAGES[current]?.label;
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="shrink-0 font-medium">
        {stage === "done" ? "Call complete" : `Step ${current + 1} of ${STAGES.length}`}
        <span className="text-muted-foreground"> · {label}</span>
      </span>
      <Progress value={(Math.min(current, STAGES.length) / STAGES.length) * 100} className="h-1.5" />
    </div>
  );
}
