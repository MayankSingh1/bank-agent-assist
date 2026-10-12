import { CreateDisputeRequest } from "@baa/core";
import { route } from "@/lib/server/handler";

export const POST = route(CreateDisputeRequest, ({ service, body }) => service.createDispute(body));
