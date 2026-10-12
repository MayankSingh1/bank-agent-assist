import { route } from "@/lib/server/handler";

export const GET = route(undefined, ({ service, params }) => service.getAudit(params.callId!));
