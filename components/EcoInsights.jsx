"use client";

function trimText(value) {
  const s = String(value ?? "").trim();
  return s || null;
}

function InsightCard({ icon, title, children }) {
  if (!children) return null;
  return (
    <div className="rounded-2xl border border-emerald-100/90 bg-gradient-to-br from-white via-emerald-50/35 to-teal-50/25 p-4 shadow-sm ring-1 ring-emerald-100/50 sm:p-5">
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-800 ring-1 ring-emerald-200/70"
          aria-hidden
        >
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-xs font-bold uppercase tracking-wide text-emerald-800">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700">{children}</p>
        </div>
      </div>
    </div>
  );
}

export default function EcoInsights({ result }) {
  if (!result || result.is_waste === false) return null;

  const material = trimText(result.material_type);
  const sorting = trimText(result.sorting_explanation);
  const disposal = trimText(result.disposal_guidance);
  const env = trimText(result.environment_note);

  if (!material && !sorting && !disposal && !env) return null;

  return (
    <div className="mt-6 flex flex-col gap-3 sm:gap-4">
      {material ? (
        <InsightCard
          title="Material"
          icon={
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2 2 7l10 5 10-5-10-5z" />
              <path d="m2 17 10 5 10-5" />
              <path d="m2 12 10 5 10-5" />
            </svg>
          }
        >
          {material}
        </InsightCard>
      ) : null}

      {sorting ? (
        <InsightCard
          title="Why this category"
          icon={
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          }
        >
          {sorting}
        </InsightCard>
      ) : null}

      {disposal ? (
        <InsightCard
          title="How to dispose"
          icon={
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
          }
        >
          {disposal}
        </InsightCard>
      ) : null}

      {env ? (
        <InsightCard
          title="Environment"
          icon={
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          }
        >
          {env}
        </InsightCard>
      ) : null}
    </div>
  );
}
