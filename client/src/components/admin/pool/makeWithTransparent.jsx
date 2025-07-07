export default function makeWhiteTransparent(imageSrc, tolerance = 250, callback) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = imageSrc;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      const isWhiteish = r >= tolerance && g >= tolerance && b >= tolerance;
      if (isWhiteish) {
        data[i + 3] = 0; // alpha kanalını 0 yap -> şeffaf
      }
    }

    ctx.putImageData(imageData, 0, 0);
    callback(canvas.toDataURL());
  };
}
