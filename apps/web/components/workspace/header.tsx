"use client";

import { useEffect, useState } from "react";
import { EllipsisVertical, Headset, History, Moon, RotateCcw, ShieldCheck, Sparkles, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { CallFlow } from "@/lib/use-call-flow";
import { useTheme } from "@/lib/use-theme";
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

function AiBadge({ info }: { info: CallFlow["aiInfo"] }) {
  if (!info) return null;
  const [variant, label, hint] =
    info.provider === "gemini"
      ? (["ai", "Gemini", `Live model: ${info.model ?? "Gemini"}`] as const)
      : info.provider === "mock"
        ? (["warning", "Mock AI", "No Gemini credentials found. Offline rules keep the flow working."] as const)
        : (["outline", "AI off", "AI is disabled. Every AI step falls back to the manual path."] as const);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant={variant} className="hidden h-6 cursor-default sm:inline-flex">
          <Sparkles /> {label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="max-w-60">{hint}</TooltipContent>
    </Tooltip>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label="Toggle theme"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          <Sun className="hidden dark:block" />
          <Moon className="dark:hidden" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Toggle theme</TooltipContent>
    </Tooltip>
  );
}

export function Header({ flow, onOpenAudit }: { flow: CallFlow; onOpenAudit: () => void }) {
  const elapsed = useElapsed(flow.startedAt, flow.ended);
  const onCall = !!(flow.call && flow.stage);

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
          <Headset className="size-4" />
        </div>
        <div className="hidden leading-tight sm:block">
          <div className="text-sm font-semibold tracking-tight">Bank Agent Assist</div>
          <div className="text-[11px] text-muted-foreground">Card servicing · Everyday Bank</div>
        </div>
      </div>

      {onCall && (
        <>
          <Separator orientation="vertical" className="mx-1 hidden data-[orientation=vertical]:h-6 sm:block" />
          <div className="flex items-center gap-2">
            {flow.ended ? (
              <Badge variant="secondary" className="h-6">
                Call ended
              </Badge>
            ) : (
              <Badge variant="outline" className="h-6 gap-1.5">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-success" />
                </span>
                On call
              </Badge>
            )}
            <span className="font-mono text-xs text-muted-foreground tabular-nums">{elapsed}</span>
            {flow.verified && (
              <Badge variant="success" className="hidden h-6 md:inline-flex">
                <ShieldCheck /> Verified
              </Badge>
            )}
          </div>
          <div className="mx-auto hidden xl:block">
            <Stepper stage={flow.stage!} />
          </div>
        </>
      )}

      <div className="ml-auto flex items-center gap-1">
        <AiBadge info={flow.aiInfo} />
        {flow.call && (
          <Button variant="ghost" size="sm" onClick={onOpenAudit} className="ml-1">
            <History /> <span className="hidden sm:inline">Audit log</span>
          </Button>
        )}
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8" aria-label="More">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Demo controls</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={flow.actions.resetDemo}>
              <RotateCcw /> Reset demo data
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
