"use client";

import Spinner from "@/components/Spinner";

export default function ErrorCard({ message, onTryAgain, isPending = false }) {
  const text =
    typeof message === "string" && message.trim()
      ? message.trim()
      : "Something went wrong. Please try again.";

  return (
    <div
      className="eco-animate-in mx-auto w-full max-w-3xl px-4 pb-14 sm:px-6"
      role="alert"
    >
      <div className="rounded-3xl border border-red-200/90 bg-gradient-to-br from-red-50/95 via-white to-red-50/40 p-6 shadow-md ring-1 ring-red-100/60 sm:p-8">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-700 shadow-sm ring-1 ring-red-200/80 transition-transform duration-300 hover:scale-105"
            aria-hidden
          >
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <div className="mt-4 min-w-0 flex-1 sm:ml-5 sm:mt-0">
            <h2 className="text-lg font-bold text-red-950">Something went wrong</h2>
            <p className="mt-2 text-sm leading-relaxed text-red-900/90">{text}</p>
            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                if (!isPending) onTryAgain?.();
              }}
              className="eco-micro-press eco-focus-soft mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-red-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {isPending ? <Spinner className="border-white" /> : null}
              {isPending ? "Please wait…" : "Try Again"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
