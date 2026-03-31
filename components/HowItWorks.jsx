function Step({
  icon,
  title,
  description,
  stepIndex,
}) {
  return (
    <div
      className={`group eco-card-lift eco-hiw-step eco-hiw-step-${stepIndex} rounded-2xl border border-emerald-100/80 bg-white/70 p-6 shadow-sm`}
    >
      <div className="flex items-start gap-3">
        <div
          className="eco-step-icon flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/70"
          aria-hidden
        >
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-bold tracking-tight text-emerald-950">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section
      className="rounded-3xl border border-emerald-100/80 bg-emerald-50/70 px-4 py-10 shadow-sm ring-1 ring-emerald-100/40 transition-shadow duration-500 hover:shadow-md sm:px-8"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-5xl">
        <h2
          id="how-it-works-heading"
          className="text-center text-sm font-bold uppercase tracking-wide text-emerald-800"
        >
          How It Works
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Step
            stepIndex={0}
            icon={
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            }
            title="Upload"
            description="Take a photo or upload an image of any waste item"
          />

          <Step
            stepIndex={1}
            icon={
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18h1a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2" />
                <path d="M15 18h1a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2" />
                <path d="M9 18v1a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-1" />
              </svg>
            }
            title="Classify"
            description="We instantly identify and classify your waste"
          />

          <Step
            stepIndex={2}
            icon={
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M8.5 14.5c-1.5-1.2-2.5-3-2.5-5A7 7 0 0 1 19 9.5c0 2-1 3.8-2.5 5.0-.9.7-1.5 1.7-1.5 2.8V18H10v-.7c0-1.1-.6-2.1-1.5-2.8z" />
              </svg>
            }
            title="Discover"
            description="Get recycling info and creative upcycling ideas"
          />
        </div>
      </div>
    </section>
  );
}

