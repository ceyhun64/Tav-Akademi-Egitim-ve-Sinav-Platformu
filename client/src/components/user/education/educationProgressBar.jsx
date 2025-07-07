import React from "react";

export default function EducationProgressSidebar({
  eduIds = [],
  currentEduId,
  completedEducations = [],
}) {
  return (
    <div
      className="border rounded-3 p-3 shadow-sm bg-white"
      style={{ minWidth: "250px", borderColor: "#001b66" }}
    >
      <h5 className="text-center mb-3" style={{ color: "#001b66" }}>
        Eğitim İlerlemesi
      </h5>
      <ul className="list-group">
        {eduIds.map((eduId, index) => {
          const isCompleted = completedEducations.some(
            (completedEdu) => String(completedEdu.id) === String(eduId)
          );
          const isCurrent = String(eduId) === String(currentEduId);

          return (
            <li
              key={eduId}
              className={`list-group-item d-flex justify-content-between align-items-center rounded-2 ${
                isCurrent
                  ? "bg-primary text-white fw-semibold"
                  : "bg-light text-dark"
              }`}
              style={{
                marginBottom: "0.5rem",
                border: isCurrent ? "1px solid #001b66" : "1px solid #dee2e6",
              }}
            >
              <span>
                <i className="bi bi-journal-text me-2"></i>
                Eğitim {index + 1}
              </span>
              <i
                className={`bi ${
                  isCompleted
                    ? "bi-check-circle-fill text-success"
                    : "bi-clock text-warning"
                }`}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
