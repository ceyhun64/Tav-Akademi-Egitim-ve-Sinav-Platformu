export default function QuestionList({ data, currentIndex, setCurrentIndex }) {
  return (
    <div className="card shadow border-0">
      <div
        className="card-header text-white text-center fw-semibold"
        style={{ backgroundColor: "#001b66" }}
      >
        🗂 Soru Listesi
      </div>

      <div
        className="card-body px-3 py-2"
        style={{ maxHeight: "500px", overflowY: "auto" }}
      >
        <div className="d-grid gap-2">
          {data.map((item, i) => {
            const isActive = i === currentIndex;
            const isCorrect = item.is_correct;

            let btnClass =
              "btn btn-sm text-start text-truncate fw-medium shadow-sm";

            if (isActive) {
              btnClass += " text-white";
            }

            let style = {
              backgroundColor: isActive ? "#001b66" : "#f8f9fa",
              border: isActive ? "2px solid #001b66" : "1px solid #dee2e6",
              color: isActive ? "#fff" : isCorrect ? "#198754" : "#dc3545",
              transition: "all 0.2s ease-in-out",
              fontSize: "0.9rem",
            };

            return (
              <button
                key={i}
                className={btnClass}
                style={style}
                onClick={() => setCurrentIndex(i)}
                title={`Soru ${i + 1} ${isCorrect ? "- Doğru" : "- Yanlış"}`}
              >
                <span className="me-2 fw-bold">#{i + 1}</span>
                {item.poolTeo?.question || "Soru Metni Yok"}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
