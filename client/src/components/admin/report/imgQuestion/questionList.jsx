export default function QuestionList({
  data,
  currentIndex,
  setCurrentIndex,
  isMobile,
}) {
  if (isMobile) return null;

  return (
    <div className="card shadow border-0 rounded-3 overflow-hidden">
      <div
        className="card-header text-white text-center fw-semibold"
        style={{
          backgroundColor: "#001b66",
          fontSize: "1.1rem",
          padding: "0.75rem",
        }}
      >
        🗂 Soru Listesi
      </div>

      <div
        className="card-body px-3 py-2 bg-light"
        style={{ maxHeight: "500px", overflowY: "auto" }}
      >
        <div className="d-grid gap-2">
          {data.map((item, i) => {
            const isActive = i === currentIndex;
            const isCorrect = item.is_correct;

            let background = isActive ? "#4665bba0" : "#ffffff";
            let borderColor = isActive ? "#001b66" : "#ced4da";
            let textColor = isActive
              ? "#ffffff"
              : isCorrect
              ? "#198754"
              : "#dc3545";

            return (
              <button
                key={i}
                className="btn text-start fw-semibold px-3 py-2 border rounded-2 d-flex align-items-center gap-2"
                style={{
                  backgroundColor: background,
                  border: `1.5px solid ${borderColor}`,
                  color: textColor,
                  transition: "all 0.2s ease-in-out",
                  fontSize: "0.95rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                onClick={() => setCurrentIndex(i)}
                title={`Soru ${i + 1} ${isCorrect ? "- Doğru" : "- Yanlış"}`}
              >
                <span
                  className="fw-bold"
                  style={{
                    minWidth: "2rem",
                    color: isActive ? "#fff" : textColor,
                  }}
                >
                  #{i + 1}
                </span>
                <span
                  className="flex-grow-1"
                  style={{ overflow: "hidden" }}
                  dangerouslySetInnerHTML={{
                    __html: item.poolImg?.question || "Soru Metni Yok",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
