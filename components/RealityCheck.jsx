"use client";

import { useMemo } from "react";
import { getRealityCheckFromGptResult } from "@/lib/realityCheck";

const R = 54;
const STROKE = 8;
const C = 2 * Math.PI * R;

function gaugeStroke(percent, mode) {
  if (mode === "composting") {
    return percent >= 50 ? "#16a34a" : "#ca8a04";
  }
  if (percent >= 55) return "#16a34a";
  if (percent >= 25) return "#d97706";
  return "#dc2626";
}

function DonutGauge({ percent, mode }) {
  const p = Math.min(100, Math.max(0, Number(percent) || 0));
  const offset = C * (1 - p / 100);
  const stroke = gaugeStroke(p, mode);

  return (
    <div className="relative mx-auto h-40 w-40 sm:h-44 sm:w-44">
      <svg
        className="-rotate-90 h-full w-full"
        viewBox={`0 0 ${(R + STROKE) * 2} ${(R + STROKE) * 2}`}
        aria-hidden
      >
        <circle
          cx={R + STROKE}
          cy={R + STROKE}
          r={R}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          className="text-emerald-100/90"
        />
        <circle
          cx={R + STROKE}
          cy={R + STROKE}
          r={R}
          fill="none"
          stroke={stroke}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
          style={{ filter: "drop-shadow(0 2px 6px rgb(16 185 129 / 0.25))" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-extrabold tabular-nums text-emerald-950 sm:text-4xl">
          {p}%
        </span>
      </div>
    </div>
  );
}

export default function RealityCheck({ result }) {
  const data = useMemo(() => getRealityCheckFromGptResult(result), [result]);

  if (!data) return null;

  const {
    mode,
    percent,
    material,
    reasons,
    tips,
    isNearZero,
  } = data;

  const subtitle =
    mode === "composting"
      ? "Composting Success in Mumbai"
      : "Recycling Success in Mumbai";

  return (
    <section
      className="eco-animate-in eco-delay-5 rounded-3xl border border-teal-200/80 bg-gradient-to-br from-white via-teal-50/40 to-emerald-50/50 p-5 shadow-md ring-1 ring-teal-100/50 sm:p-6"
      aria-labelledby="reality-check-heading"
    >
      <div className="flex flex-col gap-2 border-b border-teal-100/80 pb-4 text-center sm:text-left">
        <h2
          id="reality-check-heading"
          className="text-lg font-bold tracking-tight text-emerald-950 sm:text-xl"
        >
          Reality Check
        </h2>
        <p className="text-xs leading-relaxed text-neutral-600 sm:text-sm">
          After your item is recognized, this layer shows what Mumbai&apos;s
          waste system is likely to do with it, grounded in our model trained
          on municipal data.
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center gap-2">
        <DonutGauge percent={percent} mode={mode} />
        <p className="text-center text-sm font-semibold text-emerald-900">
          {subtitle}
        </p>
        <p className="text-center text-xs text-neutral-500">
          Mapped material:{" "}
          <span className="font-medium text-neutral-700">{material.replace(/_/g, " ")}</span>
        </p>
      </div>

      {reasons.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wide text-teal-900">
            Why this score
          </h3>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-700">
            {reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-5">
        <h3 className="text-xs font-bold uppercase tracking-wide text-teal-900">
          {isNearZero || percent <= 0
            ? "What you can do"
            : "Tips to improve outcomes"}
        </h3>
        {isNearZero || percent <= 0 ? (
          <p className="mt-2 text-sm leading-relaxed text-neutral-700">
            In Mumbai&apos;s current infrastructure, this type of item is
            effectively not recycled through formal streams. See below for
            practical steps and what to expect.
          </p>
        ) : null}
        {tips.length > 0 ? (
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-700">
            {tips.slice(0, 3).map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="mt-6 rounded-2xl border border-emerald-600/25 bg-emerald-200/65 px-4 py-3.5 shadow-sm sm:px-5 sm:py-4">
        <p className="text-center text-xs font-semibold leading-relaxed text-emerald-950 sm:text-left sm:text-sm">
          Predictions based on ML model trained on Mumbai municipal waste data
          from CPCB, BMC Waste Audits &amp; Swachh Bharat Mission, plus EPA
          global recycling benchmarks.
        </p>
      </div>
    </section>
  );
}
