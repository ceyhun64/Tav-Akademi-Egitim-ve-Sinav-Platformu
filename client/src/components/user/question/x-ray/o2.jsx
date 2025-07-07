import React, { useEffect, useRef } from "react";

export default function OrangeFilterCanvas({ src, onCanvasLoad }) {
  const canvasRef = useRef(null);
  const hasCalled = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const image = new Image();

    image.crossOrigin = "anonymous";
    image.src = src;

    image.onload = () => {
      const width = image.naturalWidth;
      const height = image.naturalHeight;

      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(image, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const sum = max + min;
        let h = 0,
          s = 0,
          l = sum / 510;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (510 - sum) : d / sum;

          if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
          else if (max === g) h = (b - r) / d + 2;
          else h = (r - g) / d + 4;

          h /= 6;
        }

        const isOrange =
          h >= 0.04 &&
          h <= 0.12 &&
          r > g * 0.7 &&
          g > b * 0.6 &&
          s > 0.3 &&
          l > 0.2;

        const isBlue = (h >= 0.55 && h <= 0.67) || (b > r && b > g && s > 0.2);

        if (isBlue) {
          pixels[i] = 255;
          pixels[i + 1] = 255;
          pixels[i + 2] = 255;
        } else if (isOrange) {
          pixels[i] = Math.min(255, r * 1.1);
          pixels[i + 1] = Math.min(255, g * 0.9);
          pixels[i + 2] = b * 0.4;
        } else {
          pixels[i] = 255;
          pixels[i + 1] = 255;
          pixels[i + 2] = 255;
        }

        pixels[i + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);

      if (onCanvasLoad && !hasCalled.current) {
        hasCalled.current = true;
        onCanvasLoad({ width, height });
      }
    };

    image.onerror = () => {
      console.error("OrangeFilterCanvas: Resim yüklenemedi", src);
    };
  }, [src, onCanvasLoad]);

  useEffect(() => {
    hasCalled.current = false;
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        maxWidth: "100%",
        height: "auto",
        display: "block",
        imageRendering: "crisp-edges",
      }}
    />
  );
}
