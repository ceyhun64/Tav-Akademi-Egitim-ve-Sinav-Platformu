import React, { useRef, useEffect } from "react";

export default function MultiFilterCanvas({
  src,
  filters = [],
  alphaPercentage = 50,
  onCanvasLoad,
}) {
  const canvasRef = useRef();

  useEffect(() => {
    if (!src) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();

    let cancelled = false;

    image.crossOrigin = "anonymous";
    image.src = src;

    image.onload = () => {
      if (cancelled) return;

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      ctx.drawImage(image, 0, 0);

      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      filters.forEach((filter) => {
        if (filter === "negative") {
          for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = 255 - imageData.data[i]; // R
            imageData.data[i + 1] = 255 - imageData.data[i + 1]; // G
            imageData.data[i + 2] = 255 - imageData.data[i + 2]; // B
          }
        } else if (filter === "blackwhite") {
          for (let i = 0; i < imageData.data.length; i += 4) {
            const avg =
              (imageData.data[i] +
                imageData.data[i + 1] +
                imageData.data[i + 2]) /
              3;
            imageData.data[i] = avg;
            imageData.data[i + 1] = avg;
            imageData.data[i + 2] = avg;
          }
        } else if (filter === "transparency") {
          for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i + 3] = (alphaPercentage / 100) * 255;
          }
        }
        // Diğer filtreler buraya eklenebilir
      });

      ctx.putImageData(imageData, 0, 0);

      if (onCanvasLoad) {
        onCanvasLoad({ width: canvas.width, height: canvas.height });
      }
    };

    image.onerror = () => {
      console.error("MultiFilterCanvas: Görsel yüklenemedi:", src);
    };

    return () => {
      cancelled = true;
    };
  }, [src, filters, alphaPercentage, onCanvasLoad]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        display: "block",
        height: "auto",
      }}
    />
  );
}
