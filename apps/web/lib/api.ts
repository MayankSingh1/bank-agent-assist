import type {
  AiResult,
  AuditEvent,
  BriefingSummary,
  CallContext,
  CallStarted,
  ConfirmResult,
  DisputeCreated,
  DisputeForm,
  EvidenceRef,
  IssueType,
  ScenarioSummary,
  ScriptTurn,
  TurnResult,
  VerifyResult,
  WrapUp,
} from "@baa/core";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: init?.method ?? (init?.body ? "POST" : "GET"),
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = json?.error ?? {};
    throw new ApiError(res.status, e.code ?? "internal", e.message ?? "Request failed", e.details);
  }
  return json as T;
}

export const api = {
  scenarios: () => request<{ scenarios: ScenarioSummary[]; ai: { provider: string; model: string | null } }>("/scenarios"),
  startCall: (scenarioId: string) => request<CallStarted>("/calls", { body: { scenarioId } }),
  verify: (callId: string, body: { dob: string; last4: string }) => request<VerifyResult>(`/calls/${callId}/verify`, { body }),
  context: (callId: string) => request<CallContext>(`/calls/${callId}/context`),
  briefing: (callId: string) => request<AiResult<BriefingSummary>>(`/calls/${callId}/briefing`),
  turn: (callId: string, turn: ScriptTurn) => request<TurnResult>(`/calls/${callId}/turns`, { body: turn }),
  confirm: (callId: string, body: { transactionId: string; issueType: IssueType }) =>
    request<ConfirmResult>(`/calls/${callId}/confirm`, { body }),
  createDispute: (body: { callId: string; idempotencyKey: string; form: DisputeForm }) =>
    request<DisputeCreated>("/disputes", { body }),
  wrapUpDraft: (callId: string) => request<AiResult<WrapUp>>(`/calls/${callId}/wrap-up`),
  saveWrapUp: (callId: string, notes: string) => request<{ endedAt: string }>(`/calls/${callId}/wrap-up`, { body: { notes } }),
  audit: (callId: string) => request<{ events: AuditEvent[]; evidence: EvidenceRef[] }>(`/calls/${callId}/audit`),
  reset: () => request<{ ok: true }>("/demo/reset", { method: "POST" }),
};
