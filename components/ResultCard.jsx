"use client";

import EcoInsights from "@/components/EcoInsights";
import RecyclabilityBadge from "@/components/RecyclabilityBadge";

function clampConfidence(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.min(100, Math.max(0, Math.round(n)));
}

function confidenceBarColor(pct) {
  if (pct > 70) return "bg-emerald-500";
  if (pct >= 40) return "bg-amber-400";
  return "bg-red-500";
}

export default function ResultCard({
  result,
  imagePreview,
  scanAgain,
  recycleSlot,
}) {
  const classification = String(result?.classification ?? "").toLowerCase();
  const isDry = classification === "dry";
  const isWet = classification === "wet";
  const confidence = clampConfidence(result?.confidence);
  const itemName = String(result?.item_name ?? "").trim();
  const isWaste = result?.is_waste !== false;

  return (
    <article
      className="eco-card-lift eco-animate-in eco-delay-1 w-full rounded-3xl border border-emerald-100/90 bg-white/95 p-5 shadow-md ring-1 ring-emerald-100/40 sm:p-6"
      aria-labelledby="result-item-name"
    >
      <div className="flex flex-col gap-5">
        <div className="mx-auto flex w-full max-w-[280px] flex-col items-center gap-3">
          {imagePreview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- user preview URL */}
                <img
                  src={imagePreview}
                  alt="Your uploaded photo"
                  className="mx-auto h-auto w-full max-h-[320px] rounded-xl border border-emerald-100/80 object-contain shadow-sm transition-shadow duration-300 hover:shadow-md"
                />
            </>
          ) : (
            <div className="flex aspect-square w-full max-w-[220px] items-center justify-center rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 text-sm text-neutral-500">
              No preview
            </div>
          )}

          {scanAgain ? (
            <div className="flex w-full justify-center">{scanAgain}</div>
          ) : null}
        </div>

        {recycleSlot ? (
          <div className="flex w-full flex-col items-center border-b border-emerald-100/70 pb-5 pt-1">
            {recycleSlot}
          </div>
        ) : null}

        <div className="min-w-0 w-full">
          {isDry || isWet ? (
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                isDry
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-orange-500 text-white shadow-sm"
              }`}
            >
              {isDry ? "Dry Waste" : "Wet Waste"}
            </span>
          ) : (
            <span className="inline-block rounded-full bg-neutral-200 px-3 py-1 text-xs font-bold uppercase tracking-wide text-neutral-700">
              {isWaste ? "Unclassified" : "Not waste"}
            </span>
          )}

          <h2
            id="result-item-name"
            className="mt-3 text-lg font-bold leading-snug text-emerald-950 sm:text-xl"
          >
            {itemName || (isWaste ? "Unknown item" : "No waste detected")}
          </h2>

          {!isWaste && result?.not_waste_message ? (
            <p className="mt-2 text-sm text-neutral-600">{result.not_waste_message}</p>
          ) : null}

          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
              <span className="font-medium text-neutral-700">Confidence</span>
              <span
                className={`font-semibold tabular-nums ${
                  confidence > 70
                    ? "text-emerald-700"
                    : confidence >= 40
                      ? "text-amber-700"
                      : "text-red-600"
                }`}
              >
                {confidence}%
              </span>
            </div>
            <div
              className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-200"
              role="progressbar"
              aria-valuenow={confidence}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Classification confidence ${confidence} percent`}
            >
              <div
                className={`h-full rounded-full transition-[width] duration-500 ease-out ${confidenceBarColor(confidence)}`}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          <RecyclabilityBadge
            recyclable={result?.recyclable}
            reason={result?.recyclability_reason}
          />

          <EcoInsights result={result} />
        </div>
      </div>
    </article>
  );
}
