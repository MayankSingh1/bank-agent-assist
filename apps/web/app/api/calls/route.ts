import { StartCallRequest } from "@baa/core";
import { DEMO_AGENT, route } from "@/lib/server/handler";

export const POST = route(StartCallRequest, ({ service, body }) => service.startCall(body.scenarioId, DEMO_AGENT));
