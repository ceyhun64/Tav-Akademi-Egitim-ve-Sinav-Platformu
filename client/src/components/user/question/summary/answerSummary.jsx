export default function AnswerSummary({
  answers,
  total,
  onSelectQuestion,
  currentIndex,
}) {
  return (
    <div
      className="answer-summary-card half-width"
      style={{
        borderRadius: "12px",
        padding: "2px",
        backgroundColor: "#f5f7fa",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        maxWidth: "100%", // Genişlik sınırı
        width: "100%", // Duyarlı yapı
        maxHeight: "300px", // Sabit yükseklik (istediğin gibi ayarla)
        overflowY: "auto", // Taşarsa dikey scroll göster
      }}
    >
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {Array.from({ length: total }, (_, idx) => {
          const questionNumber = idx + 1;
          const rawAnswer = answers[idx];
          const answer = rawAnswer ? rawAnswer.toUpperCase() : "Boş";
          const isActive = idx === currentIndex;

          return (
            <li
              key={idx}
              onClick={() => onSelectQuestion?.(idx)}
              style={{
                cursor: "pointer",
                padding: "10px 12px",
                borderRadius: "8px",
                marginBottom: "8px",
                color: rawAnswer ? "#001b66" : "#6c757d",
                backgroundColor: isActive ? "#dce3f5" : "#ffffff",
                transition: "all 0.2s ease",
                fontWeight: 500,
                boxShadow: isActive
                  ? "inset 4px 0 0 #001b66, 0 0 0 1px #c0c6d3"
                  : "0 0 0 1px #dee2e6",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isActive
                  ? "#dce3f5"
                  : "#e6ecf5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isActive
                  ? "#dce3f5"
                  : "#ffffff";
              }}
            >
              {questionNumber}. Soru:{" "}
              <strong
                style={{
                  color: rawAnswer ? "#001b66" : "#888",
                  fontWeight: 600,
                }}
              >
                {answer}
              </strong>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
