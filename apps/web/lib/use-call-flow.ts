"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type {
  AiResult,
  BriefingSummary,
  CallContext,
  CallStarted,
  ConfirmResult,
  DisputeCase,
  DisputeForm,
  ExtractedFacts,
  ScenarioSummary,
  TransactionMatch,
  WrapUp,
} from "@baa/core";
import { api, ApiError } from "./api";

export type Stage = "verify" | "brief" | "listen" | "confirm" | "act" | "wrapup" | "done";

export const STAGES: { id: Exclude<Stage, "done">; label: string }[] = [
  { id: "verify", label: "Verify" },
  { id: "brief", label: "Brief" },
  { id: "listen", label: "Listen" },
  { id: "confirm", label: "Confirm" },
  { id: "act", label: "Act" },
  { id: "wrapup", label: "Wrap up" },
];

type Turn = { speaker: "agent" | "customer"; text: string; at: string };

const TURN_DELAY_MS = 1400;

const message = (err: unknown) => (err instanceof Error ? err.message : "Something went wrong");

export function useCallFlow() {
  const [scenarios, setScenarios] = useState<ScenarioSummary[]>([]);
  const [aiInfo, setAiInfo] = useState<{ provider: string; model: string | null } | null>(null);

  const [call, setCall] = useState<CallStarted | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [verify, setVerify] = useState<{ attemptsLeft: number; locked: boolean; error: string | null }>({
    attemptsLeft: 3,
    locked: false,
    error: null,
  });
  const [verified, setVerified] = useState(false);
  const [context, setContext] = useState<CallContext | null>(null);
  const [briefing, setBriefing] = useState<AiResult<BriefingSummary> | null>(null);

  const [transcript, setTranscript] = useState<Turn[]>([]);
  const [playing, setPlaying] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [facts, setFacts] = useState<ExtractedFacts | null>(null);
  const [matches, setMatches] = useState<TransactionMatch[]>([]);
  const [extractError, setExtractError] = useState<string | null>(null);

  const [selectedTxnId, setSelectedTxnId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState<ConfirmResult | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [createdCase, setCreatedCase] = useState<DisputeCase | null>(null);
  const idempotencyKey = useRef<string>("");

  const [wrapUp, setWrapUp] = useState<AiResult<WrapUp> | null>(null);
  const [wrapUpRequested, setWrapUpRequested] = useState(false);
  const [ended, setEnded] = useState(false);
  const [auditVersion, setAuditVersion] = useState(0);

  const busy = useRef(false);
  const callIdRef = useRef<string | null>(null);

  useEffect(() => {
    api
      .scenarios()
      .then((r) => {
        setScenarios(r.scenarios);
        setAiInfo(r.ai);
      })
      .catch((e) => toast.error(message(e)));
  }, []);

  const bumpAudit = () => setAuditVersion((v) => v + 1);

  const clear = useCallback(() => {
    callIdRef.current = null;
    setCall(null);
    setStartedAt(null);
    setVerify({ attemptsLeft: 3, locked: false, error: null });
    setVerified(false);
    setContext(null);
    setBriefing(null);
    setTranscript([]);
    setPlaying(false);
    setAnalyzing(false);
    setFacts(null);
    setMatches([]);
    setExtractError(null);
    setSelectedTxnId(null);
    setConfirming(false);
    setConfirmed(null);
    setSubmitting(false);
    setCreatedCase(null);
    setWrapUp(null);
    setWrapUpRequested(false);
    setEnded(false);
  }, []);

  const startCall = useCallback(
    async (scenarioId: string) => {
      clear();
      try {
        const started = await api.startCall(scenarioId);
        callIdRef.current = started.callId;
        idempotencyKey.current = crypto.randomUUID();
        setCall(started);
        setAiInfo(started.ai);
        setStartedAt(Date.now());
        bumpAudit();
      } catch (e) {
        toast.error(message(e));
      }
    },
    [clear],
  );

  const submitVerification = useCallback(
    async (answer: { dob: string; last4: string }) => {
      if (!call) return;
      try {
        const r = await api.verify(call.callId, answer);
        bumpAudit();
        if (!r.verified) {
          setVerify({
            attemptsLeft: r.attemptsLeft,
            locked: r.locked,
            error: r.locked ? "Too many failed attempts. Escalate to a team lead." : "Details don't match our records.",
          });
          return;
        }
        setVerified(true);
        setVerify({ attemptsLeft: r.attemptsLeft, locked: false, error: null });
        const ctx = await api.context(call.callId);
        setContext(ctx);
        api
          .briefing(call.callId)
          .then(setBriefing)
          .catch((e) => toast.error(message(e)));
      } catch (e) {
        if (e instanceof ApiError && e.code === "verification_locked")
          setVerify({ attemptsLeft: 0, locked: true, error: e.message });
        else toast.error(message(e));
      }
    },
    [call],
  );

  // Scripted call playback: sends one turn at a time, waiting for each to be analysed.
  const sendNextTurn = useCallback(async () => {
    const callId = callIdRef.current;
    if (!call || !callId || busy.current) return false;
    const next = call.script[transcript.length];
    if (!next) return false;
    busy.current = true;
    setTranscript((t) => [...t, { ...next, at: new Date().toISOString() }]);
    if (next.speaker === "customer") setAnalyzing(true);
    try {
      const r = await api.turn(callId, next);
      if (callIdRef.current !== callId) return false;
      if (r.analysis) {
        setFacts(r.analysis.facts);
        setMatches(r.analysis.matches);
        setExtractError(r.analysis.ai.ok ? null : r.analysis.ai.error);
        const top = r.analysis.matches[0];
        if (top) setSelectedTxnId((current) => current ?? top.transactionId);
      }
    } catch (e) {
      toast.error(message(e));
      setPlaying(false);
    } finally {
      busy.current = false;
      setAnalyzing(false);
    }
    return true;
  }, [call, transcript.length]);

  useEffect(() => {
    if (!playing || !call || transcript.length >= call.script.length) return;
    const t = setTimeout(() => void sendNextTurn(), transcript.length === 0 ? 200 : TURN_DELAY_MS);
    return () => clearTimeout(t);
  }, [playing, call, transcript.length, sendNextTurn]);

  const confirmTransaction = useCallback(async () => {
    if (!call || !selectedTxnId) return;
    setConfirming(true);
    try {
      setConfirmed(await api.confirm(call.callId, { transactionId: selectedTxnId, issueType: "unrecognised_charge" }));
      bumpAudit();
    } catch (e) {
      toast.error(message(e));
    } finally {
      setConfirming(false);
    }
  }, [call, selectedTxnId]);

  const submitDispute = useCallback(
    async (form: DisputeForm) => {
      if (!call) return false;
      setSubmitting(true);
      try {
        const r = await api.createDispute({ callId: call.callId, idempotencyKey: idempotencyKey.current, form });
        setCreatedCase(r.case);
        toast.success(`Dispute ${r.case.reference} created`);
        // Refresh account data so the transaction list shows the new case.
        api
          .context(call.callId)
          .then(setContext)
          .catch(() => {});
        return true;
      } catch (e) {
        toast.error(message(e));
        return false;
      } finally {
        setSubmitting(false);
        bumpAudit();
      }
    },
    [call],
  );

  const startWrapUp = useCallback(async () => {
    if (!call) return;
    setWrapUpRequested(true);
    setPlaying(false);
    try {
      setWrapUp(await api.wrapUpDraft(call.callId));
    } catch (e) {
      toast.error(message(e));
    }
  }, [call]);

  const saveWrapUp = useCallback(
    async (notes: string) => {
      if (!call) return;
      try {
        await api.saveWrapUp(call.callId, notes);
        setEnded(true);
        bumpAudit();
        toast.success("Notes saved. Call ended.");
      } catch (e) {
        toast.error(message(e));
      }
    },
    [call],
  );

  const resetDemo = useCallback(async () => {
    try {
      await api.reset();
      clear();
      toast.success("Demo data reset");
    } catch (e) {
      toast.error(message(e));
    }
  }, [clear]);

  const scriptDone = !!call && transcript.length >= call.script.length;

  const stage: Stage | null = !call
    ? null
    : ended
      ? "done"
      : wrapUpRequested
        ? "wrapup"
        : confirmed
          ? "act"
          : selectedTxnId && (matches.length > 0 || scriptDone)
            ? "confirm"
            : verified && transcript.length > 0
              ? "listen"
              : verified
                ? "brief"
                : "verify";

  return {
    scenarios,
    aiInfo,
    call,
    startedAt,
    stage,
    verify,
    verified,
    context,
    briefing,
    transcript,
    // Playback stops by itself at the end of the script.
    playing: playing && !scriptDone,
    analyzing,
    scriptDone,
    facts,
    matches,
    extractError,
    selectedTxnId,
    confirming,
    confirmed,
    submitting,
    createdCase,
    wrapUp,
    wrapUpRequested,
    ended,
    auditVersion,
    actions: {
      startCall,
      submitVerification,
      play: () => setPlaying(true),
      pause: () => setPlaying(false),
      step: () => void sendNextTurn(),
      selectTransaction: (id: string) => !confirmed && setSelectedTxnId(id),
      confirmTransaction,
      submitDispute,
      startWrapUp,
      saveWrapUp,
      newCall: clear,
      resetDemo,
    },
  };
}

export type CallFlow = ReturnType<typeof useCallFlow>;
