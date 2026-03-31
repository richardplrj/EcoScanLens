import { NextResponse } from "next/server";
import { ECOSCAN_CLASSIFY_SYSTEM_PROMPT } from "@/lib/prompts";
import { resolveMaterialKeyFromResult } from "@/lib/realityCheck";

const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";

/**
 * Default: gpt-4o-mini (vision, much cheaper than gpt-4o).
 * Override in .env.local: OPENAI_MODEL=gpt-4o (higher quality, pricier).
 * Cheaper than mini for *images* usually means another provider or a text-only model (no photo).
 */
const MODEL =
  String(process.env.OPENAI_MODEL || "gpt-4o-mini").trim() || "gpt-4o-mini";

/**
 * Normalize a base64 payload to a data URL for the Vision API.
 */
function toImageDataUrl(imageBase64) {
  const s = String(imageBase64).trim();
  if (!s) return null;
  if (s.startsWith("data:image/")) return s;
  if (s.startsWith("iVBOR")) return `data:image/png;base64,${s}`;
  return `data:image/jpeg;base64,${s}`;
}

/**
 * Parse JSON from model output; strips optional markdown fences.
 */
function parseModelJson(content) {
  let text = String(content).trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "");
  }
  return JSON.parse(text);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const { image } = body ?? {};
  if (image == null || typeof image !== "string" || !String(image).trim()) {
    return NextResponse.json(
      { error: "Missing or invalid image. Send { image: base64 string }." },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !String(apiKey).trim()) {
    return NextResponse.json(
      { error: "Server misconfiguration: OpenAI API key is not set." },
      { status: 500 }
    );
  }

  const imageUrl = toImageDataUrl(image);
  if (!imageUrl) {
    return NextResponse.json(
      { error: "Image payload is empty." },
      { status: 400 }
    );
  }

  const payload = {
    model: MODEL,
    temperature: 0,
    max_tokens: 1800,
    messages: [
      { role: "system", content: ECOSCAN_CLASSIFY_SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: "Classify this waste item." },
          {
            type: "image_url",
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
  };

  let response;
  try {
    response = await fetch(OPENAI_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the AI service. Check your network and try again." },
      { status: 500 }
    );
  }

  if (response.status === 401) {
    return NextResponse.json(
      { error: "Invalid or revoked OpenAI API key." },
      { status: 401 }
    );
  }

  if (response.status === 429) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please wait and try again." },
      { status: 429 }
    );
  }

  if (!response.ok) {
    let detail = "";
    try {
      const errJson = await response.json();
      detail =
        errJson?.error?.message ||
        errJson?.message ||
        `OpenAI error (${response.status})`;
    } catch {
      detail = `OpenAI request failed (${response.status}).`;
    }
    return NextResponse.json(
      { error: detail },
      { status: response.status >= 500 ? 502 : response.status }
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid response from the AI service." },
      { status: 502 }
    );
  }

  const content = data?.choices?.[0]?.message?.content;
  if (content == null || typeof content !== "string") {
    return NextResponse.json(
      { error: "Empty or unexpected response from the model." },
      { status: 500 }
    );
  }

  let parsed;
  try {
    parsed = parseModelJson(content);
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not parse classification JSON from the model. Try again or use a clearer photo.",
      },
      { status: 500 }
    );
  }

  // Normalize to a deterministic model key for downstream mapping/routing.
  if (parsed?.is_waste === true) {
    parsed.material_key = resolveMaterialKeyFromResult(parsed);
  } else {
    parsed.material_key = "";
  }

  return NextResponse.json(parsed);
}
