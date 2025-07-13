import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPracticeExamThunk } from "../../../features/thunks/practiceExamThunk";
import "./practiceExam.css";

export default function PracticeExam() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { practiceExam, isLoading } = useSelector(
    (state) => state.practiceExam
  );

  useEffect(() => {
    dispatch(getPracticeExamThunk());
  }, [dispatch]);

  const handleStartExam = (examId) => {
    navigate(`/practice-questions/${examId}`);
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "200px" }}
      >
        <div
          className="spinner-border text-primary"
          role="status"
          aria-hidden="true"
        ></div>
        <span className="ms-2">Yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="practice-exams-container">
      <h2 className="practice-exams-header">
        <i className="bi bi-image me-2" style={{ color: "#001b66" }}></i>
        Pratik Sınav
      </h2>

      <div className="row g-4">
        {practiceExam.map((exam) => {
          const canStart = true; // 👈 bunu backend’den almak istersen burada değiştir.
          const examKey = `exam-${exam.id}`; // Benzersiz key

          return (
            <div key={examKey} className="col-12">
              <div className="practice-exam-card">
                <ul className="practice-exam-info-list">
                  <ul className="practice-exam-info-list">
                    <li>
                      <i
                        className="bi bi-clock"
                        style={{ color: "#0056cc" }}
                      ></i>
                      <strong>Sınav Süresi:</strong>{" "}
                      {exam?.duration === 0
                        ? "Süresiz"
                        : exam?.duration ?? "Belirtilmemiş"}{" "}
                      dakika
                    </li>
                    <li>
                      <i
                        className="bi bi-person"
                        style={{ color: "#0056cc" }}
                      ></i>
                      <strong>Soru Sayısı:</strong>{" "}
                      {exam?.question_count ?? "Belirtilmemiş"}
                    </li>
                  </ul>

                  <li>
                    <i
                      className="bi bi-person"
                      style={{ color: "#0056cc" }}
                    ></i>
                    <strong>Soru Sayısı:</strong>{" "}
                    {exam?.question_count ?? "Belirtilmemiş"}
                  </li>
                </ul>

                <button
                  onClick={() => handleStartExam(exam.id)}
                  className={`btn-start-exam mt-auto ${
                    !canStart ? "btn-secondary" : ""
                  }`}
                  aria-label={`Sınavı Başlat: ${exam.name}`}
                  disabled={!canStart}
                  title={!canStart ? "Sınav henüz başlamadı." : undefined}
                >
                  Sınavı Başlat
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
