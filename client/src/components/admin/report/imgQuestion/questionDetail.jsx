import React, { useEffect, useRef, useState } from "react";

export default function QuestionDetailCard({ question, currentIndex }) {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const pool = question.poolImg || {};
  const correctAnswer = question.answer?.toLowerCase();
  const options = ["a", "b", "c", "d", "e", "f"].filter((opt) => pool[opt]);
  const imageSrc = pool.image;

  const userClick =
    typeof question.coordinate === "string" && question.coordinate.length > 0
      ? JSON.parse(question.coordinate)
      : null;

  const polygons = pool.coordinate || [];

  const MAX_WIDTH = 600;
  const MAX_HEIGHT = 400;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) return;

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
      const naturalWidth = img.width;
      const naturalHeight = img.height;

      canvas.width = naturalWidth;
      canvas.height = naturalHeight;

      setCanvasSize({ width: naturalWidth, height: naturalHeight });

      const scaleX = Math.min(1, MAX_WIDTH / naturalWidth);
      const scaleY = Math.min(1, MAX_HEIGHT / naturalHeight);
      const scale = Math.min(scaleX, scaleY);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      polygons.forEach((polygon) => {
        if (!polygon || polygon.length < 2) return;

        ctx.beginPath();
        ctx.moveTo(polygon[0].x, polygon[0].y);
        polygon.forEach((point) => ctx.lineTo(point.x, point.y));
        ctx.closePath();

        ctx.fillStyle = "rgba(0, 27, 102, 0.1)";
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = "#001b66";
        ctx.stroke();

        polygon.forEach((point) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "#001b66";
          ctx.fill();

          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      });

      if (userClick?.x !== undefined && userClick?.y !== undefined) {
        ctx.beginPath();
        ctx.arc(userClick.x, userClick.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
        ctx.fill();

        ctx.strokeStyle = "#001b66";
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    };

    img.onerror = () => {
      console.error("Image yüklenemedi:", imageSrc);
    };
  }, [imageSrc, polygons, userClick]);

  const getDisplaySize = () => {
    const { width, height } = canvasSize;
    if (!width || !height) return { width: 0, height: 0 };

    const scaleX = Math.min(1, MAX_WIDTH / width);
    const scaleY = Math.min(1, MAX_HEIGHT / height);
    const scale = Math.min(scaleX, scaleY);

    return { width: width * scale, height: height * scale };
  };

  const displaySize = getDisplaySize();

  return (
    <div className="card mb-4 shadow border-0">
      <div
        className="card-header d-flex justify-content-between align-items-center"
        style={{ backgroundColor: "#001b66", color: "white" }}
      >
        <strong>Soru {currentIndex + 1}</strong>
        <span className="badge bg-light text-dark">
          Kategori: {pool?.questionCategory?.name || "Yok"}
        </span>
      </div>

      <div className="card-body">
        <h5 className="text-dark mb-4" style={{ fontWeight: "600" }}>
          {pool?.question}
        </h5>

        {imageSrc && (
          <div className="text-center mb-4">
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              style={{
                borderRadius: "8px",
                display: "block",
                margin: "0 auto",
                width: `${displaySize.width}px`,
                height: `${displaySize.height}px`,
                boxShadow: "0 0 10px rgba(0, 27, 102, 0.2)",
              }}
            />
          </div>
        )}

        <ul className="list-group mb-4">
          {options.map((opt) => {
            const isCorrect = correctAnswer === opt;
            const isUserSelected =
              question.selected_answer?.toLowerCase() === opt;

            let bgColor = "";
            let borderColor = "";
            let textColor = "#001b66";

            if (isCorrect) {
              bgColor = "rgba(0, 27, 102, 0.15)";
              borderColor = "#001b66";
              textColor = "#001b66";
            } else if (isUserSelected && !isCorrect) {
              bgColor = "rgba(220, 53, 69, 0.15)"; // Bootstrap danger-light
              borderColor = "#dc3545";
              textColor = "#dc3545";
            }

            return (
              <li
                key={opt}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{
                  backgroundColor: bgColor,
                  border: `1.5px solid ${borderColor || "#dee2e6"}`,
                  borderRadius: "6px",
                  color: textColor,
                  fontWeight: isCorrect ? "600" : "500",
                  cursor: "default",
                  transition: "background-color 0.3s ease",
                }}
              >
                <span style={{ userSelect: "none" }}>
                  <strong style={{ textTransform: "uppercase" }}>{opt}:</strong>{" "}
                  {pool[opt]}
                </span>

                <div style={{ minWidth: 100, textAlign: "right" }}>
                  {isUserSelected && !isCorrect && (
                    <span
                      className="badge"
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        fontWeight: "600",
                        padding: "0.25em 0.6em",
                        borderRadius: "0.375rem",
                        userSelect: "none",
                      }}
                    >
                      Seçildi
                    </span>
                  )}
                  {isCorrect && (
                    <span
                      className="badge"
                      style={{
                        backgroundColor: "#001b66",
                        color: "white",
                        fontWeight: "600",
                        padding: "0.25em 0.6em",
                        borderRadius: "0.375rem",
                        userSelect: "none",
                      }}
                    >
                      Doğru Cevap
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div
          className="text-center fs-5 fw-bold"
          style={{ color: question.is_correct ? "#001b66" : "#dc3545" }}
        >
          {question.is_correct ? (
            <>
              <i className="bi bi-check-circle-fill me-2"></i>
              Doğru
            </>
          ) : (
            <>
              <i className="bi bi-x-circle-fill me-2"></i>
              Yanlış
            </>
          )}
        </div>
      </div>
    </div>
  );
}
