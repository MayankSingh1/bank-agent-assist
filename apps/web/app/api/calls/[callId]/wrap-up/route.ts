import { SaveWrapUpRequest } from "@baa/core";
import { route } from "@/lib/server/handler";

export const GET = route(undefined, ({ service, params }) => service.getWrapUpDraft(params.callId!));
export const POST = route(SaveWrapUpRequest, ({ service, params, body }) =>
  service.saveWrapUp(params.callId!, body.notes),
);
