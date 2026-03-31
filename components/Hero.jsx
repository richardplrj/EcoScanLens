"use client";

export default function Hero() {
  return (
    <section
      className="animate-fade-in-up mx-auto max-w-3xl px-4 pb-6 pt-12 text-center sm:px-6 sm:pb-8 sm:pt-16 lg:pb-10 lg:pt-20"
      aria-labelledby="hero-heading"
    >
      <h1
        id="hero-heading"
        className="animate-eco-title-float text-balance text-3xl font-bold leading-tight tracking-tight text-emerald-950 sm:text-4xl lg:text-5xl"
      >
        Scan Your Waste, Save the Planet
      </h1>
      <p className="eco-animate-in eco-delay-1 mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-neutral-600 sm:text-lg">
        Upload a photo of any waste item to instantly classify it and discover
        smart ways to reuse it.
      </p>
    </section>
  );
}

