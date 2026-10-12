import { route } from "@/lib/server/handler";

export const GET = route(undefined, ({ service }) => ({ scenarios: service.listScenarios(), ai: service.aiInfo }));
