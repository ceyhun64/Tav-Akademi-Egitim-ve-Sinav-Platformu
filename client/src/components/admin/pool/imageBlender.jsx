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

      // Resimlerin yüklenme durumunu takip etmek için sayaç
      let imagesLoaded = 0;
      const totalImages = 2;

      const checkImagesLoaded = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
          // Her iki resim de yüklendiğinde harmanlama işlemini başlat
          performBlend();
        }
      };

      const performBlend = () => {
        const { offsetX, offsetY, scaleX, scaleY } = imageMetrics;

        // **KRİTİK KONTROL:** scaleX ve scaleY'nin sıfır veya NaN olmadığından emin olun
        if (scaleX === 0 || scaleY === 0 || isNaN(scaleX) || isNaN(scaleY)) {
          console.error(
            "Geçersiz ölçeklendirme değerleri (scaleX veya scaleY sıfır/NaN). Harmanlama yapılamadı."
          );
          if (typeof onBlendComplete === "function") {
            onBlendComplete(null); // Veya boş bir URL döndür
          }
          return;
        }

        // Hesaplanan çizim boyutlarını al
        let drawX = (overlayPosition.x - offsetX) / scaleX;
        let drawY = (overlayPosition.y - offsetY) / scaleY;
        let drawWidth = overlaySize.width / scaleX;
        let drawHeight = overlaySize.height / scaleY;

        // **KRİTİK KONTROL:** Çizim boyutlarının pozitif tamsayı olduğundan emin olun
        drawWidth = Math.max(1, Math.floor(drawWidth)); // Minimum 1 piksel
        drawHeight = Math.max(1, Math.floor(drawHeight)); // Minimum 1 piksel

        // Eğer overlay'in kaynak boyutları (naturalWidth/Height) sıfırsa hata ver
        if (!overlayImg.naturalWidth || !overlayImg.naturalHeight) {
          console.error("Overlay resmi yüklenemedi veya boyutları geçersiz.");
          if (typeof onBlendComplete === "function") {
            onBlendComplete(null);
          }
          return;
        }

        console.log(
          "ImageBlender: drawWidth",
          drawWidth,
          "drawHeight",
          drawHeight
        ); // Yeni log

        canvas.width = baseImg.naturalWidth;
        canvas.height = baseImg.naturalHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseImg, 0, 0);

        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d", { alpha: true });
        if (!tempCtx) {
          console.error("Temp canvas context alınamadı.");
          if (typeof onBlendComplete === "function") {
            onBlendComplete(null);
          }
          return;
        }

        tempCanvas.width = drawWidth;
        tempCanvas.height = drawHeight;

        // tempCtx'e overlay'ı çizerken de hedef boyutları kullan
        tempCtx.drawImage(
          overlayImg,
          0,
          0, // Kaynak X, Y (overlayImg'in tamamını kullan)
          overlayImg.naturalWidth,
          overlayImg.naturalHeight, // Kaynak Genişlik, Yükseklik
          0,
          0, // Hedef X, Y (tempCanvas'ın başına çiz)
          drawWidth,
          drawHeight // Hedef Genişlik, Yükseklik
        );

        // **HATA KAYNAĞI BURADAYDI:** getImageData'ya geçersiz değerler gitmesini engelle
        // drawWidth ve drawHeight'ın pozitif olduğundan emin olduk
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
          // const a1 = baseImageData.data[i + 3]; // Base image'in alfa değeri

          const r2 = overlayImageData.data[i];
          const g2 = overlayImageData.data[i + 1];
          const b2 = overlayImageData.data[i + 2];
          const a2 = overlayImageData.data[i + 3]; // Overlay'ın alfa değeri

          let r, g, b, a;

          switch (blendMode) {
            case "multiply":
              r = (r1 * r2) / 255;
              g = (g1 * g2) / 255;
              b = (b1 * b2) / 255;
              break;
            case "darken":
            case "darkerColor": // İki blend modu da aynı işlevi görüyor gibi
            case "mod5": // Mod5 de darken ile aynı görünüyor
              r = Math.min(r1, r2);
              g = Math.min(g1, g2);
              b = Math.min(b1, b2);
              break;
            case "mod4":
              r = (r1 * r2) / 270;
              g = (g1 * g2) / 270;
              b = (b1 * b2) / 270;
              break;
            default:
              r = r2;
              g = g2;
              b = b2;
              break;
          }

          a = a2; // Overlay'ın alfa değerini kullan

          result.data[i] = r;
          result.data[i + 1] = g;
          result.data[i + 2] = b;
          result.data[i + 3] = a;
        }

        ctx.putImageData(result, drawX, drawY);

        if (typeof onBlendComplete === "function") {
          onBlendComplete(canvas.toDataURL("image/png"));
        }
      };

      // Resimlerin yüklenme olaylarını dinle
      baseImg.onload = checkImagesLoaded;
      overlayImg.onload = checkImagesLoaded;

      // Hata durumlarını da yakalamak önemli
      baseImg.onerror = (e) => {
        console.error("Base image yüklenirken hata oluştu:", e);
        if (typeof onBlendComplete === "function") onBlendComplete(null);
      };
      overlayImg.onerror = (e) => {
        console.error("Overlay image yüklenirken hata oluştu:", e);
        if (typeof onBlendComplete === "function") onBlendComplete(null);
      };

      // Eğer resimler zaten yüklenmişse hemen harmanla
      if (baseImg.complete && overlayImg.complete) {
        performBlend();
      }
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
