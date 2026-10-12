"use client";

import { useState } from "react";
import { Lock, PhoneIncoming, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CallFlow } from "@/lib/use-call-flow";

export function VerifyPanel({ flow }: { flow: CallFlow }) {
  const [dob, setDob] = useState("");
  const [last4, setLast4] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { call, verify } = flow;
  if (!call) return null;

  return (
    <div className="space-y-4">
      <Card className="gap-3">
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide">
            <PhoneIncoming className="size-3.5" /> Incoming call
          </CardDescription>
          <CardTitle className="text-lg tabular-nums">{call.caller.phone}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1.5 text-sm">
          <Row label="Matched customer" value={call.caller.maskedName} />
          <Row label="Card" value={call.caller.maskedCard} />
          <p className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
            <Lock className="size-3" /> Account details stay hidden until the caller is verified.
          </p>
        </CardContent>
      </Card>

      <Card className="gap-4">
        <CardHeader>
          <CardTitle>Verify the caller</CardTitle>
          <CardDescription>Ask for their date of birth and the last 4 digits of their card.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting(true);
              await flow.actions.submitVerification({ dob, last4 });
              setSubmitting(false);
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="dob">Date of birth</Label>
              <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} disabled={verify.locked} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="last4">Card, last 4 digits</Label>
              <Input
                id="last4"
                inputMode="numeric"
                maxLength={4}
                placeholder="0000"
                value={last4}
                onChange={(e) => setLast4(e.target.value.replace(/\D/g, ""))}
                disabled={verify.locked}
                required
              />
            </div>
            {verify.error && (
              <Alert variant={verify.locked ? "destructive" : "warning"}>
                <ShieldAlert />
                <AlertTitle>{verify.locked ? "Verification locked" : "Not verified"}</AlertTitle>
                <AlertDescription>
                  {verify.error}
                  {!verify.locked && ` ${verify.attemptsLeft} attempt${verify.attemptsLeft === 1 ? "" : "s"} left.`}
                </AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={verify.locked || submitting || dob === "" || last4.length !== 4}>
              Verify caller
            </Button>
            <p className="text-center text-xs text-muted-foreground">Demo answers: 1990-04-14 and 4242</p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
