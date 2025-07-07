import React, { useEffect, useRef } from "react";

const clamp = (val) => Math.min(255, Math.max(0, val));

export default function HighIntensityCanvas({ src, onCanvasLoad }) {
  const canvasRef = useRef(null);
  const calledOnLoad = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const img = new Image();
    let isMounted = true;

    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      if (!isMounted) return;

      const width = img.naturalWidth;
      const height = img.naturalHeight;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      if (typeof onCanvasLoad === "function" && !calledOnLoad.current) {
        calledOnLoad.current = true;
        onCanvasLoad({ width, height });
      }

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const sourceData = new Uint8ClampedArray(data);

      const sharpenKernel = [-1, -1, -1, -1, 9, -1, -1, -1, -1];
      const side = 3;
      const halfSide = Math.floor(side / 2);

      for (let y = halfSide; y < height - halfSide; y++) {
        for (let x = halfSide; x < width - halfSide; x++) {
          let r = 0,
            g = 0,
            b = 0;

          for (let ky = 0; ky < side; ky++) {
            for (let kx = 0; kx < side; kx++) {
              const posX = x + kx - halfSide;
              const posY = y + ky - halfSide;
              const idx = (posY * width + posX) * 4;
              const weight = sharpenKernel[ky * side + kx];

              r += sourceData[idx] * weight;
              g += sourceData[idx + 1] * weight;
              b += sourceData[idx + 2] * weight;
            }
          }

          const idx = (y * width + x) * 4;
          data[idx] = clamp(r);
          data[idx + 1] = clamp(g);
          data[idx + 2] = clamp(b);
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    img.onerror = () => {
      if (!isMounted) return;
      console.error("HighIntensityCanvas: Görsel yüklenemedi", src);
    };

    return () => {
      isMounted = false;
      calledOnLoad.current = false; // src değişince tekrar çağrılabilsin
    };
  }, [src, onCanvasLoad]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        maxWidth: "100%",
        height: "auto",
        display: "block",
        imageRendering: "pixelated",
      }}
    />
  );
}
