import { route } from "@/lib/server/handler";

export const POST = route(undefined, ({ service }) => {
  service.reset();
  return { ok: true };
});
