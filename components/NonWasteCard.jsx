"use client";

import Spinner from "@/components/Spinner";

export default function NonWasteCard({ message, onTryAgain, isPending = false }) {
  const text =
    typeof message === "string" && message.trim()
      ? message.trim()
      : "This photo does not look like waste. Try taking a clear picture of trash or packaging.";

  return (
    <div className="eco-animate-in mx-auto w-full max-w-3xl px-4 pb-14 sm:px-6">
      <div className="rounded-3xl border border-sky-200/90 bg-gradient-to-br from-sky-50/90 via-emerald-50/40 to-teal-50/60 p-6 shadow-md ring-1 ring-sky-100/50 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/90 text-sky-600 shadow-sm ring-1 ring-sky-100 transition-transform duration-300 hover:scale-105"
            aria-hidden
          >
            <svg
              className="h-9 w-9"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </div>
          <h2 className="mt-5 text-lg font-bold text-emerald-950">
            That does not look like waste
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-neutral-700">
            {text}
          </p>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              if (!isPending) onTryAgain?.();
            }}
            className="eco-micro-press eco-focus-soft mt-8 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {isPending ? <Spinner className="border-white" /> : null}
            {isPending ? "Please wait…" : "Try Again"}
          </button>
        </div>
      </div>
    </div>
  );
}
