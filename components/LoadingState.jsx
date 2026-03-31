"use client";

export default function LoadingState({ imagePreview }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-14 sm:px-6">
      <div className="eco-animate-in mt-2 rounded-3xl border border-emerald-100/90 bg-white/90 p-6 shadow-md ring-1 ring-emerald-100/50 sm:p-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          {imagePreview ? (
            <div className="eco-loading-preview w-full max-w-[280px]">
              {/* eslint-disable-next-line @next/next/no-img-element -- preview is dynamic base64 */}
              <img
                src={imagePreview}
                alt="Uploaded item preview"
                className="mx-auto h-auto w-full max-h-[280px] rounded-xl object-contain shadow-sm"
              />
            </div>
          ) : null}

          <div className="flex flex-col items-center gap-3">
            <div
              className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700"
              aria-hidden="true"
            />
            <p className="text-sm font-semibold text-emerald-950 sm:text-base">
              Analyzing your waste...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
