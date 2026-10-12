import { ConfirmRequest } from "@baa/core";
import { route } from "@/lib/server/handler";

export const POST = route(ConfirmRequest, ({ service, params, body }) => service.confirmIssue(params.callId!, body));
