import React, { useEffect, useRef } from "react";

const filterMatrix = [
  [-1, -1, -1],
  [-1, 9, -1],
  [-1, -1, -1],
];

export default function EdgeEnhancementCanvas({ src, onCanvasLoad }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const imageElement = new Image();
    const hasCalledLoad = { current: false };

    imageElement.crossOrigin = "anonymous";
    imageElement.src = src;

    imageElement.onload = () => {
      const width = imageElement.naturalWidth;
      const height = imageElement.naturalHeight;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(imageElement, 0, 0);

      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;
      const resultPixels = new Uint8ClampedArray(pixels.length);

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          let rEdge = 0,
            gEdge = 0,
            bEdge = 0;

          for (let fy = -1; fy <= 1; fy++) {
            for (let fx = -1; fx <= 1; fx++) {
              const offset = ((y + fy) * width + (x + fx)) * 4;
              const weight = filterMatrix[fy + 1][fx + 1];

              rEdge += pixels[offset] * weight;
              gEdge += pixels[offset + 1] * weight;
              bEdge += pixels[offset + 2] * weight;
            }
          }

          const index = (y * width + x) * 4;
          resultPixels[index] = Math.min(
            Math.max(rEdge + pixels[index], 0),
            255
          );
          resultPixels[index + 1] = Math.min(
            Math.max(gEdge + pixels[index + 1], 0),
            255
          );
          resultPixels[index + 2] = Math.min(
            Math.max(bEdge + pixels[index + 2], 0),
            255
          );
          resultPixels[index + 3] = pixels[index + 3];
        }
      }

      imageData.data.set(resultPixels);
      ctx.putImageData(imageData, 0, 0);

      if (onCanvasLoad && !hasCalledLoad.current) {
        hasCalledLoad.current = true;
        onCanvasLoad({ width, height });
      }
    };
  }, [src, onCanvasLoad]);

  return (
    <canvas
      ref={canvasRef}
      style={{ maxWidth: "100%", height: "auto", display: "block" }}
    />
  );
}
