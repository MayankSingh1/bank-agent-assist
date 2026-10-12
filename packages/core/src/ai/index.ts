import { GeminiProvider } from "./gemini";
import { MockProvider } from "./mock";
import type { AiProvider, AiProviderName } from "./provider";

export type { AiProvider, AiProviderName } from "./provider";

class OffProvider implements AiProvider {
  readonly name = "off" as const;
  readonly model = null;
  private fail(): never {
    throw new Error("AI is turned off (AI_PROVIDER=off)");
  }
  briefing = async () => this.fail();
  extractFacts = async () => this.fail();
  recommend = async () => this.fail();
  wrapUp = async () => this.fail();
}

// Alias that tracks the current Flash model; override with GEMINI_MODEL to pin a version.
const DEFAULT_MODEL = "gemini-flash-latest";

/**
 * Picks the AI provider from the environment:
 * - AI_PROVIDER=gemini|mock|off forces one.
 * - Otherwise Gemini if GEMINI_API_KEY or Vertex AI is configured, else mock.
 */
export function createAiProvider(env: NodeJS.ProcessEnv = process.env): AiProvider {
  const vertexai = env.GOOGLE_GENAI_USE_VERTEXAI === "true";
  const hasGemini = Boolean(env.GEMINI_API_KEY) || vertexai;
  const requested = (env.AI_PROVIDER as AiProviderName | undefined) ?? (hasGemini ? "gemini" : "mock");

  switch (requested) {
    case "gemini":
      return new GeminiProvider(env.GEMINI_MODEL || DEFAULT_MODEL, {
        apiKey: env.GEMINI_API_KEY,
        vertexai,
        project: env.GOOGLE_CLOUD_PROJECT,
        location: env.GOOGLE_CLOUD_LOCATION,
      });
    case "off":
      return new OffProvider();
    default:
      return new MockProvider();
  }
}
