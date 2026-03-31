"use client";

function parseFirstNumber(text) {
  const m = String(text).match(/(\d+(?:[.,]\d+)?)/);
  if (!m) return null;
  const raw = m[1].replace(",", ".");
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function getDecompositionSeverity(decompositionTime) {
  const s = String(decompositionTime ?? "").toLowerCase().trim();
  if (!s) {
    return {
      pct: 50,
      barClass: "bg-neutral-300",
      textClass: "text-neutral-700",
    };
  }

  if (s.includes("century")) {
    return {
      pct: 95,
      barClass: "bg-red-500",
      textClass: "text-red-700",
    };
  }

  if (s.includes("week") || s.includes("month")) {
    return {
      pct: 25,
      barClass: "bg-emerald-500",
      textClass: "text-emerald-700",
    };
  }

  if (s.includes("year")) {
    const n = parseFirstNumber(s);
    if (n == null) {
      return {
        pct: 50,
        barClass: "bg-neutral-300",
        textClass: "text-neutral-700",
      };
    }

    if (n >= 100) {
      return {
        pct: 95,
        barClass: "bg-red-500",
        textClass: "text-red-700",
      };
    }

    if (n < 10) {
      return {
        pct: 45,
        barClass: "bg-amber-400",
        textClass: "text-amber-800",
      };
    }

    // 10-100 years
    return {
      pct: 75,
      barClass: "bg-orange-500",
      textClass: "text-orange-700",
    };
  }

  // Unknown format
  return {
    pct: 50,
    barClass: "bg-neutral-300",
    textClass: "text-neutral-700",
  };
}

export default function DecompositionBar({ decompositionTime }) {
  const { pct, barClass, textClass } = getDecompositionSeverity(
    decompositionTime
  );

  return (
    <section className="eco-animate-in eco-delay-2 rounded-3xl border border-emerald-100/90 bg-white/95 p-5 shadow-md ring-1 ring-emerald-100/40 sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-700">
            Decomposition Time
          </p>
          <p className={`mt-1 text-lg font-bold ${textClass}`}>
            {decompositionTime}
          </p>
        </div>

        <div className="text-sm font-semibold text-neutral-600">
          {pct}% persistence
        </div>
      </div>

      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          className={`${barClass} h-full rounded-full transition-[width] duration-1000 ease-out`}
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

