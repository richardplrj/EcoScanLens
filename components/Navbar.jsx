"use client";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100/80 bg-white shadow-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center px-4 sm:px-6 lg:px-8">
        <div className="eco-nav-brand flex cursor-default items-center gap-2 text-lg font-bold tracking-tight text-emerald-950">
          <span className="select-none" aria-hidden="true">
            🌿♻️
          </span>
          <span>EcoScan</span>
        </div>
      </div>
    </header>
  );
}

