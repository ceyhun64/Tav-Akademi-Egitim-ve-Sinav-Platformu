import React, { useEffect, useRef } from "react";

export default function TransparencyCanvas({
  src,
  alphaPercentage = 50,
  onCanvasLoad,
}) {
  const canvasRef = useRef(null);

  const hasCalledLoad = useRef(false);

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

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      const alphaValue = Math.floor((alphaPercentage / 100) * 255);
      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;

      for (let i = 3; i < pixels.length; i += 4) {
        pixels[i] = alphaValue;
      }

      ctx.putImageData(imageData, 0, 0);

      if (onCanvasLoad && !hasCalledLoad.current) {
        hasCalledLoad.current = true;
        onCanvasLoad({ width, height });
      }
    };

    img.onerror = () => {
      console.error("Image yüklenirken hata oluştu:", src);
    };
  }, [src, alphaPercentage, onCanvasLoad]);

  return (
    <canvas
      ref={canvasRef}
      style={{ maxWidth: "100%", height: "auto", display: "block" }}
    />
  );
}
