"use client";

import { useId, useMemo } from "react";

function binLabel(type) {
  switch (type) {
    case "dry":
      return "Dry waste";
    case "wet":
      return "Wet waste";
    case "e_waste":
      return "E-Waste";
    case "unknown":
      return "Recycle";
    default:
      return "Recycle";
  }
}

/** Short label printed on the bin body (white, high contrast). */
function binBodyPrint(type) {
  switch (type) {
    case "dry":
      return "Dry waste";
    case "wet":
      return "Wet waste";
    case "e_waste":
      return "E-Waste";
    case "unknown":
      return "Recycle";
    default:
      return "Recycle";
  }
}

/** Wheelie-bin style illustration (SVG) - reads more like a real bin than flat CSS blocks. */
function RealisticBinSvg({ type }) {
  const uid = useId().replace(/:/g, "");
  const bodyId = `rb-body-${uid}`;
  const lidId = `rb-lid-${uid}`;
  const shineId = `rb-shine-${uid}`;

  const lid =
    type === "dry"
      ? { a: "#4ade80", b: "#166534" }
      : type === "wet"
        ? { a: "#7dd3fc", b: "#0369a1" }
        : type === "e_waste"
          ? { a: "#c4b5fd", b: "#6d28d9" }
          : { a: "#d1d5db", b: "#4b5563" };

  return (
    <svg
      viewBox="0 0 100 154"
      className="pointer-events-none absolute inset-0 h-full w-full drop-shadow-[0_10px_18px_rgba(0,0,0,0.22)]"
      aria-hidden
    >
      <defs>
        <linearGradient id={bodyId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#71717a" />
          <stop offset="42%" stopColor="#3f3f46" />
          <stop offset="100%" stopColor="#18181b" />
        </linearGradient>
        <linearGradient id={lidId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={lid.a} />
          <stop offset="100%" stopColor={lid.b} />
        </linearGradient>
        <linearGradient id={shineId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="45%" stopColor="rgba(255,255,255,0.14)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <ellipse cx="50" cy="146" rx="34" ry="5.5" fill="rgba(0,0,0,0.26)" />
      <path
        d="M16 44 C16 40 19 38 23 38 H77 C81 38 84 40 84 44 L80 122 C80 126 77 128 73 128 H27 C23 128 20 126 20 122 Z"
        fill={`url(#${bodyId})`}
        stroke="#09090b"
        strokeWidth="0.9"
      />
      <rect
        x="14"
        y="38"
        width="72"
        height="7"
        rx="2"
        fill="#27272a"
        stroke="#09090b"
        strokeWidth="0.5"
      />
      <path
        d="M12 26 H88 C91 26 93 28 93 31 V37 C93 40 91 42 88 42 H12 C9 42 7 40 7 37 V31 C7 28 9 26 12 26 Z"
        fill={`url(#${lidId})`}
        stroke="#0f172a"
        strokeWidth="0.7"
      />
      <rect
        x="16"
        y="30"
        width="68"
        height="3.5"
        rx="1"
        fill="rgba(0,0,0,0.22)"
      />
      <path
        d="M30 52 V118"
        stroke={`url(#${shineId})`}
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.88"
      />
      <circle
        cx="34"
        cy="138"
        r="7"
        fill="#0a0a0a"
        stroke="#52525b"
        strokeWidth="1"
      />
      <circle
        cx="66"
        cy="138"
        r="7"
        fill="#0a0a0a"
        stroke="#52525b"
        strokeWidth="1"
      />
      <circle cx="34" cy="138" r="2.2" fill="#52525b" />
      <circle cx="66" cy="138" r="2.2" fill="#52525b" />
      {type === "e_waste" ? (
        <g transform="translate(50, 84)" opacity="0.45">
          <circle r="13" fill="none" stroke="#ddd6fe" strokeWidth="1.1" />
          <path
            d="M-2,-8 L1,-8 L0,0 L4,0 L-1,8 L0,2 L-4,2 Z"
            fill="none"
            stroke="#ede9fe"
            strokeWidth="1.05"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ) : null}
      {type === "unknown" ? (
        <g transform="translate(50, 84)" opacity="0.45">
          <circle r="13" fill="none" stroke="#dcfce7" strokeWidth="1.1" />
          <path
            d="M-1,-7 L6,3 L-1,3 M1,7 L-6,-1 L1,-1"
            fill="none"
            stroke="#bbf7d0"
            strokeWidth="1.05"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ) : null}
    </svg>
  );
}

function Bin({ type, index, imageUrl, target, animNonce }) {
  const showThumb = Boolean(imageUrl) && Boolean(target) && target === type;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative h-[138px] w-[86px] ${`eco-bin-float-delay-${index}`}`}
      >
        <RealisticBinSvg type={type} />
        {/* Centered on the main bin body (below the opening, above wheels) */}
        <div
          className="pointer-events-none absolute inset-x-[6%] top-[70%] bottom-[11%] z-[4] flex items-center justify-center px-0.5 text-center"
          aria-hidden
        >
          <span
            className="max-w-full text-balance text-[8px] font-extrabold leading-tight tracking-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.95),0_0_10px_rgba(0,0,0,0.5)] sm:text-[9px]"
          >
            {binBodyPrint(type)}
          </span>
        </div>
        <div
          className="absolute left-1/2 top-[29%] z-[5] h-[41%] w-[62%] max-w-[54px] -translate-x-1/2 overflow-hidden rounded-b-[10px] ring-1 ring-black/20"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.55))",
          }}
        >
          {showThumb ? (
            <div
              key={`thumb-${type}-${animNonce}`}
              className="eco-thumb-drop pointer-events-none absolute left-1/2 top-0"
              aria-hidden
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- user data URL */}
              <img
                src={imageUrl || ""}
                alt=""
                className="eco-thumb-img h-9 w-9 rounded-md border border-white/40 bg-white/15 object-contain shadow-md"
              />
            </div>
          ) : (
            <div
              className="pointer-events-none h-full w-full bg-gradient-to-b from-black/25 to-black/40"
              aria-hidden
            />
          )}
        </div>
      </div>

      <span className="mt-1.5 text-xs font-semibold text-neutral-800/90">
        {binLabel(type)}
      </span>
    </div>
  );
}

export default function DustbinSortAnimation({
  imageUrl,
  target = null,
  compact = false,
  classificationPending = false,
}) {
  const effectiveTarget = classificationPending ? null : target;

  const animNonce = useMemo(() => {
    if (!imageUrl) return "no-image";
    if (classificationPending) {
      return `pending-${imageUrl.length}-${imageUrl.slice(0, 24)}`;
    }
    return `sorted-${target}-${imageUrl.length}-${imageUrl.slice(0, 24)}`;
  }, [imageUrl, target, classificationPending]);

  return (
    <div className={`mx-auto ${compact ? "mt-0" : "mt-4 sm:mt-2"} px-2`}>
      {!compact ? (
        <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-emerald-800/70">
          Sort it right - dry, wet, e-waste, or recycle
        </p>
      ) : null}

      {classificationPending && imageUrl ? (
        <div className="mb-3 flex flex-col items-center gap-2">
          <div className="eco-sort-pending-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element -- user data URL */}
            <img
              src={imageUrl}
              alt=""
              className="h-10 w-10 rounded-lg border border-emerald-200/80 bg-white/80 object-contain shadow-md ring-2 ring-emerald-100/90 sm:h-11 sm:w-11"
            />
          </div>
          <p className="text-center text-[11px] font-medium text-emerald-800/80 sm:text-xs">
            Finding the right bin…
          </p>
        </div>
      ) : null}

      <div className="flex items-end justify-center gap-2 sm:gap-4 md:gap-6">
        <Bin
          type="dry"
          index={0}
          imageUrl={imageUrl}
          target={effectiveTarget}
          animNonce={animNonce}
        />
        <Bin
          type="wet"
          index={1}
          imageUrl={imageUrl}
          target={effectiveTarget}
          animNonce={animNonce}
        />
        <Bin
          type="e_waste"
          index={2}
          imageUrl={imageUrl}
          target={effectiveTarget}
          animNonce={animNonce}
        />
        <Bin
          type="unknown"
          index={3}
          imageUrl={imageUrl}
          target={effectiveTarget}
          animNonce={animNonce}
        />
      </div>
    </div>
  );
}
