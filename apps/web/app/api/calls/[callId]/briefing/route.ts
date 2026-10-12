import { route } from "@/lib/server/handler";

export const GET = route(undefined, ({ service, params }) => service.getBriefingSummary(params.callId!));
