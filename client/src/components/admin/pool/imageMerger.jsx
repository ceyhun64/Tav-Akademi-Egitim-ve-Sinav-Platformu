function makeWhiteTransparent(image, tolerance = 250) {
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (r >= tolerance && g >= tolerance && b >= tolerance) {
      data[i + 3] = 0; // alpha kanalını 0 yap
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export default function mergeImages({
  baseImageSrc,
  overlayImageSrc,
  overlayPosition,
  overlaySize,
  imageMetrics,
  callback,
  whiteThreshold = 250, // 👈 eklenen parametre
}) {
  const { offsetX, offsetY, scaleX, scaleY } = imageMetrics;

  const baseImg = new Image();
  const overlayImg = new Image();
  baseImg.crossOrigin = "anonymous";
  overlayImg.crossOrigin = "anonymous";

  baseImg.onload = () => {
    overlayImg.onload = () => {
      // Beyaz arka planı transparan yap
      const transparentCanvas = makeWhiteTransparent(
        overlayImg,
        whiteThreshold
      );

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
        transparentCanvas,
        0,
        0,
        transparentCanvas.width,
        transparentCanvas.height,
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
