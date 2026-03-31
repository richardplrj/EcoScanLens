/**
 * Downscale and JPEG-encode before sending to OpenAI vision.
 * Fewer pixels ≈ fewer image tokens ≈ lower cost per scan.
 *
 * @param {string} dataUrl - data URL from FileReader
 * @param {number} [maxEdge=1280] - max width or height in px
 * @param {number} [quality=0.82] - JPEG quality 0..1
 * @returns {Promise<string>} jpeg data URL (or original on failure)
 */
export function compressImageForApi(dataUrl, maxEdge = 1280, quality = 0.82) {
  return new Promise((resolve) => {
    if (typeof document === "undefined") {
      resolve(dataUrl);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      if (width <= 0 || height <= 0) {
        resolve(dataUrl);
        return;
      }
      const scale = Math.min(1, maxEdge / Math.max(width, height));
      const w = Math.round(width * scale);
      const h = Math.round(height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      try {
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
