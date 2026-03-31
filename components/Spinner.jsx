"use client";

export default function Spinner({
  className = "h-5 w-5 border-emerald-700",
}) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-t-transparent ${className}`}
      role="status"
      aria-hidden
    />
  );
}
