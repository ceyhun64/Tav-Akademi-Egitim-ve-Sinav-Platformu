// ImageBlender.js veya ilgili dosyanızda
import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const ImageBlender = forwardRef(
  (
    {
      baseImageSrc,
      overlayImageSrc,
      overlayPosition,
      overlaySize,
      imageMetrics,
      blendMode,
      onBlendComplete,
    },
    ref
  ) => {
    const canvasRef = useRef(null);

    useImperativeHandle(ref, () => ({
      getDataUrl: () => {
        return canvasRef.current?.toDataURL("image/png");
      },
    }));

    useEffect(() => {
      if (!baseImageSrc || !overlayImageSrc) return;

      const canvas = canvasRef.current;
      // BURASI DÜZELTİLDİ: alpha: true eklendi
      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) {
        console.error("Canvas context alınamadı.");
        return;
      }

      const baseImg = new Image();
      const overlayImg = new Image();
      baseImg.crossOrigin = "anonymous";
      overlayImg.crossOrigin = "anonymous";

      baseImg.src = baseImageSrc;
      overlayImg.src = overlayImageSrc;

      baseImg.onload = () => {
        overlayImg.onload = () => {
          const { offsetX, offsetY, scaleX, scaleY } = imageMetrics;

          canvas.width = baseImg.naturalWidth;
          canvas.height = baseImg.naturalHeight;

          // Canvas'ı her çizimden önce temizle (şeffaf arka planı korumak için)
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // 1. Arka planı çiz
          ctx.drawImage(baseImg, 0, 0);

          // 2. Overlay’i pozisyonlayarak çiz
          const drawX = (overlayPosition.x - offsetX) / scaleX;
          const drawY = (overlayPosition.y - offsetY) / scaleY;
          const drawWidth = overlaySize.width / scaleX;
          const drawHeight = overlaySize.height / scaleY;

          // 3. Blend efekti için önce overlay'i ayrı bir canvas’a çiz
          const tempCanvas = document.createElement("canvas");
          // BURASI DA DÜZELTİLDİ: tempCanvas'ın da şeffaf olması için alpha: true eklendi
          const tempCtx = tempCanvas.getContext("2d", { alpha: true });
          if (!tempCtx) {
            console.error("Temp canvas context alınamadı.");
            return;
          }
          tempCanvas.width = drawWidth;
          tempCanvas.height = drawHeight;

          tempCtx.drawImage(
            overlayImg,
            0,
            0,
            overlayImg.naturalWidth,
            overlayImg.naturalHeight,
            0,
            0,
            drawWidth,
            drawHeight
          );

          const baseImageData = ctx.getImageData(
            drawX,
            drawY,
            drawWidth,
            drawHeight
          );
          const overlayImageData = tempCtx.getImageData(
            0,
            0,
            drawWidth,
            drawHeight
          );
          const result = ctx.createImageData(drawWidth, drawHeight);

          for (let i = 0; i < baseImageData.data.length; i += 4) {
            const r1 = baseImageData.data[i];
            const g1 = baseImageData.data[i + 1];
            const b1 = baseImageData.data[i + 2];
            const a1 = baseImageData.data[i + 3]; // Base image'in alfa değeri de önemli

            const r2 = overlayImageData.data[i];
            const g2 = overlayImageData.data[i + 1];
            const b2 = overlayImageData.data[i + 2];
            const a2 = overlayImageData.data[i + 3]; // Overlay'ın alfa değeri

            let r, g, b, a;

            // Blend moduna göre renkleri hesapla
            switch (blendMode) {
              case "multiply":
                r = (r1 * r2) / 255;
                g = (g1 * g2) / 255;
                b = (b1 * b2) / 255;
                break;
              case "darken":
                r = Math.min(r1, r2);
                g = Math.min(g1, g2);
                b = Math.min(b1, b2);
                break;
              // Diğer blend modlarını buraya ekleyebilirsiniz
              case "darkerColor":
                // Her kanal için daha koyu olanı seç
                r = Math.min(r1, r2);
                g = Math.min(g1, g2);
                b = Math.min(b1, b2);
                break;
              case "mod4":
                // Örnek bir mod: renkleri 4'e böl
                r = r1 % 4;
                g = g1 % 4;
                b = b1 % 4;
                break;
              case "mod5":
                // Örnek bir mod: renkleri 5'e böl
                r = r1 % 5;
                g = g1 % 5;
                b = b1 % 5;
                break;
              default:
                // Varsayılan olarak overlay'ı doğrudan kullan (şeffaflığı ile)
                r = r2;
                g = g2;
                b = b2;
                break;
            }

            // Alfa değeri için: Eğer overlay pikseli şeffafsa, base image'in alfa değerini koru.
            // Aksi takdirde, overlay'ın alfa değerini kullan.
            // Veya daha basit bir yaklaşımla, overlay'ın alfa değerini direkt kullanabiliriz,
            // çünkü processOverlayImage zaten beyazı şeffaf yapmış olmalı.
            a = a2; // Overlay'ın alfa değerini kullan

            result.data[i] = r;
            result.data[i + 1] = g;
            result.data[i + 2] = b;
            result.data[i + 3] = a; // Hesaplanan alfa değerini ata
          }

          ctx.putImageData(result, drawX, drawY);

          // Blend işlemi tamamlandıktan sonra callback çağrılıyor
          if (typeof onBlendComplete === "function") {
            onBlendComplete(canvas.toDataURL("image/png"));
          }
        };
      };
    }, [
      baseImageSrc,
      overlayImageSrc,
      overlayPosition,
      overlaySize,
      imageMetrics,
      blendMode,
      onBlendComplete,
    ]);

    return <canvas ref={canvasRef} style={{ display: "none" }} />;
  }
);

export default ImageBlender;
