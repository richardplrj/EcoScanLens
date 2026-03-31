"use client";

const IDEA_EMOJIS = ["♻️", "🌿", "🪴", "🔧", "📦"];

function normalizeIdeas(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof item.title === "string" &&
        typeof item.description === "string"
    )
    .slice(0, 3);
}

export default function UpcyclingIdeas({ ideas }) {
  const list = normalizeIdeas(ideas);
  if (list.length === 0) return null;

  return (
    <section
      className="eco-animate-in eco-delay-3"
      aria-labelledby="upcycling-heading"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 ring-1 ring-amber-200/80"
          aria-hidden
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
          </svg>
        </span>
        <h2
          id="upcycling-heading"
          className="text-lg font-bold tracking-tight text-emerald-950"
        >
          Upcycling Ideas
        </h2>
      </div>

      <ul className="eco-upcycle-list mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((idea, i) => (
          <li key={`${idea.title}-${i}`}>
            <article className="eco-card-lift flex h-full flex-col rounded-2xl border border-emerald-100/90 bg-white/95 p-4 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <div
                className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-2xl"
                aria-hidden
              >
                {IDEA_EMOJIS[i % IDEA_EMOJIS.length]}
              </div>
              <h3 className="font-bold text-emerald-950">{idea.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {idea.description}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
