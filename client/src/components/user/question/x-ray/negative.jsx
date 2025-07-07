import React, { useEffect, useRef } from "react";

export default function NegativeCanvas({ src, onCanvasLoad }) {
  const canvasRef = useRef(null);
  const hasCalled = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const img = new Image();

    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      const width = img.naturalWidth;
      const height = img.naturalHeight;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]; // Red
        data[i + 1] = 255 - data[i + 1]; // Green
        data[i + 2] = 255 - data[i + 2]; // Blue
        // Alpha sabit kalıyor
      }

      ctx.putImageData(imageData, 0, 0);

      if (onCanvasLoad && !hasCalled.current) {
        hasCalled.current = true;
        onCanvasLoad({ width, height });
      }
    };

    img.onerror = () => {
      console.error("NegativeCanvas: Görsel yüklenemedi:", src);
    };
  }, [src, onCanvasLoad]);

  useEffect(() => {
    hasCalled.current = false; // src değişince tekrar tetiklenebilir
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        maxWidth: "100%",
        height: "auto",
        display: "block",
      }}
    />
  );
}
