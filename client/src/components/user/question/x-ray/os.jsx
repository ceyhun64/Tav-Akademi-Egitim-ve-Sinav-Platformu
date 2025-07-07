import React, { useEffect, useRef } from "react";

export default function BlueFilterCanvas({ src, onCanvasLoad }) {
  const canvasRef = useRef(null);
  const hasCalled = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const imageElement = new Image();

    imageElement.crossOrigin = "anonymous";
    imageElement.src = src;

    imageElement.onload = () => {
      const width = imageElement.naturalWidth;
      const height = imageElement.naturalHeight;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(imageElement, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        if (r > 150 || g > 140) {
          pixels[i] = 255;
          pixels[i + 1] = 255;
          pixels[i + 2] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      if (onCanvasLoad && !hasCalled.current) {
        hasCalled.current = true;
        onCanvasLoad({ width, height });
      }
    };

    imageElement.onerror = () => {
      console.error("BlueFilterCanvas: Resim yüklenemedi", src);
    };
  }, [src, onCanvasLoad]);

  useEffect(() => {
    hasCalled.current = false;
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      style={{ maxWidth: "100%", height: "auto", display: "block" }}
    />
  );
}
