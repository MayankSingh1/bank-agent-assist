import { VerifyRequest } from "@baa/core";
import { route } from "@/lib/server/handler";

export const POST = route(VerifyRequest, ({ service, params, body }) => service.verifyCaller(params.callId!, body));
