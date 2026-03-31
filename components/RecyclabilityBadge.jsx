"use client";

export default function RecyclabilityBadge({ recyclable, reason }) {
  const isRecyclable = Boolean(recyclable);

  return (
    <div className="mt-5">
      <div
        className={`eco-badge-pop inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${
          isRecyclable
            ? "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200/80"
            : "bg-red-50 text-red-800 ring-1 ring-red-200/80"
        }`}
      >
        {isRecyclable ? (
          <>
            <span
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center"
              aria-hidden
            >
              <svg
                className="h-[18px] w-[18px] text-emerald-700"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M9.302 1.256a1.5 1.5 0 0 0-2.604 0l-1.704 2.95a.5.5 0 0 0 .122.514l.58-.55a.5.5 0 0 1 .18-.012l1.086.45a.5.5 0 0 1 .314.97L7.896 7l.483.451A.5.5 0 0 1 8 8h1v2l-.447.276a.5.5 0 0 1-.223.052H6.5a.5.5 0 0 1-.223-.052L6 10V8h1a.5.5 0 0 1 .414-.225l.484-.452.356-.35-.184-1.01a.5.5 0 0 1 .314-.97l1.086-.45a.5.5 0 0 1 .598.23l.58.55a.5.5 0 0 0 .122-.514l-1.704-2.95zM15.304 7l-2.07 3.592a.5.5 0 0 1-.494.287H11.19a.5.5 0 0 1-.494-.287l-2.07-3.592a.5.5 0 0 1 .12-.543l.58-.55a.5.5 0 0 1 .598-.23l1.086.45a.5.5 0 0 1 .314.97l-.184 1.01.356.35.483.451A.5.5 0 0 1 10 8h1v2l.447.276a.5.5 0 0 1 .223.052h.793a.5.5 0 0 1 .223-.052L13 10V8h1a.5.5 0 0 1 .414-.225l.483-.452.357-.35-.184-1.01a.5.5 0 0 1 .314-.97l1.086-.45a.5.5 0 0 1 .598.23l.58.55a.5.5 0 0 0 .121.543zM6.436 9.524l-2.07 3.592A.5.5 0 0 0 4.87 13h1.604a.5.5 0 0 0 .494-.287l2.07-3.592a.5.5 0 0 0-.12-.543l-.58-.55a.5.5 0 0 0-.598.23l-1.086.45a.5.5 0 0 0-.314.97l.184 1.01-.356.35-.483.451A.5.5 0 0 0 6 10h-1V8l-.447-.276a.5.5 0 0 0-.223-.052H3.337a.5.5 0 0 0-.223.052L3 8v2h1a.5.5 0 0 1 .414.225l.483.452.356.35-.184 1.01a.5.5 0 0 1 .314.97l1.086.45a.5.5 0 0 1 .598-.23l.58-.55a.5.5 0 0 0 .122.514z" />
              </svg>
            </span>
            Recyclable
          </>
        ) : (
          <>
            <span className="inline-flex h-5 w-5 items-center justify-center" aria-hidden>
              <svg
                className="h-4 w-4 text-red-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </span>
            Not Recyclable
          </>
        )}
      </div>
      {reason ? (
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">{reason}</p>
      ) : null}
    </div>
  );
}
