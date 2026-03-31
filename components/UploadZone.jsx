"use client";

import { useCallback, useRef, useState } from "react";
import Spinner from "@/components/Spinner";

const ACCEPT_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPT_ATTR =
  "image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp,.JPG,.JPEG,.PNG,.WEBP";
const MAX_BYTES = 5 * 1024 * 1024;

function validateFile(file) {
  if (!file) return "No file selected.";
  const byMime = ACCEPT_TYPES.includes(file.type);
  const byName = /\.(jpe?g|png|webp)$/i.test(file.name);
  if (!byMime && !byName) {
    return "Only JPG, PNG, or WEBP images are allowed.";
  }
  if (file.size > MAX_BYTES) {
    return "Image must be 5MB or smaller.";
  }
  return null;
}

/**
 * @param {object} props
 * @param {(dataUrl: string) => void | Promise<void>} props.onImageSelect
 * @param {boolean} [props.isAnalyzing]
 * @param {() => void} [props.onClear] - when user removes the preview (e.g. cancel in-flight request)
 */
export default function UploadZone({
  onImageSelect,
  isAnalyzing = false,
  onClear,
}) {
  const [dragDepth, setDragDepth] = useState(0);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [reading, setReading] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const readGenerationRef = useRef(0);

  const isDragging = dragDepth > 0;

  const processFile = useCallback(
    (file) => {
      setError("");
      const msg = validateFile(file);
      if (msg) {
        setError(msg);
        return;
      }

      setReading(true);
      const generation = ++readGenerationRef.current;
      const reader = new FileReader();
      reader.onload = () => {
        if (generation !== readGenerationRef.current) {
          setReading(false);
          return;
        }
        const result = reader.result;
        if (typeof result !== "string") {
          setReading(false);
          return;
        }
        setReading(false);
        setPreview(result);
        void Promise.resolve(onImageSelect?.(result));
      };
      reader.onerror = () => {
        setReading(false);
        if (generation !== readGenerationRef.current) return;
        setError("Could not read this image. Try another file.");
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const handleRemove = (e) => {
    e.stopPropagation();
    readGenerationRef.current += 1;
    setPreview(null);
    setReading(false);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    onClear?.();
  };

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragDepth(0);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const onDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragDepth((d) => d + 1);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragDepth((d) => Math.max(0, d - 1));
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const openPicker = () => {
    if (preview || reading) return;
    fileInputRef.current?.click();
  };

  const openCamera = () => {
    if (reading) return;
    cameraInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        role={preview ? "group" : "button"}
        tabIndex={preview ? -1 : 0}
        aria-label={
          preview
            ? "Uploaded image preview"
            : "Upload image: drag and drop or click to browse"
        }
        aria-busy={reading}
        onKeyDown={(e) => {
          if (preview || reading) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        onClick={() => {
          if (!reading) openPicker();
        }}
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        className={`group eco-upload-nudge relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 ease-out ${
          isDragging
            ? "scale-[1.01] border-emerald-500 bg-emerald-50/95 shadow-lg ring-2 ring-emerald-400/35"
            : "border-emerald-200/80 bg-gradient-to-br from-white via-emerald-50/50 to-teal-50/40 shadow-md ring-1 ring-emerald-100/70 hover:border-emerald-400/80 hover:shadow-lg"
        } ${!preview && !reading && !isDragging ? "animate-eco-upload-glow" : ""} ${!preview && !isAnalyzing && !reading ? "cursor-pointer" : "cursor-default"}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT_ATTR}
          className="sr-only"
          aria-hidden
          tabIndex={-1}
          onChange={onInputChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept={ACCEPT_ATTR}
          capture="environment"
          className="sr-only"
          aria-hidden
          tabIndex={-1}
          onChange={onInputChange}
        />

        {reading ? (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/75 backdrop-blur-[2px] transition-opacity duration-300"
            aria-live="polite"
          >
            <Spinner className="h-8 w-8 border-emerald-600" />
            <p className="text-sm font-medium text-emerald-900">Reading your image…</p>
          </div>
        ) : null}

        <div className="flex min-h-[240px] flex-col items-center justify-center gap-5 p-8 sm:min-h-[300px] sm:p-10">
          {preview ? (
            <div className="relative w-full max-w-md">
              {/* User data URLs - next/image not applicable */}
              {/* eslint-disable-next-line @next/next/no-img-element -- preview is dynamic base64 */}
              <img
                src={preview}
                alt="Selected item preview"
                className="mx-auto max-h-[280px] w-auto max-w-full rounded-lg object-contain shadow-sm"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="eco-micro-press eco-focus-soft absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-lg leading-none text-neutral-600 shadow-md transition hover:bg-red-50 hover:text-red-700"
                aria-label="Remove image"
              >
                ×
              </button>
              {isAnalyzing ? (
                <p className="animate-pulse-gentle mt-4 text-center text-sm font-medium text-emerald-800">
                  Analyzing…
                </p>
              ) : null}
            </div>
          ) : (
            <>
              <div
                className="eco-upload-emoji select-none text-4xl transition-transform duration-500 ease-out group-hover:scale-105 sm:text-5xl"
                aria-hidden
              >
                🌿♻️
              </div>
              <p className="text-center text-lg font-bold tracking-tight text-emerald-950 sm:text-xl">
                Drag &amp; drop an image here
              </p>
              <p className="max-w-md text-center text-sm leading-relaxed text-neutral-600 sm:text-base">
                or tap to browse · JPG, PNG, WEBP · max 5MB
              </p>
              <div className="flex justify-center pt-1 md:hidden">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openCamera();
                  }}
                  className="eco-micro-press eco-focus-soft min-h-11 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700"
                >
                  Take Photo
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {error ? (
        <p className="mt-3 text-center text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
