/**
 * Maps API/network failures to safe, user-facing copy. Never pass through raw stacks/JSON.
 */
export function friendlyApiError(res, data) {
  const fallback =
    "Something went wrong while analyzing your photo. Please try again.";

  if (res.status === 401) {
    return "We could not connect to the AI service. Please check your setup and try again.";
  }
  if (res.status === 429) {
    return "Too many requests right now. Please wait a moment and try again.";
  }
  if (res.status >= 500) {
    return "The AI service is temporarily unavailable. Please try again in a few minutes.";
  }

  const raw = typeof data?.error === "string" ? data.error.trim() : "";
  if (!raw) return fallback;

  if (raw.length > 220) return fallback;
  if (/^[\[{][\s\S]*[}\]]$/.test(raw)) return fallback;
  if (/\bat\s+\w+/i.test(raw) && raw.length > 80) return fallback;
  if (/sk-[a-zA-Z0-9_-]{10,}/i.test(raw)) return fallback;
  if (/OPENAI_API_KEY|api\.openai\.com/i.test(raw) && raw.length > 100) {
    return fallback;
  }

  return raw;
}

export const NETWORK_ERROR_MESSAGE =
  "We could not reach the server. Check your connection and try again.";

export const TIMEOUT_ERROR_MESSAGE =
  "This is taking too long. Try a smaller image or check your connection, then try again.";
