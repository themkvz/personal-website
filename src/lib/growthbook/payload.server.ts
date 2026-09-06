import { type FeatureApiResponse, GrowthBook } from "@growthbook/growthbook";
import { env } from "~/env.server";

/**
 * The decrypted feature payload to serialize into the page, so the browser can
 * initialize synchronously and render the assigned variant on the first pass.
 *
 * A fresh instance per request, as GrowthBook's hybrid SSR guide does. The SDK
 * caches payloads at module level, keyed by host and client key, so this costs
 * a network round trip only when the cache is cold or stale — and `init`
 * resolves on timeout rather than throwing, hence the empty fallback.
 */
export async function getFeaturePayload(): Promise<FeatureApiResponse> {
  const { GROWTHBOOK_API_HOST: apiHost, GROWTHBOOK_CLIENT_KEY: clientKey } =
    env;
  if (!apiHost || !clientKey) return {};

  const gb = new GrowthBook({ apiHost, clientKey });
  try {
    // `streaming: false` also disables background sync, keeping the server from
    // holding open an SSE connection to GrowthBook.
    await gb.init({ timeout: 1_000, streaming: false });
    return gb.getDecryptedPayload() ?? {};
  } catch {
    return {};
  } finally {
    gb.destroy();
  }
}
