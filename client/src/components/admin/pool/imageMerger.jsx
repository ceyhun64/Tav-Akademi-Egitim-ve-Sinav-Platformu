export default function mergeImages({
  baseImageSrc,
  overlayImageSrc,
  overlayPosition,
  overlaySize,
  imageMetrics,
  callback,
}) {
  const { offsetX, offsetY, scaleX, scaleY } = imageMetrics;

  const baseImg = new Image();
  const overlayImg = new Image();
  baseImg.crossOrigin = "anonymous";
  overlayImg.crossOrigin = "anonymous";

  baseImg.onload = () => {
    overlayImg.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const canvasWidth = baseImg.naturalWidth;
      const canvasHeight = baseImg.naturalHeight;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      ctx.drawImage(baseImg, 0, 0);

      // Pozisyon ve boyutları orijinal çözünürlüğe dönüştür
      const drawX = (overlayPosition.x - offsetX) / scaleX;
      const drawY = (overlayPosition.y - offsetY) / scaleY;
      const drawWidth = overlaySize.width / scaleX;
      const drawHeight = overlaySize.height / scaleY;

      ctx.drawImage(
        overlayImg,
        0,
        0,
        overlayImg.naturalWidth,
        overlayImg.naturalHeight,
        drawX,
        drawY,
        drawWidth,
        drawHeight
      );

      const mergedDataUrl = canvas.toDataURL("image/png");
      callback(mergedDataUrl);
    };

    overlayImg.src = overlayImageSrc;
  };

  baseImg.src = baseImageSrc;
}
