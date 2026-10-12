import { TurnRequest } from "@baa/core";
import { route } from "@/lib/server/handler";

export const POST = route(TurnRequest, ({ service, params, body }) => service.addTurn(params.callId!, body));
