"use client";

import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCallFlow } from "@/lib/use-call-flow";
import { AuditSheet } from "./audit-sheet";
import { ConversationPanel } from "./conversation-panel";
import { CopilotPanel } from "./copilot-panel";
import { CustomerPanel } from "./customer-panel";
import { EvidenceProvider } from "./evidence";
import { Header } from "./header";
import { StartScreen } from "./start-screen";
import { Stepper } from "./stepper";
import { VerifyPanel } from "./verify-panel";

export function Workspace() {
  const flow = useCallFlow();
  const [auditOpen, setAuditOpen] = useState(false);

  return (
    <TooltipProvider>
      <EvidenceProvider refs={flow.context?.evidence ?? []}>
        <div className="flex h-dvh flex-col">
          <Header flow={flow} onOpenAudit={() => setAuditOpen(true)} />
          {!flow.call || !flow.stage ? (
            <StartScreen flow={flow} />
          ) : (
            <>
              <div className="border-b px-5 py-2 xl:hidden">
                <Stepper stage={flow.stage} />
              </div>
              <main className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[minmax(300px,360px)_minmax(0,1fr)_minmax(340px,420px)] lg:overflow-hidden">
                <section className="min-h-0 overflow-y-auto border-b bg-muted/30 p-4 lg:border-r lg:border-b-0">
                  <SectionTitle>Customer</SectionTitle>
                  {flow.verified ? <CustomerPanel flow={flow} /> : <VerifyPanel flow={flow} />}
                </section>
                <section className="min-h-[420px] border-b lg:min-h-0 lg:border-b-0">
                  <ConversationPanel flow={flow} />
                </section>
                <section className="min-h-0 overflow-y-auto bg-muted/30 p-4 lg:border-l">
                  <SectionTitle>Co-pilot</SectionTitle>
                  <CopilotPanel flow={flow} />
                </section>
              </main>
            </>
          )}
        </div>
        <AuditSheet callId={flow.call?.callId ?? null} version={flow.auditVersion} open={auditOpen} onOpenChange={setAuditOpen} />
      </EvidenceProvider>
    </TooltipProvider>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{children}</h2>;
}
