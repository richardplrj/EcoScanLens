"use client";

export default function FunFact({ fact }) {
  const text = String(fact ?? "").trim();
  if (!text) return null;

  return (
    <aside
      className="eco-animate-in eco-delay-4 rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-green-50/80 p-5 shadow-md ring-1 ring-emerald-100/50 transition-shadow duration-300 hover:shadow-lg hover:ring-emerald-200/50 sm:p-6"
      aria-labelledby="fun-fact-heading"
    >
      <h2
        id="fun-fact-heading"
        className="text-sm font-bold uppercase tracking-wide text-emerald-800"
      >
        Did You Know?
      </h2>
      <p className="mt-3 text-base leading-relaxed text-emerald-950/90">
        {text}
      </p>
    </aside>
  );
}
