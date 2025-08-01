import React, { useEffect, useRef, useState } from "react";

export default function QuestionDetailCard({
  question,
  currentIndex,
  isMobile,
}) {
  const canvasRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const pool = question.poolTeo || {};
  const correctAnswer = question.answer?.toLowerCase();
  const options = ["a", "b", "c", "d", "e", "f"].filter((opt) => pool[opt]);
  const imageSrc = pool.image;
  const MAX_WIDTH = isMobile ? 300 : 600;
  const MAX_HEIGHT = isMobile ? 200 : 400;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) return;

    const ctx = canvas.getContext("2d");
    const img = new Image();

    //  img.crossOrigin = "anonymous";

    img.src = imageSrc;

    img.onload = () => {
      if (img.width === 0 || img.height === 0) {
        console.warn("Yüklenen resim boyutu geçersiz:", imageSrc);
        return;
      }

      const scaleX = Math.min(1, MAX_WIDTH / img.width);
      const scaleY = Math.min(1, MAX_HEIGHT / img.height);
      const scale = Math.min(scaleX, scaleY);

      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      setCanvasSize({ width: scaledWidth, height: scaledHeight });

      ctx.clearRect(0, 0, scaledWidth, scaledHeight);
      ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
    };

    img.onerror = (err) => {
      console.error("Resim yüklenemedi:", imageSrc, err);
    };
  }, [imageSrc]);

  return (
    <div className="card mb-4 shadow border-0">
      <div
        className="card-header d-flex justify-content-between align-items-center"
        style={{ backgroundColor: "#001b66", color: "white" }}
      >
        <strong>Soru {currentIndex + 1}</strong>
      </div>

      <div className="card-body">
        {/* Soru Metni */}
        <h5
          className="text-dark mb-4"
          style={{
            fontWeight: "600",
            fontSize: isMobile ? "1rem" : "1.25rem",
          }}
          dangerouslySetInnerHTML={{
            __html: pool?.question || "Soru metni bulunamadı",
          }}
        />

        {/* Resim */}
        {imageSrc && (
          <div className="text-center mb-4">
            <img
              src={imageSrc}
              alt="Soru görseli"
              style={{
                maxWidth: "100%",
                maxHeight: isMobile ? 200 : 400,
                borderRadius: "8px",
                boxShadow: "0 0 10px rgba(0, 27, 102, 0.2)",
              }}
            />
          </div>
        )}

        {/* Şıklar */}
        <ul className="list-group mb-4">
          {options.map((opt) => {
            const isCorrect = correctAnswer === opt;
            const isUserSelected = question.answer?.toLowerCase() === opt;

            let bgColor = "";
            let borderColor = "";
            let textColor = "#001b66";

            if (isCorrect) {
              bgColor = "rgba(0, 27, 102, 0.15)";
              borderColor = "#001b66";
            } else if (isUserSelected) {
              bgColor = "rgba(220, 53, 69, 0.15)";
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
                    <span className="badge bg-danger text-white fw-semibold">
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

        {/* Sonuç */}
        <div
          className="text-center fs-5 fw-bold"
          style={{ color: question.is_correct ? "#001b66" : "#dc3545" }}
        >
          {question.is_correct ? (
            <>
              <i className="bi bi-check-circle-fill me-2"></i>Doğru
            </>
          ) : (
            <>
              <i className="bi bi-x-circle-fill me-2"></i>Yanlış
            </>
          )}
        </div>
      </div>
    </div>
  );
}
