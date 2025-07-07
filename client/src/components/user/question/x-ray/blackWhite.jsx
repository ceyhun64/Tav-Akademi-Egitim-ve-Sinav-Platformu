import React, { useEffect, useRef } from "react";

export default function BlackWhiteCanvas({ src, onCanvasLoad }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const imageElement = new Image();

    let isMounted = true;

    imageElement.crossOrigin = "anonymous"; // CORS için önemli
    imageElement.src = src;

    imageElement.onload = () => {
      if (!isMounted) return;

      // Canvas boyutunu resmin doğal boyutuna eşitle
      canvas.width = imageElement.naturalWidth;
      canvas.height = imageElement.naturalHeight;

      // Resmi çiz
      ctx.drawImage(imageElement, 0, 0);

      // Piksel verisini al
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Ortalama gri tonu hesapla
        const gray = (r + g + b) / 3;

        // Negatif gri ton uygula (siyah-beyaz negatif)
        pixels[i] = 255 - gray;
        pixels[i + 1] = 255 - gray;
        pixels[i + 2] = 255 - gray;
        // Alpha aynı kalır
      }

      ctx.putImageData(imageData, 0, 0);

      // onCanvasLoad varsa canvas boyutlarını üst bileşene bildir
      if (onCanvasLoad) {
        onCanvasLoad({ width: canvas.width, height: canvas.height });
      }
    };

    imageElement.onerror = () => {
      if (!isMounted) return;
      console.error("Image loading failed for src:", src);
    };

    return () => {
      isMounted = false;
    };
  }, [src, onCanvasLoad]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        maxWidth: "100%",
        height: "auto",
        display: "block", // Görsel hizalaması için gerekli
      }}
    />
  );
}
