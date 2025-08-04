import React, { useEffect, useRef, useState } from "react";
import "./ResultModal.css";


const MAX_WIDTH = 600;
const MAX_HEIGHT = 400;
const isPointInPolygon = (point, polygon) => {
  let x = point.x;
  let y = point.y;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x,
      yi = polygon[i].y;
    const xj = polygon[j].x,
      yj = polygon[j].y;

    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi + Number.EPSILON) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

const ResultModal = ({
  question,
  selectedAnswer,
  selectedCoordinate,
  imageSize,
  onClose,
  polygonArea,
  questionCats
}) => {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [inPolygon, setInPolygon] = useState(false);
  useEffect(() => {
    if (!question?.image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = question.image;

    img.onload = () => {
      const naturalWidth = img.width;
      const naturalHeight = img.height;

      const scaleX = Math.min(1, MAX_WIDTH / naturalWidth);
      const scaleY = Math.min(1, MAX_HEIGHT / naturalHeight);
      const scale = Math.min(scaleX, scaleY);

      const displayWidth = naturalWidth * scale;
      const displayHeight = naturalHeight * scale;

      canvas.width = displayWidth;
      canvas.height = displayHeight;

      setCanvasSize({ width: displayWidth, height: displayHeight });

      ctx.clearRect(0, 0, displayWidth, displayHeight);
      ctx.drawImage(img, 0, 0, displayWidth, displayHeight);

      // Çiz: doğru alan
      if (question.correctArea?.length === 4) {
        const [topLeft, topRight, bottomRight, bottomLeft] =
          question.correctArea;

        const rectX = topLeft.x * scale;
        const rectY = topLeft.y * scale;
        const rectWidth = (topRight.x - topLeft.x) * scale;
        const rectHeight = (bottomRight.y - topRight.y) * scale;

        ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2;
        ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
        ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
      }

      // Çiz: kullanıcı tıklaması
      // Çiz: kullanıcı tıklaması (normalize edilmiş koordinatlara uygun)
      if (selectedCoordinate) {
        const scaledX = selectedCoordinate.x * naturalWidth * scale;
        const scaledY = selectedCoordinate.y * naturalHeight * scale;

        ctx.beginPath();
        ctx.arc(scaledX, scaledY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();

        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      // Çiz: adminin tanımladığı polygon
      // Çiz: adminin tanımladığı polygon
      if (polygonArea && polygonArea.length >= 3) {
        ctx.beginPath();

        const firstPoint = polygonArea[0];
        ctx.moveTo(firstPoint.x * scale, firstPoint.y * scale);

        for (let i = 1; i < polygonArea.length; i++) {
          const point = polygonArea[i];
          ctx.lineTo(point.x * scale, point.y * scale);
        }

        ctx.closePath(); // poligonu kapat
        ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
      }

      // 🔍 Kullanıcının tıklama noktası polygon içindeyse kontrol et
      if (selectedCoordinate && polygonArea?.length >= 3) {
        const absolutePoint = {
          x: selectedCoordinate.x * naturalWidth,
          y: selectedCoordinate.y * naturalHeight,
        };
        const isInside = isPointInPolygon(absolutePoint, polygonArea);
        setInPolygon(isInside);
      }
    };
  }, [question?.image, selectedCoordinate]);
  const isAnswerCorrect =
    selectedAnswer?.toLowerCase() === question?.answer?.toLowerCase();

  if (!question) return null;
  let feedbackMessage = "";
  let feedbackStyle = "";

  if (inPolygon && isAnswerCorrect) {
    feedbackMessage = "✔️ Doğru!";
    feedbackStyle = "text-success";
  } else if (inPolygon && !isAnswerCorrect) {
    feedbackMessage = "🔍 İşaret doğru fakat seçenek yanlış!";
    feedbackStyle = "text-warning";
  } else if (!inPolygon && isAnswerCorrect) {
    feedbackMessage = "📍 Seçenek doğru fakat işaret yanlış!";
    feedbackStyle = "text-warning";
  } else {
    feedbackMessage = "❌ Hem işaret hem seçenek yanlış!";
    feedbackStyle = "text-danger";
  }

  return (
    <div
      className="overlay"
      onClick={onClose}
      style={{
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "700px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* Üst başlık */}
        <div className="modal-header">
          <h4 className={feedbackStyle}>{feedbackMessage}</h4>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        {/* İçerik kaydırılabilir */}
        <div
          className="modal-body"
          style={{
            overflowY: "auto",
            padding: "1rem",
          }}
        >
          <div className="text-center mb-3">
            <canvas
              ref={canvasRef}
              style={{
                borderRadius: "8px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                maxWidth: "100%",
              }}
            />
          </div>

          {/* Doğru & Seçilen seçenek */}
          <div className="d-flex justify-content-center gap-5 flex-wrap mb-4">
            <div className="text-center">
              <strong>✅ Doğru Seçenek:</strong>
              <div className="text-success fw-bold fs-5">
                {question.answer?.toUpperCase()}
              </div>
            </div>

            <div className="text-center">
              <strong>📝 Seçilen Seçenek:</strong>
              <div
                className={`fw-bold fs-5 ${
                  isAnswerCorrect ? "text-success" : "text-danger"
                }`}
              >
                {selectedAnswer?.toUpperCase() || "Seçilmedi"}
              </div>
            </div>
          </div>

          {question.correctArea && (
            <div className="text-center text-muted small">
              <strong>Doğru Alan:</strong>{" "}
              {question.correctArea.map((c) => `(${c.x}, ${c.y})`).join(", ")}
            </div>
          )}
        </div>

        {/* Alt buton sabit */}
        <div
          className="modal-footer"
          style={{
            borderTop: "1px solid #ddd",
            padding: "0.75rem",
            backgroundColor: "#f9f9f9",
          }}
        >
          <button className="btn btn-primary w-100" onClick={onClose}>
            Devam
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
