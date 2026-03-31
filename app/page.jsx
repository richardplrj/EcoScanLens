"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import DecompositionBar from "@/components/DecompositionBar";
import ErrorCard from "@/components/ErrorCard";
import FunFact from "@/components/FunFact";
import RealityCheck from "@/components/RealityCheck";
import HowItWorks from "@/components/HowItWorks";
import LoadingState from "@/components/LoadingState";
import NonWasteCard from "@/components/NonWasteCard";
import Spinner from "@/components/Spinner";
import UpcyclingIdeas from "@/components/UpcyclingIdeas";
import Navbar from "@/components/Navbar";
import ResultCard from "@/components/ResultCard";
import UploadZone from "@/components/UploadZone";
import DustbinSortAnimation from "@/components/DustbinSortAnimation";
import {
  friendlyApiError,
  NETWORK_ERROR_MESSAGE,
  TIMEOUT_ERROR_MESSAGE,
} from "@/lib/friendlyErrors";
import { compressImageForApi } from "@/lib/compressImageForApi";
import { getRealityCheckFromGptResult } from "@/lib/realityCheck";

const FETCH_TIMEOUT_MS = 90_000;

export default function Home() {
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [resetPending, setResetPending] = useState(false);

  const requestIdRef = useRef(0);
  const abortRef = useRef(null);

  const scrollToTopSmooth = useCallback(() => {
    if (typeof window === "undefined") return;
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, []);

  const handleResetToUpload = useCallback(() => {
    setResetPending(true);
    requestAnimationFrame(() => {
      abortRef.current?.abort();
      abortRef.current = null;
      requestIdRef.current += 1;

      setLoading(false);
      setImagePreview("");
      setResult(null);
      setError(null);
      scrollToTopSmooth();
      window.setTimeout(() => setResetPending(false), 420);
    });
  }, [scrollToTopSmooth]);

  const handleClear = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    requestIdRef.current += 1;

    setLoading(false);
    setImagePreview("");
    setResult(null);
    setError(null);
  }, []);

  const handleImageSelect = useCallback(async (dataUrl) => {
    abortRef.current?.abort();
    const userAc = new AbortController();
    abortRef.current = userAc;
    const myId = ++requestIdRef.current;

    const timedOutRef = { current: false };
    let cleanupTimer = () => {};

    let signal = userAc.signal;
    if (
      typeof AbortSignal !== "undefined" &&
      typeof AbortSignal.any === "function"
    ) {
      const timerAc = new AbortController();
      const tid = window.setTimeout(() => {
        timedOutRef.current = true;
        timerAc.abort();
      }, FETCH_TIMEOUT_MS);
      cleanupTimer = () => window.clearTimeout(tid);
      signal = AbortSignal.any([userAc.signal, timerAc.signal]);
    }

    setImagePreview(dataUrl);
    setResult(null);
    setError(null);
    setLoading(true);

    try {
      const imageForApi = await compressImageForApi(dataUrl);
      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageForApi }),
        signal,
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (myId !== requestIdRef.current) return;

      if (!res.ok) {
        setError(friendlyApiError(res, data));
        setLoading(false);
        return;
      }

      setResult(data);
      setError(null);
    } catch (e) {
      if (e?.name === "AbortError") {
        if (myId !== requestIdRef.current) return;
        if (userAc.signal.aborted) return;
        if (timedOutRef.current) {
          setError(TIMEOUT_ERROR_MESSAGE);
          setLoading(false);
          return;
        }
        return;
      }
      if (myId !== requestIdRef.current) return;
      setError(NETWORK_ERROR_MESSAGE);
    } finally {
      cleanupTimer();
      if (myId === requestIdRef.current) {
        setLoading(false);
        abortRef.current = null;
      }
    }
  }, []);

  const showUpload = !loading && !result && !error;
  const showError = !loading && Boolean(error);
  const showNonWaste =
    !loading && !error && result && result.is_waste === false;
  const showWasteResults =
    !loading && !error && result && result.is_waste !== false;

  const dustbinTarget = useMemo(() => {
    if (!result || result.is_waste === false) return null;

    if (String(result.material_key ?? "") === "E_Waste") return "e_waste";

    // Use the same mapping engine as Reality Check as a strong fallback.
    const mapped = getRealityCheckFromGptResult(result);
    if (mapped?.material === "E_Waste") return "e_waste";

    const eWasteBlob = [
      result.item_name,
      result.material_type,
      result.recyclability_reason,
      result.disposal_guidance,
    ]
      .map((v) => String(v ?? "").toLowerCase())
      .join(" ");

    const isEWaste =
      /\b(e-?waste|electronic|electronics|battery|cell\b|phone|iphone|mobile|smartphone|laptop|charger|adapter|circuit|pcb|earphone|headphone|tablet|power bank|keyboard|mouse)\b/.test(
        eWasteBlob
      );
    if (isEWaste) return "e_waste";

    const classification = String(result.classification ?? "").toLowerCase();
    if (classification === "dry") return "dry";
    if (classification === "wet") return "wet";
    return "unknown";
  }, [result]);

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-[#fafdfb]">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />

        <div className="flex flex-1 flex-col">
          <div className="eco-state-panel flex flex-1 flex-col">
            {loading ? (
              <>
                <LoadingState imagePreview={imagePreview} />
                <div className="mx-auto w-full max-w-3xl px-4 pb-2 sm:px-6">
                  <DustbinSortAnimation
                    imageUrl={imagePreview || null}
                    target={null}
                    classificationPending
                    compact
                  />
                </div>
              </>
            ) : null}

            {showError ? (
              <ErrorCard
                message={error}
                onTryAgain={handleResetToUpload}
                isPending={resetPending}
              />
            ) : null}

            {showUpload ? (
              <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-start gap-4 px-4 pb-10 sm:px-6 sm:pb-12">
                <UploadZone
                  onImageSelect={handleImageSelect}
                  onClear={handleClear}
                />
                <DustbinSortAnimation
                  imageUrl={imagePreview || null}
                  target={null}
                  compact
                />
              </div>
            ) : null}

            {showNonWaste ? (
              <NonWasteCard
                message={result?.not_waste_message}
                onTryAgain={handleResetToUpload}
                isPending={resetPending}
              />
            ) : null}

            {showWasteResults ? (
              <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-14 sm:px-6 sm:pb-16">
                <ResultCard
                  result={result}
                  imagePreview={imagePreview}
                  scanAgain={
                    <button
                      type="button"
                      disabled={resetPending}
                      title="Upload a new photo to scan"
                      onClick={() => {
                        if (!resetPending) handleResetToUpload();
                      }}
                      className="eco-micro-press eco-focus-soft inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-1.5 text-xs font-semibold tracking-tight text-white shadow-md ring-1 ring-emerald-500/40 transition hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-65 sm:px-4 sm:py-2 sm:text-sm"
                    >
                      {resetPending ? (
                        <Spinner className="h-3.5 w-3.5 shrink-0 border-white" />
                      ) : (
                        <span
                          className="text-sm leading-none opacity-95"
                          aria-hidden
                        >
                          ↻
                        </span>
                      )}
                      <span>
                        {resetPending ? "Wait" : "Scan another item"}
                      </span>
                    </button>
                  }
                  recycleSlot={
                    imagePreview ? (
                      <DustbinSortAnimation
                        imageUrl={imagePreview}
                        target={dustbinTarget}
                        compact
                      />
                    ) : null
                  }
                />
                {result?.decomposition_time ? (
                  <DecompositionBar
                    decompositionTime={result.decomposition_time}
                  />
                ) : null}
                <UpcyclingIdeas ideas={result?.upcycling_ideas} />
                <FunFact fact={result?.fun_fact} />
                <RealityCheck result={result} />
              </div>
            ) : null}
          </div>

          <div className="mx-auto mt-2 w-full max-w-5xl flex-none px-4 pb-10 sm:px-6">
            <HowItWorks />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
