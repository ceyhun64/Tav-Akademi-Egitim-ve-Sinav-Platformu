export default function QuestionNavigator({ total, current, setCurrent ,isMobile }) {
  const primaryColor = "#001b66";

  return (
    <div className="d-flex justify-content-between mt-3">
      <button
        className="btn d-flex align-items-center gap-2 px-4 py-2"
        onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
        disabled={current === 0}
        style={{
          backgroundColor: current === 0 ? "#ccc" : primaryColor,
          color: current === 0 ? "#666" : "#fff",
          border: "none",
          borderRadius: "8px",
          transition: "all 0.2s ease-in-out",
        }}
      >
        <i className="bi bi-arrow-left" style={{ color: "white" }} />
        Önceki
      </button>

      <button
        className="btn d-flex align-items-center gap-2 px-4 py-2"
        onClick={() => setCurrent((prev) => Math.min(prev + 1, total - 1))}
        disabled={current === total - 1}
        style={{
          backgroundColor: current === total - 1 ? "#ccc" : primaryColor,
          color: current === total - 1 ? "#666" : "#fff",
          border: "none",
          borderRadius: "8px",
          transition: "all 0.2s ease-in-out",
        }}
      >
        Sonraki
        <i className="bi bi-arrow-right" style={{ color: "white" }} />
      </button>
    </div>
  );
}
